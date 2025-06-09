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
      "0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
        symbol: 'WVARA',
        name: 'WVara Network',
        decimals: 12,
        address: '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
      },
      "0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        symbol: 'USDT',
        name: 'USDT',
        decimals: 12,
        address: '0x3efbbfe9657b8d733a031a35902f6806279c4452d79de55ab9d6c164af2126e9'
      },
      "0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585": {
        icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
        symbol: 'USDC',
        name: 'USDC',
        decimals: 12,
        address: '0x770745e6e294f1b501dfbb1f02fd9b8330e12eaba37d6c6460c3468918875585'
      },
      "0xb78e078fa0947e4e3a21f0edf7104f7208119d547cc91dc28dbc0d80cc072c0c": {
        icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
        symbol: 'WUSDC',
        name: 'Wrapped USDC',
        decimals: 18,
        address: '0xb78e078fa0947e4e3a21f0edf7104f7208119d547cc91dc28dbc0d80cc072c0c'
      },
      "0x2156679a6147013e5217fa3b8210d0ce4986c54aaffcfa70c4a171c7a8b6afd9": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        symbol: 'WUSDT',
        name: 'Wrapped USDT',
        decimals: 18,
        address: '0x2156679a6147013e5217fa3b8210d0ce4986c54aaffcfa70c4a171c7a8b6afd9'
      },
      "0xaa6bc2ad1b660f6e7aaf3cb3418e6f66fe8c78f55400051b1d8bef0483976a42": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        symbol: 'WETH',
        name: 'Wrapped ETH',
        decimals: 18,
        address: '0xaa6bc2ad1b660f6e7aaf3cb3418e6f66fe8c78f55400051b1d8bef0483976a42'
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
                "0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40": {
                  icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
                  symbol: 'WVARA',
                  name: 'WVara Network',
                  decimals: 12,
                  address: '0xe881ae415d30e7651ad557c7a036b88efa88f5603796c89a3ea612122e73ac40'
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