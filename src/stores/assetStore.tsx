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
      "0x46896891852a364d9fe38b52e4061da85a00f6118415715c40d86a1f4ca00414": {
        icon: 'https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-usd-coin-usdc-digital-stablecoin-icon-technology-pay-web-vector-png-image_37843734.png',
        symbol: 'WUSDC',
        name: 'Wrapped USDC',
        decimals: 6,
        address: '0x46896891852a364d9fe38b52e4061da85a00f6118415715c40d86a1f4ca00414'
      },
      "0x77e704ac1c6129d147ecc6b5ddadc80dd1945505bb9654b23e41153ed0737e49": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
        symbol: 'WUSDT',
        name: 'Wrapped USDT',
        decimals: 6,
        address: '0x77e704ac1c6129d147ecc6b5ddadc80dd1945505bb9654b23e41153ed0737e49'
      },
      "0x1f2af47fa11e08e9a7e9bf81d84d166e425e1f13104690b33f4fd4c4ddca6709": {
        icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        symbol: 'WETH',
        name: 'Wrapped ETH',
        decimals: 18,
        address: '0x1f2af47fa11e08e9a7e9bf81d84d166e425e1f13104690b33f4fd4c4ddca6709'
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