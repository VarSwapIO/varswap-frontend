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
  '0x916dfa5d75104faf741ca09a985df052bbeea0727aa5e9f0d6d39b40b26c1069', // vara-usdt
  '0x7b93fba12b2ac46b40a75a67f3b3bf086f35002f211638195f40c2082c37b056', // vara-usdc
  '0x75cb67a9e338698d188564edd0fade3743e0f4be89bb88bc0761740217511fa3', // usdt-usdc
]

export const INFO_POOL_BY_ID: { [key: string]: YOUR_LIQUIDITY_METADATA } = {
  '0x916dfa5d75104faf741ca09a985df052bbeea0727aa5e9f0d6d39b40b26c1069': {
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
    pool_id: '0x636408183001f30736159e6b3efe6844bba3a66fb099faeb9a734538e92eb4a5'
  },
  '0x7b93fba12b2ac46b40a75a67f3b3bf086f35002f211638195f40c2082c37b056': {
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
    pool_id: '0x79050bdd1891473f95b6e8a6ac24482a8996ebef04638e1a7586f9e9a7b8ff27'
  },
  '0x75cb67a9e338698d188564edd0fade3743e0f4be89bb88bc0761740217511fa3': {
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
    pool_id: '0xc42cecfc3be16f3172e1963a6bf422c2c42348775a0928cb07729b7628b08081'
  }
}