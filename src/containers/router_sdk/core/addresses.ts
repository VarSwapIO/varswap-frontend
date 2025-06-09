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

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  [ChainId.TESTNET]: [
    WVARA[ChainId.TESTNET],
    USDC[ChainId.TESTNET],
    USDT[ChainId.TESTNET],
  ],
  [ChainId.MAINNET]: [
    WVARA[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
    USDT[ChainId.MAINNET],
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}

export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {}