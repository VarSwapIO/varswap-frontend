export const YOUR_LIQUIDITY_MOCKDATA: YOUR_LIQUIDITY = {
  coin_x: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    symbol: 'VARA',
    name: 'Vara Network',
    decimals: 12,
    address: '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
  },
  coin_x_amount: 1000000000000000,
  coin_y: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 12,
    address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
  },
  coin_y_amount: 10000000000,
  lp_amount: 100,
  lp_percent: 100
}

export const TOKEN_LIST: TOKEN_METADATA[] = [
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    symbol: 'VARA',
    name: 'Vara Network',
    decimals: 12,
    address: 'NATIVE'
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    symbol: 'WVARA',
    name: 'WVara',
    decimals: 12,
    address: '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 12,
    address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
  },
  {
    icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
    symbol: 'USDC',
    name: 'USDC',
    decimals: 12,
    address: '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585'
  },
]

export const BALANCE_TOKEN: { [key: string]: any } = {
  '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40': {
    totalBalance: 1000000000000000
  },
  '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738': {
    totalBalance: 1000000000000000
  }
}