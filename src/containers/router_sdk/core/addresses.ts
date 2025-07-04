import { ChainId } from "./chains"
import { Token } from "./entities"

export const WVARA = {
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40',
    12,
    'WVARA',
    'Wrapped VARA',
  ),
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40',
    12,
    'WVARA',
    'Wrapped VARA'),
}
export const USDC = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585',
    12,
    'USDC',
    'USD Coin',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585',
    12,
    'USDC',
    'USD Coin',
  ),
}

export const USDT = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9',
    12,
    'USDT',
    'Tether USD',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9',
    12,
    'USDT',
    'Tether USD',
  ),
}

export const WUSDC = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x46896891852a364d9fe38b52e4061da85a00f6118415715c40d86a1f4ca00414',
    6,
    'WUSDC',
    'Wrapped USDC',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x46896891852a364d9fe38b52e4061da85a00f6118415715c40d86a1f4ca00414',
    6,
    'WUSDC',
    'Wrapped USDC',
  ),
}

export const WUSDT = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x77e704ac1c6129d147ecc6b5ddadc80dd1945505bb9654b23e41153ed0737e49',
    6,
    'WUSDT',
    'Wrapped USDT',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x77e704ac1c6129d147ecc6b5ddadc80dd1945505bb9654b23e41153ed0737e49',
    6,
    'WUSDT',
    'Wrapped USDT',
  ),
}

export const WETH = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x1f2af47fa11e08e9a7e9bf81d84d166e425e1f13104690b33f4fd4c4ddca6709',
    18,
    'WETH',
    'Wrapped ETH',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x1f2af47fa11e08e9a7e9bf81d84d166e425e1f13104690b33f4fd4c4ddca6709',
    18,
    'WETH',
    'Wrapped ETH',
  ),
}
// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.TESTNET]: [
    WVARA[ChainId.TESTNET],
    USDC[ChainId.TESTNET],
    USDT[ChainId.TESTNET],
    WUSDC[ChainId.TESTNET],
    WUSDT[ChainId.TESTNET],
    WETH[ChainId.TESTNET],
  ],
  [ChainId.MAINNET]: [
    WVARA[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
    USDT[ChainId.MAINNET],
    WUSDC[ChainId.MAINNET],
    WUSDT[ChainId.MAINNET],
    WETH[ChainId.MAINNET],
  ],
  
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}