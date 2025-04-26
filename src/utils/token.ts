import { BigInt, Address } from '@graphprotocol/graph-ts'

import { Token } from '../../generated/schema'
import { ERC20SymbolBytes } from '../../generated/BookManager/ERC20SymbolBytes'
import { ERC20 } from '../../generated/BookManager/ERC20'
import { ERC20NameBytes } from '../../generated/BookManager/ERC20NameBytes'

import { ADDRESS_ZERO, MONAD_TESTNET } from './constants'
import { StaticTokenDefinition } from './staticTokenDefinition'

import { getChainId, isNullEthValue } from '.'

export function getOrCreateToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHexString())
  if (token === null) {
    const chainId = getChainId()
    token = new Token(tokenAddress.toHexString())
    token.symbol = fetchTokenSymbol(tokenAddress, chainId)
    token.name = fetchTokenName(tokenAddress, chainId)
    token.decimals = fetchTokenDecimals(tokenAddress)
    token.save()
  }
  return token
}

function getNativeTokenSymbol(chainId: i32): string {
  if (chainId == MONAD_TESTNET) {
    return 'MON'
  } else {
    return 'ETH'
  }
}

function fetchTokenSymbol(tokenAddress: Address, chainId: i32): string {
  if (tokenAddress.toHexString() == ADDRESS_ZERO) {
    return getNativeTokenSymbol(chainId)
  }
  const staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
  if (staticTokenDefinition != null) {
    return staticTokenDefinition.symbol
  }
  const contract = ERC20.bind(tokenAddress)
  const contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

function getNativeTokenName(chainId: i32): string {
  if (chainId == MONAD_TESTNET) {
    return 'Monad Token'
  } else {
    return 'Ether'
  }
}

function fetchTokenName(tokenAddress: Address, chainId: i32): string {
  if (tokenAddress.toHexString() == ADDRESS_ZERO) {
    return getNativeTokenName(chainId)
  }
  const staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
  if (staticTokenDefinition != null) {
    return staticTokenDefinition.name
  }
  const contract = ERC20.bind(tokenAddress)
  const contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  const nameResult = contract.try_name()
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

function fetchTokenDecimals(tokenAddress: Address): BigInt {
  if (tokenAddress.toHexString() == ADDRESS_ZERO) {
    return BigInt.fromI32(18)
  }
  const staticTokenDefinition = StaticTokenDefinition.fromAddress(tokenAddress)
  if (staticTokenDefinition != null) {
    return staticTokenDefinition.decimals
  }
  const contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = null
  const decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }

  return BigInt.fromI32(decimalValue as i32)
}
