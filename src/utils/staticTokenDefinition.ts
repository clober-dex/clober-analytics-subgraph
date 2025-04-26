import { Address, BigInt } from '@graphprotocol/graph-ts'

// Initialize a Token Definition with the attributes
export class StaticTokenDefinition {
  address: Address
  symbol: string
  name: string
  decimals: BigInt

  // Initialize a Token Definition with its attributes
  constructor(
    address: Address,
    symbol: string,
    name: string,
    decimals: BigInt,
  ) {
    this.address = address
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
  }

  // Get all tokens with a static defintion
  static getStaticDefinitions(): Array<StaticTokenDefinition> {
    const staticDefinitions = new Array<StaticTokenDefinition>()

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xf817257fed379853cde0fa4f97ab987181b1e5ea'),
        'USDC',
        'USD Coin',
        BigInt.fromI32(6),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x1d074e003e222905e31476a8398e36027141915b'),
        'MON-TGE',
        'Monad Pre-TGE Futures',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xcaef04f305313080c2538e585089846017193033'),
        'USOILSPOT-250516',
        'USOILSPOT 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xcaffd292a5c578dbd4bbff733f1553bf2cd8850c'),
        'XAU-250516',
        'XAU 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x746e48e2cdd8f6d0b672adac7810f55658dc801b'),
        'EUR-250516',
        'EUR 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x5f433cfeb6cb2743481a096a56007a175e12ae23'),
        'BTC-250516',
        'BTC 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x53e2bb2d88ddc44cc395a0cbcddc837aef44116d'),
        'AAPL-250516',
        'AAPL 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xd57e27d90e04eae2eecbc63ba28e433098f72855'),
        'GOOGL-250516',
        'GOOGL 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xdb1aa7232c2ff7bb480823af254453570d0e4a16'),
        'TSLA-250516',
        'TSLA 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x24a08695f06a37c8882cd1588442ec40061e597b'),
        'BRK-A-250516',
        'BRK-A 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x41df9f8a0c014a0ce398a3f2d1af3164ff0f492a'),
        'US30Y-250516',
        'US30Y 2025-05-16',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x836047a99e11f376522b447bffb6e3495dd0637c'),
        'oWETH',
        'Orbiter Wrapped ETH',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x0efed4d9fb7863ccc7bb392847c08dcd00fe9be2'),
        'muBOND',
        'muBOND',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xa296f47e8ff895ed7a092b4a9498bb13c46ac768'),
        'wWETH',
        'Wormhole Wrapped ETH',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xb5a30b0fdc5ea94a52fdc42e3e9760cb8449fb37'),
        'WETH',
        'WETH',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xf62f63169ca4085af82c3a147475efde3edd4b50'),
        'HIVE',
        'Hive Stablecoin',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x43d614b1ba4ba469faeaa4557aeafdec039b8795'),
        'MOCKB',
        'MockB',
        BigInt.fromI32(6),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xb38bb873cca844b20a9ee448a87af3626a6e1ef5'),
        'MIST',
        'MistToken',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x760afe86e5de5fa0ee542fc7b7b713e1c5425701'),
        'WMON',
        'Wrapped Monad Token',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x0f0bdebf0f83cd1ee3974779bcb7315f9808c714'),
        'DAK',
        'Molandak',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xfe140e1dce99be9f4f15d657cd9b7bf622270c50'),
        'YAKI',
        'Moyaki',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xe0590015a873bf326bd645c3e1266d4db41c4e6b'),
        'CHOG',
        'Chog',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x3b37b6d72c8149b35f160cdd87f974dd293a094a'),
        'RWAGMI',
        'RWAGMI',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xb2f82d0f38dc453d596ad40a37799446cc89274a'),
        'aprMON',
        'aPriori Monad LST',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xaeef2f6b429cb59c9b2d7bb2141ada993e8571c3'),
        'gMON',
        'gMON',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0xe1d2439b75fb9746e7bc6cb777ae10aa7f7ef9c5'),
        'sMON',
        'StakedMonad',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x3a98250f98dd388c211206983453837c8365bdc1'),
        'shMON',
        'ShMonad',
        BigInt.fromI32(18),
      ),
    )

    staticDefinitions.push(
      new StaticTokenDefinition(
        Address.fromString('0x88b8e2161dedc77ef4ab7585569d2415a1c1055d'),
        'USDT',
        'Tether USD',
        BigInt.fromI32(6),
      ),
    )

    return staticDefinitions
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: Address): StaticTokenDefinition | null {
    const staticDefinitions = this.getStaticDefinitions()
    const tokenAddressHex = tokenAddress.toHexString()

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      const staticDefinition = staticDefinitions[i]
      if (staticDefinition.address.toHexString() == tokenAddressHex) {
        return staticDefinition
      }
    }

    // If not found, return null
    return null
  }
}
