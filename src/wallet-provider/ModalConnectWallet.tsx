'use client'
import ImageBG from '@/components/Image/ImageBG';
import { MAIN_COLOR } from '@/config/asset';
import { WALLET_LIST } from '@/config/wallet';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useAccount } from '@gear-js/react-hooks';
import { Box, Button, Modal, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { useState } from 'react'

interface WalletRowProps {
  wallet: any;
  onConnect: (wallet: InjectedAccountWithMeta) => void;
  loadingWallet: string;
  installed: boolean;
}

function WalletRow({ wallet, onConnect, loadingWallet, installed }: WalletRowProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const { accounts } = useAccount()
  const filter_account_connected = accounts?.filter((a: InjectedAccountWithMeta) => a?.meta?.source === wallet.key);
  const length_account_connected = filter_account_connected?.length || 0
  return (
    <>
      <div
        className="flex items-center justify-between p-2 px-4 rounded-md dark:bg-slate-900 bg-slate-100 border dark:border-slate-700 border-slate-200 shadow-sm"
      >
        <div className='flex gap-2 items-center w-full' >
          <ImageBG
            alt="logo-token"
            width={36}
            height={36}
            src={wallet?.icon}
            className="dark:border-slate-700 border-slate-200 border rounded-full min-h-[36px] object-cover"
          />
          <p className='text-sm sm:text-base font-bold dark:text-white text-slate-800'>{wallet?.name}</p>
        </div>

        {!installed ? (
          <Button
            size={'xs'}
            variant="light"
            className='min-w-[100px]'
            color={'blue'}
            component="a"
            href={wallet?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Install
          </Button>
        ) : (
          <Button
            disabled={!!loadingWallet && loadingWallet !== wallet?.key}
            style={{
              '--mantine-color-dark-6': '#1E293B', '--mantine-color-dark-3': '#7C8898'
            }}
            loading={loadingWallet === wallet?.key}
            size={'xs'}
            variant="light"
            color={MAIN_COLOR}
            className={` ${length_account_connected === 0 ? 'min-w-[100px]' : 'min-w-[120px]'}`}
            onClick={() => open()}
            rightSection={length_account_connected ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"></path></svg> : null}
          >
            {length_account_connected === 0 ? 'Enable' : `${length_account_connected} connected`}
          </Button>
        )}
      </div>
      <Modal
        size={'md'}
        opened={opened}
        onClose={close}
        title={<div className='flex gap-2 items-center w-full' >
          <ImageBG
            alt="logo-token"
            width={36}
            height={36}
            src={wallet?.icon}
            className="dark:border-slate-700 border-slate-200 border rounded-full min-h-[36px] object-cover"
          />
          <p className='text-sm sm:text-base font-bold dark:text-white text-slate-800'>{wallet?.name} Connected</p>
        </div>}
        centered
        radius="lg"
        classNames={{
          title: "font-semibold lg:text-2xl dark:text-white",
          header: 'dark:bg-slate-800',
          body: 'dark:bg-slate-800',
          close: 'dark:hover:bg-slate-700'
        }}
      >
        {length_account_connected > 0 ? <ScrollArea h={300} type="auto" offsetScrollbars scrollbarSize={4} className="pr-1 ">
          <div className="space-y-2 ">
            <div className="flex flex-col gap-3">
              {filter_account_connected?.map((acc: InjectedAccountWithMeta) => {
                return (
                  <Button
                    key={acc.address}
                    style={{
                      '--mantine-color-dark-6': '#1E293B', '--mantine-color-dark-3': '#7C8898'
                    }}
                    size={'xs'}
                    radius="xl"
                    variant="light"
                    color={MAIN_COLOR}
                    onClick={() => {
                      onConnect(acc);
                      close()
                    }}
                  >
                    <span >{acc.meta.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </ScrollArea> :
          <p className=' dark:text-slate-400 text-slate-600'>
            No accounts found. Please open your {wallet.name} extension and create a new account or import existing. Then reload this page.
          </p>}
      </Modal>
    </>
  );
}


const ModalConnectWallet = () => {
  const { openModalConnectWallet, onChangeStateModalConnect, onAccountConnect } = useConnectWallet();
  const [loadingConnect, setLoadingConnect] = useState('')

  const handleConnectWallet = async (wallet: InjectedAccountWithMeta, walletInfo: WALLET_METADATA) => {
    onAccountConnect({
      ...wallet,
      walletInfo: walletInfo
    });
  }

  return (
    <Modal
      size={'md'}
      opened={openModalConnectWallet}
      onClose={() => onChangeStateModalConnect(false)}
      title="Connect Wallet"
      centered
      radius="lg"
      classNames={{
        title: "font-semibold lg:text-2xl dark:text-white",
        header: 'dark:bg-slate-800',
        body: 'dark:bg-slate-800',
        close: 'dark:hover:bg-slate-700'
      }}
    >
      <ScrollArea h={400} type="auto" offsetScrollbars scrollbarSize={4} className="pr-1 ">
        <div className="space-y-2 ">
          <div className="flex flex-col gap-3">
            {(Object.keys(WALLET_LIST) as WALLET_PROVIDER[]).map((wallet_key: WALLET_PROVIDER) => {
              const wallet_info: WALLET_METADATA = WALLET_LIST?.[wallet_key];
              const installed = window?.injectedWeb3?.[wallet_key]
              return (
                <WalletRow
                  key={wallet_info.name}
                  wallet={wallet_info}
                  onConnect={(wl: InjectedAccountWithMeta) => handleConnectWallet(wl, wallet_info)}
                  loadingWallet={loadingConnect}
                  installed={!!installed}
                />
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </Modal>
  )
}

export default ModalConnectWallet