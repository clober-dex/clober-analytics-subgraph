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
  Transaction,
  WalletDayData,
  WalletTokenDayVolume,
} from '../../generated/schema'
import { createTransaction, normalizeDailyTimestamp } from '../utils'
import { ONE_BI, ZERO_BI } from '../utils/constants'

function updateDayData(event: ethereum.Event): void {
  const noarmalizedTimestamp = normalizeDailyTimestamp(event.block.timestamp)

  const cloberDayDataKey = noarmalizedTimestamp.toString()
  let cloberDayData = CloberDayData.load(cloberDayDataKey)
  if (cloberDayData === null) {
    cloberDayData = new CloberDayData(cloberDayDataKey)
    cloberDayData.date = noarmalizedTimestamp
    cloberDayData.txCount = ZERO_BI
    cloberDayData.walletCount = ZERO_BI
  }

  const walletDayDateKey = event.transaction.from
    .toHexString()
    .concat('-')
    .concat(noarmalizedTimestamp.toString())
  let walletDayData = WalletDayData.load(walletDayDateKey)
  if (walletDayData === null) {
    walletDayData = new WalletDayData(walletDayDateKey)
    walletDayData.date = noarmalizedTimestamp
    walletDayData.txCount = ZERO_BI
    walletDayData.wallet = event.transaction.from

    cloberDayData.walletCount = cloberDayData.walletCount.plus(ONE_BI)
  }

  if (Transaction.load(event.transaction.hash.toHexString()) === null) {
    walletDayData.txCount = walletDayData.txCount.plus(ONE_BI)
    cloberDayData.txCount = cloberDayData.txCount.plus(ONE_BI)

    createTransaction(event)
  }

  cloberDayData.save()
  walletDayData.save()
}

function updateTokenVolume(
  event: ethereum.Event,
  tokenAddress: Address,
  volumeAmount: BigInt,
): void {
  const noarmalizedTimestamp = normalizeDailyTimestamp(event.block.timestamp)
  const cloberTokenDayVolumeKey = noarmalizedTimestamp
    .toString()
    .concat('-')
    .concat(tokenAddress.toHexString())
  let cloberTokenDayVolume = CloberTokenDayVolume.load(cloberTokenDayVolumeKey)
  if (cloberTokenDayVolume === null) {
    cloberTokenDayVolume = new CloberTokenDayVolume(cloberTokenDayVolumeKey)
    cloberTokenDayVolume.date = noarmalizedTimestamp
    cloberTokenDayVolume.cloberDayData = noarmalizedTimestamp.toString()
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
    .concat(noarmalizedTimestamp.toString())
    .concat('-')
    .concat(tokenAddress.toHexString())
  let walletTokenDayVolume = WalletTokenDayVolume.load(walletTokenDayVolumeKey)
  if (walletTokenDayVolume === null) {
    walletTokenDayVolume = new WalletTokenDayVolume(walletTokenDayVolumeKey)
    walletTokenDayVolume.date = noarmalizedTimestamp
    walletTokenDayVolume.walletDayData = origin
      .toHexString()
      .concat('-')
      .concat(noarmalizedTimestamp.toString())
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

  updateTokenVolume(
    event,
    Address.fromBytes(book.quote),
    event.params.unit.times(book.unitSize),
  )
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
}
