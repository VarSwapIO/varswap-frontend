export const YOUR_LIQUIDITY_MOCKDATA: YOUR_LIQUIDITY = {
  coin_x: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    symbol: 'VARA',
    name: 'Vara Network',
    decimals: 12,
    address: '0x0'
  },
  coin_x_amount: 1000000000000000,
  coin_y: {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 6,
    address: '0x0::usdt'
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
    address: '0x0'
  },
  {
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    symbol: 'USDT',
    name: 'USDT',
    decimals: 6,
    address: '0x0::usdt'
  },
]

export const BALANCE_TOKEN: { [key: string]: any } = {
  '0x0': {
    totalBalance: 1000000000000000
  },
  '0x0::usdt': {
    totalBalance: 100000000
  }
}