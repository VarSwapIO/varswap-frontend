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
  if (address === 'NATIVE' || address === '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40') {
    return 'NATIVE'
  }
  return address
}
export const convertNativeToAddress = (address: string) => {
  if (address === 'NATIVE') {
    return '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
  }
  return address
}

export const POOL_IDS = [
  '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4', // vara-usdt
  '0x19fef5d5a61320d2e5cb424c3a27f67850a05c7453c4139d10d0330ed820fb07', // vara-usdc
  '0x3bab4dfd064d6054db3479a5cdbafe0d2f5adef31d5c18af1d87f8d9a174e4f6', // usdt-usdc
]

export const INFO_POOL_BY_ID: { [key: string]: YOUR_LIQUIDITY_METADATA } = {
  '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9': {
    amount: '0',
    decimals: 12,
    name: 'USDT-VARA_LP',
    symbol: 'USDT-VARA_LP',
    coin_x: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 12,
      address: '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9'
    },
    coin_y: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
      symbol: 'TVARA',
      name: 'Vara Network Testnet',
      decimals: 12,
      address: '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
    },
    pool_id: '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4'
  },
  '0xa832bcdaee942b4769f8186a542e53f7185594bdfc968fcf1bb18d2f9ad4d2c7': {
    amount: '0',
    decimals: 12,
    name: 'USDC-VARA_LP',
    symbol: 'USDC-VARA_LP',
    coin_x: {
      icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 12,
      address: '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585'
    },
    coin_y: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
      symbol: 'TVARA',
      name: 'Vara Network Testnet',
      decimals: 12,
      address: '0x11fda7b731d6021757433ae7e8c5d212aeaed36f608a1061c67efde68019957e'
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
      address: '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9'
    },
    coin_y: {
      icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
      symbol: 'USDC',
      name: 'USDC',
      decimals: 12,
      address: '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585'
    },
    pool_id: '0x3bab4dfd064d6054db3479a5cdbafe0d2f5adef31d5c18af1d87f8d9a174e4f6'
  }
}