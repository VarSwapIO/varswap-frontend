export const WALLET_ID_LOCAL_STORAGE_KEY = 'wallet';

export const WALLET_LIST: { [key in WALLET_PROVIDER]: WALLET_METADATA } = {
  'subwallet-js': {
    name: 'SubWallet',
    key: 'subwallet-js',
    icon: '/images/icons/sub-wallet-icon.svg',
    url: 'https://chromewebstore.google.com/detail/subwallet-polkadot-wallet/onhogfjeacnfoofkfgppdlbmlmnplgbn'
  },
  'polkadot-js': {
    name: 'Polkadot JS',
    key: 'polkadot-js',
    icon: '/images/icons/polkadot-js-icon.svg',
    url: 'https://chromewebstore.google.com/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
  },
  'enkrypt': {
    name: 'Enkrypt',
    key: 'enkrypt',
    icon: '/images/icons/enkrypt-icon.svg',
    url: 'https://chromewebstore.google.com/detail/enkrypt-crypto-wallet-eth/kkpllkodjeloidieedojogacfhpaihoh'
  },
  'talisman': {
    name: 'Talisman',
    key: 'talisman',
    icon: '/images/icons/talisman-icon.svg',
    url: 'https://chromewebstore.google.com/detail/talisman-ethereum-and-pol/fijngjgcjhjmmpcmkeiomlglpeiijkld'
  },
};
