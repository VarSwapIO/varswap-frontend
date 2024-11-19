'use client'
import InputToken from '@/components/Button/InputToken';
import SettingSlippage from '@/components/Button/SettingSlippage';
import { MAIN_COLOR } from '@/config/asset';
import { useConnectWallet } from '@/context/useConnectWallet';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatAmountWithFixed } from '@/helpers/format_number_display';
import { Button, Loader, LoadingOverlay, Slider } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { notifications } from '@mantine/notifications';
import ImageBG from '@/components/Image/ImageBG';
import RemoveLiquidityProvider, { useRemoveLiquidity } from './context/useRemoveLiquidityState';
import { convertNativeToAddress, Field, token_in_pool } from '@/helpers/pools';
import SailsCalls from '../router_sdk/SailsCalls';
import { CONTRACT_DATA, NETWORK } from '../router_sdk/constants';
import { approveLPToken, approveToken, getUserSigner, router_client } from '../Swap/utils';


const RemoveLiquidityContainerImp = () => {

  const router = useRouter();
  const { balances, connected, accountConnected } = useConnectWallet();
  const { token_swap, token_sort, amount_liquidity, slippage, loading_pool, pool_current, your_liquidity,
    onTypingValue, onChangeSlippage, onClearTypedValue, getDataPool, getYourLiquidity
  } = useRemoveLiquidity()

  const [loading, setLoading] = useState<boolean>(false)

  const handleRemoveLiquidity = async () => {

    if (!accountConnected?.address || !token_sort?.token_x || !token_sort?.token_y || !pool_current?.pool_id || !token_swap?.token_in || !token_swap?.token_out) return
    console.log('arrr_1amout_liquidity :>> ', token_sort, amount_liquidity, pool_current, your_liquidity);
    // return;
    try {
      setLoading(true)
      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
      });

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })
      const approve_lp_token_success = await approveLPToken(pool_current?.pool_id, amount_liquidity.lp_amount?.toString() || '0', userAddress, signer, {
        address: pool_current?.pool_id,
        name: `${token_sort.token_x?.symbol}-${token_sort.token_y?.symbol}-LP`,
        icon: '',
        symbol: `${token_sort.token_x?.symbol}-${token_sort.token_y?.symbol}-LP`,
        decimals: 12
      });
      if (!approve_lp_token_success) {
        setLoading(false)
        return;
      }
      const remove_lp_success = await router_client.RemoveLiquidity({
        token_a: token_swap?.token_in,
        token_b: token_swap?.token_out,
        signer: signer,
        userAddress: userAddress,
        sails: sails,
        decoded_address: accountConnected?.address_decoded,
        amount_liquidity: amount_liquidity
      })
      if (!!remove_lp_success) {
        onClearTypedValue();
        getDataPool(true);
        getYourLiquidity();
      }

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

    if (!amount_liquidity?.token_in || !amount_liquidity?.token_out) {
      case_btn = 1;
      text_btn = "Enter an amount"
    }

    switch (case_btn) {
      case 0:
        return <Button
          onClick={() => handleRemoveLiquidity()}
          size={'sm'}
          radius="xl"
          color={MAIN_COLOR}
          variant={"light"}
          className="w-full"
          style={{
            '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
          }}
        >
          Remove liquidity
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
          <p className='text-lg font-semibold'> Remove liquidity</p>
          <p className='w-8'>
            <SettingSlippage
              onChangeSlippageTolerance={(value: any) => onChangeSlippage(value)}
              value={slippage}
            />
          </p>
        </div>
        <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
          <p className='font-semibold text-sm  dark:text-white text-slate-900'>Remove Amount</p>
          <div className='flex justify-between gap-2 items-center w-full h-[60px]'>
            <Slider
              // onChange={(value: number) => onChangePriceSlide(value)}
              defaultValue={25}
              onChange={(value: number) => onTypingValue(value, Field.INPUT)}
              label={(value) => `${value} %`}
              size="lg"
              classNames={{
                track: `before:border-solid before:border-[5px] dark:before:border-slate-800 before:border-slate-200 before:border-slate-200/80 before:content-[""] before:absolute before:bottom-0`,
                label: 'dark:bg-slate-600 font-semibold',
              }}
              className='w-full'
              color={MAIN_COLOR}
              labelAlwaysOn
            />
          </div>
        </div>
        {token_swap?.token_in && token_swap?.token_out && token_sort?.token_x && token_sort?.token_y ? <>
          {loading_pool ? <div className='my-4 rounded-xl dark:bg-slate-800 bg-slate-100 p-10 flex justify-center items-center'>
            <Loader />
          </div> :
            <div>
              <div>
                <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
                  <p className='font-semibold text-sm mb-2 dark:text-white text-slate-900'>LP token</p>
                  <div className='cursor-pointer border border-mainColor/30 dark:bg-slate-800 bg-white flex gap-3 p-3 items-center font-medium rounded-xl text-center text-sm min-w-[120px] shadow-md'>
                    <div className='flex'>
                      <img className='w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_in.icon} alt="token-x-pool" />
                      <img className='-ml-3 w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_out.icon} alt="token-y-pool" />
                    </div>
                    <p className='font-semibold dark:text-white text-slate-900'>{token_sort.token_x?.symbol}-{token_sort.token_y?.symbol}-LP</p>
                  </div>
                  {pool_current ? <div className='mt-3 dark:text-white text-slate-900 font-semibold'>
                    <div className='flex justify-between items-center'>
                      <p>Pooled {token_sort.token_x?.symbol}</p>
                      <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(token_in_pool(+your_liquidity, +(pool_current?.reserve_x || 0), +(pool_current?.total_supply || 0)), token_sort?.token_x?.decimals))} {token_sort.token_x?.symbol}</p>
                    </div>
                    <div className='flex justify-between items-center'>
                      <p>Pooled  {token_sort.token_y?.symbol}</p>
                      <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(token_in_pool(+your_liquidity, +(pool_current?.reserve_y || 0), +(pool_current?.total_supply || 0)), token_sort?.token_y?.decimals))} {token_sort.token_y?.symbol}</p>
                    </div>
                  </div> : null}
                </div>
                <div className='relative my-4'>
                  <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700`}>
                    <InputToken
                      disable={true}
                      onChange={(value: string | number) => onTypingValue(+value, Field.INPUT)}
                      value={BigNumber.parseNumberToOriginal(amount_liquidity.token_in || 0, token_sort.token_x.decimals) || 0}
                      token={convertNativeToAddress(token_swap.token_in.address) === token_sort.token_x.wrapped?.address ? token_swap.token_in : token_swap.token_out}
                      disableSelectToken={true}
                      hiddenMaxBtn
                    />
                  </div>
                  <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700 mt-1`}>
                    <InputToken
                      disable={true}
                      onChange={(value: string | number) => onTypingValue(+value, Field.OUTPUT)}
                      value={BigNumber.parseNumberToOriginal(amount_liquidity.token_out || 0, token_sort.token_y.decimals) || 0}
                      token={convertNativeToAddress(token_swap.token_out.address) === token_sort.token_y.wrapped?.address ? token_swap.token_out : token_swap.token_in}
                      disableSelectToken={true}
                      hiddenMaxBtn
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
                <div className='flex justify-between items-center font-semibold'>
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
        </> :
          null}
      </div>
    </div>
  )
}
const RemoveLiquidityContainer = () => (
  <RemoveLiquidityProvider>
    <RemoveLiquidityContainerImp />
  </RemoveLiquidityProvider>
)
export default RemoveLiquidityContainer