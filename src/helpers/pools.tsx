import { Currency } from "@/containers/router_sdk/core";

export enum Field {
  INPUT = 'token_in',
  OUTPUT = 'token_out',
}

export enum Field_Sort {
  INPUT = 'token_x',
  OUTPUT = 'token_y',
}

export enum Field_Liquidity {
  INPUT = 'token_in',
  OUTPUT = 'token_out',
  MINIMUM_INPUT = 'minimum_input',
  MINIMUM_OUTPUT = 'minimum_output',
  LP_AMOUNT = 'lp_amount',
  LP_AMOUNT_PERCENT = 'lp_amount_percent',
  PRICE_XY = 'price_xy',
  PRICE_YX = 'price_yx'
}


export type TOKEN_SWAP_METADATA = { [key in Field]: COIN_METADATA | undefined };
export type TOKEN_SORT_METADATA = { [key in Field_Sort]: Currency | undefined };
export type AMOUNT_LIQUIDITY = { [key in Field]: string | number | undefined };
export type AMOUNT_ADD_LIQUIDITY = { [key in Field_Liquidity]: string | number | undefined };


export const checkSort = (token_in: string, token_out: string) => {
  return token_in?.toLowerCase() > token_out?.toLowerCase()
}

export const quote = (amount: number, token_x: number, token_y: number) => {
  return amount * token_y / token_x
}

export const token_in_pool = (amount_lp: number, token_reserver: number, total_supply: number) => {
  return (token_reserver * (amount_lp / total_supply)).toFixed(0)
}
export const convertToAddressNative = (address: string) => {
  if (address === 'NATIVE' || address === '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8') {
    return 'NATIVE'
  }
  return address
}
export const convertNativeToAddress = (address: string) => {
  if (address === 'NATIVE') {
    return '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
  }
  return address
}

export const POOL_IDS = [
  '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4', // vara-usdt
  '0x19fef5d5a61320d2e5cb424c3a27f67850a05c7453c4139d10d0330ed820fb07', // vara-usdc
  '0x3bab4dfd064d6054db3479a5cdbafe0d2f5adef31d5c18af1d87f8d9a174e4f6', // usdt-usdc
]

export const INFO_POOL_BY_ID: { [key: string]: YOUR_LIQUIDITY_METADATA } = {
  '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4': {
    amount: '0',
    decimals: 12,
    name: 'USDT-VARA_LP',
    symbol: 'USDT-VARA_LP',
    coin_x: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 12,
      address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
    },
    coin_y: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
      symbol: 'TVARA',
      name: 'Vara Network Testnet',
      decimals: 12,
      address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
    },
    pool_id: '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4'
  },
  '0x19fef5d5a61320d2e5cb424c3a27f67850a05c7453c4139d10d0330ed820fb07': {
    amount: '0',
    decimals: 12,
    name: 'USDC-VARA_LP',
    symbol: 'USDC-VARA_LP',
    coin_x: {
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 12,
      address: '0x8c73bfc6eb50445a5543714a0c345ada1c7469dbe36a9290e7470e6ad9040fc7'
    },
    coin_y: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
      symbol: 'TVARA',
      name: 'Vara Network Testnet',
      decimals: 12,
      address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
    },
    pool_id: '0x19fef5d5a61320d2e5cb424c3a27f67850a05c7453c4139d10d0330ed820fb07'
  },
  '0x3bab4dfd064d6054db3479a5cdbafe0d2f5adef31d5c18af1d87f8d9a174e4f6': {
    amount: '0',
    decimals: 12,
    name: 'USDT-USDC_LP',
    symbol: 'USDT-USDC_LP',
    coin_x: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 12,
      address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
    },
    coin_y: {
      icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 12,
      address: '0x8c73bfc6eb50445a5543714a0c345ada1c7469dbe36a9290e7470e6ad9040fc7'
    },
    pool_id: '0x3bab4dfd064d6054db3479a5cdbafe0d2f5adef31d5c18af1d87f8d9a174e4f6'
  }
}