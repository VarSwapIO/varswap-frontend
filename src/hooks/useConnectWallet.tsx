import { getCachedData, removeCacheData, setCacheData } from '@/helpers/storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useBalance } from '@gear-js/react-hooks';

export interface ACCOUNT_CONNECTED extends InjectedAccountWithMeta {
  walletInfo: WALLET_METADATA
}

type ConnectWalletContextProps = {
  connected: boolean;
  accountConnected?: ACCOUNT_CONNECTED;
  openModalConnectWallet: boolean;
  balances: BALANCE_ACCOUNT[];
  onChangeStateModalConnect: (status: boolean) => void;
  onAccountConnect: (data: ACCOUNT_CONNECTED) => void;
  onDisconnect: () => void;
  getBalances: () => void;
}


// create context
const ConnectWalletContext = createContext<ConnectWalletContextProps>({
  connected: false,
  accountConnected: undefined,
  openModalConnectWallet: false,
  balances: [],
  onChangeStateModalConnect: () => { },
  onAccountConnect: () => { },
  onDisconnect: () => { },
  getBalances: () => { }
})

export const useConnectWallet = () => useContext(ConnectWalletContext)

// create provider context
export default function ConnectWalletProvider({
  children,
}: {
  children: JSX.Element
}) {
  const [openModalConnectWallet, setOpenModalConnectWallet] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountConnected, setAccountConnected] = useState<ACCOUNT_CONNECTED>();
  const [balances, setBalances] = useState<BALANCE_ACCOUNT[]>([])
  const { balance } = useBalance('kGgEHnaoYWzVQ7iYBJYkubetSfJcUDfvUT7vijkXh4PsJipmC');

  useEffect(() => {
    getDataWalletCached()
  }, [])

  useEffect(() => {
    if (!!connected) {
      getBalances()
    }
  }, [connected, accountConnected])

  const getBalances = async () => {
    // todo
    console.log('balance :>> ', balance);
  }

  const getDataWalletCached = async () => {
    const account_cached = await getCachedData('account');
    const account_cached_json = await JSON.parse(account_cached || '');

    if (!connected && !!account_cached_json?.address && account_cached_json?.address !== accountConnected?.address) {
      setAccountConnected(account_cached_json);
      setConnected(true)
    }
  }

  const onChangeStateModalConnect = (status: boolean) => {
    setOpenModalConnectWallet(status)
  }

  const onAccountConnect = (data: ACCOUNT_CONNECTED) => {
    console.log('data onAccountConnect', data)

    if (!data?.address) {
      onDisconnect();
      return;
    }

    setAccountConnected(data);
    setConnected(true);
    // save cache
    setCacheData('account', JSON.stringify(data))

    setOpenModalConnectWallet(false);
  }

  const onDisconnect = () => {
    setAccountConnected(undefined);
    setConnected(false);
    setBalances([])

    // remove cache
    removeCacheData('account')
  }
  const value = useMemo(
    () => ({
      connected,
      accountConnected,
      openModalConnectWallet,
      balances,
      onChangeStateModalConnect,
      onAccountConnect,
      onDisconnect,
      getBalances
    }),
    [
      connected,
      accountConnected,
      openModalConnectWallet,
      balances
    ]
  )

  return (
    <ConnectWalletContext.Provider value={value}>
      {children}
    </ConnectWalletContext.Provider>
  )
}
