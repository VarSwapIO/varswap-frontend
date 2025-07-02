import ImageBG from '@/components/Image/ImageBG';
import { MAIN_COLOR } from '@/config/asset';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { shortString } from '@/helpers/utils';
import { useConnectWallet } from '@/context/useConnectWallet';
import { ActionIcon, Button, CopyButton, Divider, Menu, rem, Tooltip } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react';
import React from 'react'
import { decodeAddress } from '@gear-js/api'
const UserAuthHeader = () => {
  const { accountConnected, onDisconnect, balances } = useConnectWallet();
  const vara_balance = balances?.['NATIVE']

  const renderListTabs = () => {
    return (
      <>
        <div className=''>
          <div className='flex items-center justify-between px-2 py-2'>
            <div className='w-fit flex gap-1 items-center cursor-pointer bg-white border border-slate-200/60 dark:border-slate-700 shadow-sm dark:bg-slate-900/80 p-1 rounded-full px-2' >
              <ImageBG
                alt="logo-token"
                width={18}
                height={18}
                src={accountConnected?.walletInfo.icon || ''}
                className="dark:border-slate-700 border-slate-200 border rounded-full min-h-[18px] object-cover"
              />
              <p className='text-xs font-bold dark:text-white text-slate-900'>{accountConnected?.walletInfo.name}</p>
            </div>
            <div className='w-fit flex gap-1 items-center cursor-pointer bg-white border border-slate-200/60 dark:border-slate-700 shadow-sm dark:bg-slate-900/80 p-1 rounded-full px-2' >
              <ImageBG
                alt="logo-token"
                width={18}
                height={18}
                src={'/images/icons/vara_network.png'}
                className=" dark:border-slate-700 border-slate-200 border rounded-full min-h-[18px] object-cover"
              />
              <p className='text-xs font-bold text-mainColor'>Vara network</p>
            </div>
          </div>
          <div className='py-4 bg-white dark:bg-slate-900/80 mb-4 mx-2 mt-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm'>
            <div className='flex gap-1.5 items-center justify-center pl-2'>
              <p className='dark:text-white text-slate-900 font-semibold '>{shortString(accountConnected?.address || '', 8, 8)}</p>
              <CopyButton value={accountConnected?.address || ''} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon
                      color={copied ? MAIN_COLOR : MAIN_COLOR}
                      variant="light"
                      onClick={copy}
                      style={{
                        '--mantine-color-dark-6': '#1E293B', '--mantine-color-dark-3': '#7C8898'
                      }}
                    >
                      {copied ? (
                        <IconCheck style={{ width: rem(15) }} />
                      ) : (
                        <IconCopy style={{ width: rem(15) }} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <div className='flex gap-1.5 items-center justify-center pl-2'>
              <p className='dark:text-white text-slate-900 font-semibold '>{shortString(decodeAddress(accountConnected?.address as any) || '', 8, 8)}</p>
              <CopyButton value={decodeAddress(accountConnected?.address as any) || ''} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                    <ActionIcon
                      color={copied ? MAIN_COLOR : MAIN_COLOR}
                      variant="light"
                      onClick={copy}
                      style={{
                        '--mantine-color-dark-6': '#1E293B', '--mantine-color-dark-3': '#7C8898'
                      }}
                    >
                      {copied ? (
                        <IconCheck style={{ width: rem(15) }} />
                      ) : (
                        <IconCopy style={{ width: rem(15) }} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
            <div className='flex items-center justify-between px-4 py-2 mx-2 mt-2 rounded-md bg-slate-100/80 dark:bg-slate-700/80'>
              <div className='w-fit flex gap-2 items-center justify-center' >
                <ImageBG
                  alt="logo-token"
                  width={20}
                  height={20}
                  src={'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png'}
                  className="dark:border-slate-700 border-slate-200 border rounded-full min-h-[20px] object-cover"
                />
                <p className='font-bold dark:text-white text-slate-900 text-sm'>{vara_balance?.symbol}</p>
              </div>
              <p className='font-bold dark:text-white text-slate-900 text-sm'>
                {formatNumberDisplay(BigNumber.parseNumberToOriginal(vara_balance?.amount || 0, vara_balance?.decimals))}
              </p>
            </div>
          </div>
        </div>
        <Divider size={'xs'} className='dark:border-t-slate-700 border-t-slate-100' />
        <div className="flex gap-2 items-center text-lg rounded-b-xl cursor-pointer p-3 px-4 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => onDisconnect()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M16.125 12a.75.75 0 0 0-.75-.75H4.402l1.961-1.68a.75.75 0 1 0-.976-1.14l-3.5 3a.75.75 0 0 0 0 1.14l3.5 3a.75.75 0 1 0 .976-1.14l-1.96-1.68h10.972a.75.75 0 0 0 .75-.75" clipRule="evenodd"></path><path fill="currentColor" d="M9.375 8c0 .702 0 1.053.169 1.306a1 1 0 0 0 .275.275c.253.169.604.169 1.306.169h4.25a2.25 2.25 0 0 1 0 4.5h-4.25c-.702 0-1.053 0-1.306.168a1 1 0 0 0-.275.276c-.169.253-.169.604-.169 1.306c0 2.828 0 4.243.879 5.121c.878.879 2.292.879 5.12.879h1c2.83 0 4.243 0 5.122-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121C20.617 2 19.203 2 16.375 2h-1c-2.829 0-4.243 0-5.121.879c-.879.878-.879 2.293-.879 5.121"></path></svg>
          <p className='m-0 font-medium'>Logout</p>
        </div>
        {/* tab for user end */}
      </>
    )
  }
  return (
    <div className='flex items-center gap-2 '>
      <div>
        <Menu
          position="bottom-end"
          offset={0}
          trigger="hover"
          loop={false}
          withinPortal={false}
          trapFocus={false}
          menuItemTabIndex={0}
        >
          {/* Menu items */}
          < Menu.Target >
            <Button
              size={'sm'}
              radius="xl"
              variant={'light'}
              color={MAIN_COLOR}
              className="min-w-[150px]"
              leftSection={
                <ImageBG
                  alt="logo-token"
                  width={24}
                  height={24}
                  src={accountConnected?.walletInfo?.icon || ''}
                  className="dark:border-slate-700 border-slate-200 border rounded-full min-h-[24px] object-cover"
                />
              }
            >
              <p className='line-clamp-1 max-w-[100px] whitespace-normal'>{shortString(accountConnected?.address as string, 5, 4) || accountConnected?.meta.name}</p>
            </Button>
          </Menu.Target >
          <Menu.Dropdown top={48} w={'280px'} className="border-none bg-white p-0 dark:bg-slate-800 rounded-xl">
            <div className={`w-full h-full border border-solid border-slate-200/50 dark:border-slate-700 shadow-sm rounded-xl`}>
              {renderListTabs()}
            </div>
          </Menu.Dropdown>
        </Menu >
      </div>

    </div>
  )
}

export default UserAuthHeader