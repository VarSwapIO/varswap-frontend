'use client'
import InputToken from '@/components/Button/InputToken';
import SelectToken from '@/components/Button/SelectToken';
import SettingSlippage from '@/components/Button/SettingSlippage';
import SkeletonBG from '@/components/SkeletonBG';
import { MAIN_COLOR } from '@/config/asset';
import { useConnectWallet } from '@/context/useConnectWallet';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatAmountWithFixed } from '@/helpers/format_number_display';
import { Button, Loader, LoadingOverlay, Skeleton } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { notifications } from '@mantine/notifications';
import ImageBG from '@/components/Image/ImageBG';
import AddLiquidityProvider, { useAddLiquidity } from './context/useAddLiquidityState'
import { Field } from '@/helpers/pools';
import SailsCalls from '../router_sdk/SailsCalls';
import { CONTRACT_DATA, NETWORK, VFT_IDL } from '../router_sdk/constants';
import { approveToken, getUserSigner, router_client } from '../Swap/utils';
import { send_message } from '../router_sdk';
import Link from 'next/link';

const AddLiquidityContainerImp = () => {

  const router = useRouter();
  const { balances, connected, accountConnected } = useConnectWallet();
  const { token_swap, token_sort, amount_liquidity, slippage, loading_pool, pool_current,
    onSelectToken, onTypingValue, onChangeSlippage, onClearTypedValue, getDataPool
  } = useAddLiquidity()

  const [loading, setLoading] = useState<boolean>(false)

  const handleAddLiquidity = async () => {
    if (!accountConnected?.address || !token_swap?.token_in || !token_swap?.token_out) return

    try {
      setLoading(true)
      const amount_x = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_in || 0), token_swap?.token_in?.decimals) || '0'
      const amount_y = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_out || 0), token_swap?.token_out?.decimals) || "0"

      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
      });

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })

      if (token_swap?.token_in?.address !== 'NATIVE') {
        const approve_token_in_success = await approveToken(token_swap?.token_in?.address, amount_x, userAddress, signer, token_swap?.token_in);
        if (!approve_token_in_success) {
          setLoading(false)
          return;
        }
      }

      if (token_swap?.token_out?.address !== 'NATIVE') {
        const approve_token_out_success = await approveToken(token_swap?.token_out?.address, amount_y, userAddress, signer, token_swap?.token_out);
        if (!approve_token_out_success) {
          setLoading(false)
          return;
        }
      }

      const add_lp_success = await router_client.AddLiquidity({
        token_a: token_swap?.token_in,
        token_b: token_swap?.token_out,
        signer: signer,
        userAddress: userAddress,
        sails: sails,
        decoded_address: accountConnected?.address_decoded,
        amount_liquidity: amount_liquidity
      })
      if (!!add_lp_success) {
        onClearTypedValue();
        getDataPool();
      }
      setLoading(false)
    } catch (error) {
      if (error?.toString()?.includes("User denied request signature")) {
        toast.error('User has rejected the request')
      } else {
        toast.error(error?.toString() || '')
      }

    } finally {
      setLoading(false)
    }
  }

  const renderButton = () => {
    let case_btn = 0;
    let text_btn = "Enter an amount"

    let balance_token_in: number = 0;
    let balance_token_out: number = 0;

    const check_balance_in = balances?.[token_swap.token_in?.address || '']
    const check_balance_out = balances?.[token_swap.token_out?.address || '']
    if (check_balance_in) {
      balance_token_in = +(BigNumber.parseNumberToOriginal(check_balance_in?.amount || 0, check_balance_in?.decimals) || 0);
    }
    if (check_balance_out) {
      balance_token_out = +(BigNumber.parseNumberToOriginal(check_balance_out?.amount || 0, check_balance_out?.decimals) || 0);;
    }
    console.log('balance_token_in,', balance_token_in, balance_token_out);

    if (!amount_liquidity?.token_in || !amount_liquidity?.token_out) {
      case_btn = 1;
      text_btn = "Enter an amount"
    } else {

      if (balance_token_in < +amount_liquidity.token_in) {
        case_btn = 1;
        text_btn = `Insufficient ${token_swap?.token_in?.symbol} balance`
      }

      if (balance_token_out < +amount_liquidity.token_out) {
        case_btn = 1;
        text_btn = `Insufficient ${token_swap?.token_out?.symbol} balance`
      }
    }



    switch (case_btn) {
      case 0:
        return <Button
          onClick={() => handleAddLiquidity()}
          size={'sm'}
          radius="xl"
          color={MAIN_COLOR}
          variant={"light"}
          className="w-full"
          style={{
            '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
          }}
        >
          Add liquidity
        </Button>
      case 1:
        return <Button
          disabled
          size={'sm'}
          radius="xl"
          color={MAIN_COLOR}
          variant={"light"}
          className="w-full"
          style={{
            '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
          }}
        >
          {text_btn}
        </Button>
      default:
        break;
    }

    return;
  }
  return (
    <div className='relative py-16 container mx-auto px-2 min-h-[90vh]'>
      <div className='relative w-full max-w-lg m-auto bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4'>
        <LoadingOverlay
          visible={loading}
          zIndex={350}
          overlayProps={{ radius: 'md', blur: 1 }}
          loaderProps={{ color: '#3898ec', type: 'bars' }}
        />
        <div className='flex justify-between items-center dark:text-white text-slate-900'>
          <div onClick={() => router.back()} className='bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-full cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className='text-lg font-semibold'> Add Pool</p>
          <p className='w-8'>
            <SettingSlippage
              onChangeSlippageTolerance={(value: any) => onChangeSlippage(value)}
              value={slippage}
            />
          </p>
        </div>
        <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
          <p className='font-semibold text-sm mb-3 dark:text-white text-slate-900'>Select a Pair</p>
          <div className='flex justify-between gap-2 items-center'>
            <div>
              <SelectToken
                onChangeToken={(token: COIN_METADATA) => onSelectToken(token, Field.INPUT)}
                token={token_swap.token_in}
                disable={false}
              />
            </div>
            <div className='flex items-center w-full gap-2'>
              <p className='border-t border-gray-400 border border-dashed w-full'></p>
              <div className='h-9 w-9 rounded-xl dark:text-gray-300 text-gray-500 dark:bg-slate-800 bg-slate-200 p-1.5 flex justify-center items-center border-4 border-white dark:border-slate-600'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className='border-t border-gray-400 border border-dashed w-full'></p>
            </div>
            <div>
              <SelectToken
                onChangeToken={(token: COIN_METADATA) => onSelectToken(token, Field.OUTPUT)}
                token={token_swap.token_out}
                disable={false}
              />
            </div>
          </div>
        </div>
        {token_swap?.token_in && token_swap?.token_out && token_sort?.token_x && token_sort?.token_y ? <>
          {loading_pool ? <div className='my-4 rounded-xl dark:bg-slate-800 bg-slate-100 p-10 flex justify-center items-center'>
            <Loader />
          </div> :
            <>
              {!pool_current ? <>
                <>
                  {connected ?
                    <>
                      <Button
                        component={Link}
                        href={`/liquidity/create`}
                        size={'sm'}
                        radius="xl"
                        color={MAIN_COLOR}
                        variant={"light"}
                        className="w-full"
                        style={{
                          '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
                        }}
                      >
                        Go to create liquidity
                      </Button>
                    </> :
                    <Button size={'sm'} radius="xl" className='font-semibold w-full bg-mainColor hover:bg-mainColor/80'>
                      Connect Wallet
                    </Button>}
                </></> :
                <div>
                  <div>
                    <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
                      <p className='font-semibold text-sm mb-2 dark:text-white text-slate-900'>Select a pool</p>
                      <div className='cursor-pointer border border-mainColor/30 dark:bg-slate-800 bg-white flex gap-3 p-3 items-center font-medium rounded-xl text-center text-sm min-w-[120px] shadow-md'>
                        {loading_pool ? <SkeletonBG width={50} height={30} /> : <div className='flex'>
                          <img className='w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_in.icon} alt="token-x-pool" />
                          <img className='-ml-3 w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_out.icon} alt="token-y-pool" />
                        </div>}
                        {loading_pool ? <SkeletonBG width={100} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>{token_sort.token_x?.symbol} - {token_sort.token_y?.symbol}</p>}
                      </div>
                      {pool_current ? <div className='flex justify-between mt-3 dark:text-white text-slate-900'>
                        <p className='font-semibold text-sm'>Total liquidity</p>
                        {loading_pool ? <div className='h-[45px]'>
                          <SkeletonBG width={150} height={20} />
                          <SkeletonBG width={150} height={20} />
                        </div> :
                          <div className='text-right text-white font-semibold text-sm h-[45px]'>
                            <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(pool_current?.reserve_x, token_sort.token_x.decimals))} {token_sort.token_x?.symbol}</p>
                            <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(pool_current?.reserve_y, token_sort.token_y.decimals))} {token_sort.token_y?.symbol}</p>
                          </div>
                        }
                      </div> : null}
                    </div>
                    <div className='relative my-4'>
                      <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700`}>
                        <InputToken
                          onChange={(value: string | number) => onTypingValue(value?.toString(), Field.INPUT)}
                          value={amount_liquidity.token_in || 0}
                          token={token_swap.token_in}
                          disable={false}
                          disableSelectToken={true}
                        />
                      </div>
                      <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700 mt-1`}>
                        <InputToken
                          onChange={(value: string | number) => onTypingValue(value?.toString(), Field.OUTPUT)}
                          value={amount_liquidity.token_out || 0}
                          token={token_swap.token_out}
                          disableSelectToken={true}
                        />
                      </div>
                      <div className='absolute inset-0 m-auto h-9 w-9 rounded-full dark:text-slate-300 text-slate-500 dark:bg-slate-700 bg-slate-100 border-4 border-white dark:border-slate-900  p-1.5 flex justify-center items-center cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3 text-xs sm:text-sm text-center text-gray-600 dark:text-gray-300'>
                    <div className='flex gap-3 items-center mb-3'>
                      <div className='flex'>
                        <img className='w-6 h-6 rounded-full bg-white object-cover' src={token_swap.token_in.icon || ''} alt="token1-pool" />
                        <img className='-ml-2 w-6 h-6 rounded-full bg-white object-cover' src={token_swap.token_out.icon || ''} alt="token2-pool" />
                      </div>
                      <p className='text-mainColor font-semibold'>{token_sort.token_x?.symbol} - {token_sort.token_y?.symbol}-LP</p>
                      <p className='ml-auto dark:text-white text-slate-900 font-semibold'>{amount_liquidity?.lp_amount}</p>
                    </div>
                    <div className=' grid grid-cols-3 gap-2 dark:text-white text-slate-900 font-medium'>
                      <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                        <p className='font-medium text-xs'>{token_sort.token_x?.symbol} per {token_sort.token_y?.symbol}</p>
                        <p>{formatAmountWithFixed(amount_liquidity?.price_yx)}</p>
                      </div>
                      <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                        <p className='font-medium text-xs'>{token_sort.token_y?.symbol} per {token_sort.token_x?.symbol}</p>
                        <p>{formatAmountWithFixed(amount_liquidity?.price_xy)}</p>
                      </div>
                      <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                        <p className='font-medium text-xs'>Share of Pool</p>
                        <p>{amount_liquidity.lp_amount_percent}%</p>
                      </div>
                    </div>
                    <div className='flex justify-between items-center mt-3 font-semibold'>
                      <p className='text-mainColor '> Slippage Tolerance</p>
                      <p className='dark:text-white text-slate-900'>{slippage} %</p>
                    </div>
                  </div>
                  {/* Button  */}
                  <>
                    {connected ?
                      <>
                        {renderButton()}
                      </> :
                      <Button size={'sm'} radius="xl" className='font-semibold w-full bg-mainColor hover:bg-mainColor/80'>
                        Connect Wallet
                      </Button>}
                  </>
                </div>
              }
            </>
          }
        </> :
          null}
      </div>
    </div>
  )
}

const AddLiquidityContainer = () => (
  <AddLiquidityProvider>
    <AddLiquidityContainerImp />
  </AddLiquidityProvider>
)
export default AddLiquidityContainer