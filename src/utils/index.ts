import { BigInt, dataSource, ethereum } from '@graphprotocol/graph-ts'

import { Transaction } from '../../generated/schema'

import { MONAD_TESTNET } from './constants'

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    '0x0000000000000000000000000000000000000000000000000000000000000001'
  )
}

export function getChainId(): i32 {
  const network = dataSource.network()
  if (network == 'monad-testnet') {
    return MONAD_TESTNET as i32
  } else {
    throw new Error('Unknown network: ' + network)
  }
}

export function normalizeDailyTimestamp(timestamp: BigInt): BigInt {
  return timestamp.minus(timestamp.mod(BigInt.fromI32(86400)))
}

export function createTransaction(event: ethereum.Event): void {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString())
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.gasPrice = event.transaction.gasPrice
    transaction.save()
  }
}
