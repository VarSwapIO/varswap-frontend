import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';
import _ from 'lodash'
import { VARA_TOKEN_BASE } from './initData';
type COINTYPE_BY_CHAIN = { [key in CHAIN_NAME_TYPE]: {
  [key: string]: COIN_METADATA
} }
type COINTYPE_BY_CHAIN_ARR = { [key in CHAIN_NAME_TYPE]: COIN_METADATA[]
}

interface AssetStateProps {
  cointype_by_chain: COINTYPE_BY_CHAIN
  cointype_by_chain_arr: COINTYPE_BY_CHAIN_ARR;
  price_usdt_per_token: { [key: string]: number };
}
interface AssetActionProps {
  updatePriceTokenUSD: (data: { [key: string]: number }) => void;
  updateCoinTypeByChain: (data: COIN_METADATA[], chain: CHAIN_NAME_TYPE) => void;
}

interface AssetState extends AssetStateProps, AssetActionProps {

}

const init_state: AssetStateProps = {
  cointype_by_chain: {
    'VARA': {
      "NATIVE": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
        symbol: 'TVARA',
        name: 'Vara Network Testnet',
        decimals: 12,
        address: 'NATIVE'
      },
      "0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
        symbol: 'WVARA',
        name: 'WVara Network',
        decimals: 12,
        address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
      },
      "0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        symbol: 'USDT',
        name: 'USDT',
        decimals: 12,
        address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
      },
      "0x8c73bfc6eb50445a5543714a0c345ada1c7469dbe36a9290e7470e6ad9040fc7": {
        icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        symbol: 'USDC',
        name: 'USDC',
        decimals: 12,
        address: '0x8c73bfc6eb50445a5543714a0c345ada1c7469dbe36a9290e7470e6ad9040fc7'
      },
    },
  },
  cointype_by_chain_arr: {
    'VARA': VARA_TOKEN_BASE,
  },
  price_usdt_per_token: {
  },
}


export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      ...init_state,
      updatePriceTokenUSD: (data: { [key: string]: number }) => {
        set({
          price_usdt_per_token: data
        })
      },
      updateCoinTypeByChain: (data: COIN_METADATA[], chain: CHAIN_NAME_TYPE) => {
        const data_current = get().cointype_by_chain_arr;
        const data_updated = _.uniqBy([...data, ...data_current?.[chain]], 'address');
        const data_to_obj = _.keyBy(data_updated, 'address');
        set((state) => (
          {
            cointype_by_chain_arr: {
              ...state.cointype_by_chain_arr,
              [chain]: data_updated
            },
            cointype_by_chain: {
              ...state.cointype_by_chain,
              [chain]: {
                ...data_to_obj,
                "0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8": {
                  icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
                  symbol: 'WVARA',
                  name: 'WVara Network',
                  decimals: 12,
                  address: '0x0902f92a4ba0747e0a379a67c4c5178a8d833bdb5727932e1310a20b8a049af8'
                },
              }
            }
          }
        ))
      },
    }),
    {
      name: 'assets-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)