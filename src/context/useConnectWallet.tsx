'use client'
import { getCachedData, removeCacheData, setCacheData } from '@/helpers/storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount, useBalance, useBalanceFormat } from '@gear-js/react-hooks';
import { LIST_OF_TOKENS_BY_ADDRESS } from '@/config/tokens';
import { getBalanceToken } from '@/services/token.services';
import { BigNumber } from '@/helpers/big_number_cal';

export interface ACCOUNT_CONNECTED extends InjectedAccountWithMeta {
  walletInfo: WALLET_METADATA;
  address_decoded: string;
}

type ConnectWalletContextProps = {
  connected: boolean;
  accountConnected?: ACCOUNT_CONNECTED;
  openModalConnectWallet: boolean;
  balances: { [key: string]: BALANCE_ACCOUNT };
  onChangeStateModalConnect: (status: boolean) => void;
  onAccountConnect: (data: ACCOUNT_CONNECTED) => void;
  onDisconnect: () => void;
  // getBalances: () => void;
}


// create context
const ConnectWalletContext = createContext<ConnectWalletContextProps>({
  connected: false,
  accountConnected: undefined,
  openModalConnectWallet: false,
  balances: {},
  onChangeStateModalConnect: () => { },
  onAccountConnect: () => { },
  onDisconnect: () => { },
  // getBalances: () => { }
})

export const useConnectWallet = () => useContext(ConnectWalletContext)

// create provider context
export default function ConnectWalletProvider({
  children,
}: {
  children: JSX.Element
}) {
  const { logout, login } = useAccount();
  const [openModalConnectWallet, setOpenModalConnectWallet] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountConnected, setAccountConnected] = useState<ACCOUNT_CONNECTED>();
  const [balances, setBalances] = useState<{ [key: string]: BALANCE_ACCOUNT }>({})
  const { balance } = useBalance(accountConnected?.address);
  const { getFormattedBalance } = useBalanceFormat();


  useEffect(() => {
    getDataWalletCached()
  }, [])

  const getDataWalletCached = async () => {
    const account_cached = await getCachedData('account');
    const account_cached_json = await JSON.parse(account_cached || '');

    if (!connected && !!account_cached_json?.address && account_cached_json?.address !== accountConnected?.address) {
      setAccountConnected(account_cached_json);
      setConnected(true)
    }
  }

  useEffect(() => {
    getAllBalance()
  }, [balance, accountConnected?.address])


  const getAllBalance = async () => {
    if (!accountConnected?.address_decoded) return;
    const formattedBalance = balance ? getFormattedBalance(balance) : { value: 0, unit: 'VARA' };
    console.log('balance', balance)
    const balance_default: { [key: string]: any } = {
      "NATIVE": {
        ...LIST_OF_TOKENS_BY_ADDRESS["NATIVE"],
        amount: BigNumber.parseNumberWithDecimals(formattedBalance?.value?.toString(), 12) || '0'
      },
    }

    const address_tokens = Object.keys(LIST_OF_TOKENS_BY_ADDRESS);

    const address_token_except_native = address_tokens?.filter((address: string) => address !== 'NATIVE');
    const promises = await address_token_except_native.map(async (x: string) => {
      return await getBalanceToken(x, accountConnected?.address_decoded)
    })
    const amount_all = await Promise.all(promises)
    for (let index = 0; index < address_token_except_native.length; index++) {
      const coin_address = address_token_except_native[index];
      const coint_amount = amount_all[index]

      balance_default[coin_address] = {
        ...LIST_OF_TOKENS_BY_ADDRESS[coin_address],
        amount: coint_amount
      }
    }

    setBalances(balance_default)
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
    const { address, meta, type } = data;
    login({ address, meta, type })

    setAccountConnected(data);
    setConnected(true);
    // save cache
    setCacheData('account', JSON.stringify(data))

    setOpenModalConnectWallet(false);
  }

  const onDisconnect = () => {
    setAccountConnected(undefined);
    setConnected(false);
    setBalances({})

    // remove cache
    removeCacheData('account');
    logout()
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
      // getBalances
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
