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
    '0xb78e078fa0947e4e3a21f0edf7104f7208119d547cc91dc28dbc0d80cc072c0c',
    18,
    'WUSDC',
    'Wrapped USDC',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xb78e078fa0947e4e3a21f0edf7104f7208119d547cc91dc28dbc0d80cc072c0c',
    18,
    'WUSDC',
    'Wrapped USDC',
  ),
}

export const WUSDT = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x2156679a6147013e5217fa3b8210d0ce4986c54aaffcfa70c4a171c7a8b6afd9',
    18,
    'WUSDT',
    'Wrapped USDT',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0x2156679a6147013e5217fa3b8210d0ce4986c54aaffcfa70c4a171c7a8b6afd9',
    18,
    'WUSDT',
    'Wrapped USDT',
  ),
}

export const WETH = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xaa6bc2ad1b660f6e7aaf3cb3418e6f66fe8c78f55400051b1d8bef0483976a42',
    18,
    'WETH',
    'Wrapped ETH',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xaa6bc2ad1b660f6e7aaf3cb3418e6f66fe8c78f55400051b1d8bef0483976a42',
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