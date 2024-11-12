export const YOUR_LIQUIDITY_MOCKDATA: YOUR_LIQUIDITY = {
  coin_x: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    symbol: 'VARA',
    name: 'Vara Network',
    decimals: 12,
    address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
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
    address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 12,
    address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
  },
  {
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    symbol: 'USDC',
    name: 'USDC',
    decimals: 12,
    address: '0x8c73bfc6eb50445a5543714a0c345ada1c7469dbe36a9290e7470e6ad9040fc7'
  },
]

export const BALANCE_TOKEN: { [key: string]: any } = {
  '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8': {
    totalBalance: 1000000000000000
  },
  '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738': {
    totalBalance: 1000000000000000
  }
}