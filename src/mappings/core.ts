import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts'

import {
  Cancel,
  Claim,
  Make,
  Open,
  Take,
  Transfer,
} from '../../generated/BookManager/BookManager'
import { Burn, Mint } from '../../generated/Rebalancer/Rebalancer'
import { Swap } from '../../generated/RouterGateway/RouterGateway'
import {
  Book,
  CloberDayData,
  CloberTokenDayVolume,
  CloberTransactionTypeDayData,
  Trade,
  Transaction,
  WalletDayData,
  WalletTokenDayVolume,
} from '../../generated/schema'
import { createTransaction, normalizeDailyTimestamp } from '../utils'
import { ONE_BI, ZERO_BI } from '../utils/constants'
import { tickToPrice, unitToBase, unitToQuote } from '../utils/math'

function updateDayData(event: ethereum.Event): void {
  const method = event.transaction.input.toHexString().slice(0, 10)
  const normalizedTimestamp = normalizeDailyTimestamp(event.block.timestamp)

  const cloberDayDataKey = normalizedTimestamp.toString()
  let cloberDayData = CloberDayData.load(cloberDayDataKey)
  if (cloberDayData === null) {
    cloberDayData = new CloberDayData(cloberDayDataKey)
    cloberDayData.date = normalizedTimestamp
    cloberDayData.txCount = ZERO_BI
    cloberDayData.walletCount = ZERO_BI
  }

  const walletDayDateKey = event.transaction.from
    .toHexString()
    .concat('-')
    .concat(normalizedTimestamp.toString())
  let walletDayData = WalletDayData.load(walletDayDateKey)
  if (walletDayData === null) {
    walletDayData = new WalletDayData(walletDayDateKey)
    walletDayData.date = normalizedTimestamp
    walletDayData.txCount = ZERO_BI
    walletDayData.wallet = event.transaction.from

    cloberDayData.walletCount = cloberDayData.walletCount.plus(ONE_BI)
  }

  const cloberTransactionTypeDayDataKey = normalizedTimestamp
    .toString()
    .concat('-')
    .concat(method)
  let cloberTransactionTypeDayData = CloberTransactionTypeDayData.load(
    cloberTransactionTypeDayDataKey,
  )
  if (cloberTransactionTypeDayData === null) {
    cloberTransactionTypeDayData = new CloberTransactionTypeDayData(
      cloberTransactionTypeDayDataKey,
    )
    cloberTransactionTypeDayData.date = normalizedTimestamp
    cloberTransactionTypeDayData.cloberDayData = cloberDayData.id
    cloberTransactionTypeDayData.type = method
    cloberTransactionTypeDayData.txCount = ZERO_BI
  }

  if (Transaction.load(event.transaction.hash.toHexString()) === null) {
    walletDayData.txCount = walletDayData.txCount.plus(ONE_BI)
    cloberDayData.txCount = cloberDayData.txCount.plus(ONE_BI)
    cloberTransactionTypeDayData.txCount =
      cloberTransactionTypeDayData.txCount.plus(ONE_BI)

    createTransaction(event)
  }

  cloberDayData.save()
  walletDayData.save()
  cloberTransactionTypeDayData.save()
}

function updateTokenVolume(
  event: ethereum.Event,
  tokenAddress: Address,
  volumeAmount: BigInt,
): void {
  const normalizedTimestamp = normalizeDailyTimestamp(event.block.timestamp)
  const cloberTokenDayVolumeKey = normalizedTimestamp
    .toString()
    .concat('-')
    .concat(tokenAddress.toHexString())
  let cloberTokenDayVolume = CloberTokenDayVolume.load(cloberTokenDayVolumeKey)
  if (cloberTokenDayVolume === null) {
    cloberTokenDayVolume = new CloberTokenDayVolume(cloberTokenDayVolumeKey)
    cloberTokenDayVolume.date = normalizedTimestamp
    cloberTokenDayVolume.cloberDayData = normalizedTimestamp.toString()
    cloberTokenDayVolume.token = tokenAddress
    cloberTokenDayVolume.volume = volumeAmount
  } else {
    cloberTokenDayVolume.volume = cloberTokenDayVolume.volume.plus(volumeAmount)
  }
  cloberTokenDayVolume.save()

  const origin = event.transaction.from
  const walletTokenDayVolumeKey = origin
    .toHexString()
    .concat('-')
    .concat(normalizedTimestamp.toString())
    .concat('-')
    .concat(tokenAddress.toHexString())
  let walletTokenDayVolume = WalletTokenDayVolume.load(walletTokenDayVolumeKey)
  if (walletTokenDayVolume === null) {
    walletTokenDayVolume = new WalletTokenDayVolume(walletTokenDayVolumeKey)
    walletTokenDayVolume.date = normalizedTimestamp
    walletTokenDayVolume.walletDayData = origin
      .toHexString()
      .concat('-')
      .concat(normalizedTimestamp.toString())
    walletTokenDayVolume.token = tokenAddress
    walletTokenDayVolume.volume = volumeAmount
  } else {
    walletTokenDayVolume.volume = walletTokenDayVolume.volume.plus(volumeAmount)
  }
  walletTokenDayVolume.save()
}

export function handleOpen(event: Open): void {
  const book = new Book(event.params.id.toString())
  book.quote = event.params.quote
  book.base = event.params.base
  book.unitSize = event.params.unitSize
  book.save()
}

export function handleMake(event: Make): void {
  updateDayData(event)
}

export function handleTake(event: Take): void {
  if (event.params.unit.isZero()) {
    return
  }

  const book = Book.load(event.params.bookId.toString())
  if (book === null) {
    log.error('[TAKE] Book not found: {}', [event.params.bookId.toString()])
    return
  }

  updateDayData(event)

  const inputAmount = unitToBase(
    book,
    event.params.unit,
    tickToPrice(event.params.tick),
  )
  const outputAmount = unitToQuote(book, event.params.unit)

  updateTokenVolume(event, Address.fromBytes(book.quote), outputAmount)

  const trade = new Trade(
    event.transaction.hash
      .toHexString()
      .concat('-')
      .concat(event.logIndex.toString()),
  )
  trade.transaction = event.transaction.hash.toHexString()
  trade.timestamp = event.block.timestamp
  trade.inputToken = book.base
  trade.outputToken = book.quote
  trade.origin = event.transaction.from
  trade.inputAmount = inputAmount
  trade.outputAmount = outputAmount
  trade.logIndex = event.logIndex
  trade.save()
}

export function handleCancel(event: Cancel): void {
  updateDayData(event)
}

export function handleClaim(event: Claim): void {
  updateDayData(event)
}

export function handleTransfer(event: Transfer): void {
  updateDayData(event)
}

export function handleMint(event: Mint): void {
  updateDayData(event)
}

export function handleBurn(event: Burn): void {
  updateDayData(event)
}

export function handleSwap(event: Swap): void {
  updateDayData(event)

  updateTokenVolume(event, event.params.inToken, event.params.amountIn)

  const trade = new Trade(
    event.transaction.hash
      .toHexString()
      .concat('-')
      .concat(event.logIndex.toString()),
  )
  trade.transaction = event.transaction.hash.toHexString()
  trade.timestamp = event.block.timestamp
  trade.inputToken = event.params.inToken
  trade.outputToken = event.params.outToken
  trade.origin = event.transaction.from
  trade.inputAmount = event.params.amountIn
  trade.outputAmount = event.params.amountOut
  trade.logIndex = event.logIndex
  trade.save()
}
