'use client'
import InputToken from '@/components/Button/InputToken'
import SelectToken from '@/components/Button/SelectToken'
import SettingSlippage from '@/components/Button/SettingSlippage'
import SkeletonBG from '@/components/SkeletonBG'
import { MAIN_COLOR } from '@/config/asset'
import { BigNumber } from '@/helpers/big_number_cal'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { YOUR_LIQUIDITY_MOCKDATA } from '@/mockData'
import { Button, Loader, LoadingOverlay } from '@mantine/core'
import React, { useState } from 'react'

const AddLiquidityPoolContainer = () => {
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.1);
  const [loadingPool, setLoadingPool] = useState<boolean>(false);

  const [tokenA, setTokenA] = useState<TOKEN_METADATA>();
  const [tokenB, setTokenB] = useState<TOKEN_METADATA>();

  const [amountA, setAmountA] = useState<string | number>(0);
  const [amountB, setAmountB] = useState<string | number>(0);

  const [dataPool, setDataPool] = useState<YOUR_LIQUIDITY>(YOUR_LIQUIDITY_MOCKDATA);

  const loadingLiquidityInstead = false;
  const loadingOutput = false;
  const connected = true;
  return (
    <div className='relative py-16 container mx-auto px-2 min-h-[90vh]'>
      {loadingLiquidityInstead ? <div className='w-full max-w-lg m-auto bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4'>
        <div className='flex justify-between items-center dark:text-white text-slate-900'>
          <div onClick={() => { }} className='bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-full cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M21 11H6.83l3.58-3.59L9 6l-6 6l6 6l1.41-1.41L6.83 13H21z"></path></svg>
          </div>
          <p className='text-lg font-semibold'> Add Liquidity</p>
          <SettingSlippage
            onChangeSlippageTolerance={(value: any) => setSlippageTolerance(value)}
            value={slippageTolerance}
          />
        </div>
        <div className='my-4 rounded-xl dark:bg-slate-800 bg-slate-100 p-10 flex justify-center items-center'>
          <Loader />
        </div>
      </div> :
        <div className='relative w-full max-w-lg m-auto bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4'>
          <div className='flex justify-between items-center dark:text-white text-slate-900'>
            <div onClick={() => { }} className='bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 p-2 rounded-full cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className='text-lg font-medium'> Add Liquidity</p>
            <SettingSlippage
              onChangeSlippageTolerance={(value: any) => setSlippageTolerance(value)}
              value={slippageTolerance}
            />
          </div>
          {/* <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: 'blue', type: 'dots' }}
          /> */}
          <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
            <p className='font-semibold text-sm mb-3 dark:text-white text-slate-900'>Select a Pair</p>
            <div className='flex justify-between gap-2 items-center'>
              <div>
                <SelectToken
                  onChangeToken={(token: any) => setTokenA(token)}
                  token={tokenA}
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
                  onChangeToken={(token: any) => setTokenB(token)}
                  token={tokenB}
                  disable={false}
                />
              </div>
            </div>
          </div>
          {tokenA?.symbol && tokenB?.symbol && <div>
            <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
              <p className='font-semibold text-sm mb-2 dark:text-white text-slate-900'>Select a pool</p>
              <div className='cursor-pointer border border-mainColor/20 dark:bg-slate-800 bg-white flex gap-3 p-3 items-center font-medium rounded-xl text-center text-sm min-w-[120px] shadow-md'>
                {loadingPool ? <SkeletonBG width={50} height={30} /> : <div className='flex'>
                  <img className='w-8 h-8 rounded-full object-cover bg-white' src={tokenA.icon} alt="token1-pool" />
                  <img className='-ml-3 w-8 h-8 rounded-full object-cover bg-white' src={tokenB?.icon} alt="token2-pool" />
                </div>}
                {loadingPool ? <SkeletonBG width={100} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>{tokenA?.symbol} - {tokenB?.symbol}</p>}
              </div>
              <div className='flex justify-between mt-3 dark:text-white text-slate-900'>
                <p className='font-semibold text-sm'>Total liquidity</p>
                {loadingPool ? <div className='h-[45px]'>
                  <SkeletonBG width={150} height={20} />
                  <SkeletonBG width={150} height={20} />
                </div> :
                  <div className='text-right font-semibold text-sm h-[45px]'>
                    <p>{formatNumberDisplay(BigNumber.parseNumberToOriginal(dataPool?.coin_x_amount, dataPool.coin_x.decimals))} {dataPool.coin_x?.symbol}</p>
                    <p>{formatNumberDisplay(BigNumber.parseNumberToOriginal(dataPool?.coin_y_amount, dataPool.coin_y.decimals))} {dataPool.coin_y?.symbol}</p>
                  </div>
                }
              </div>
            </div>
            {/* input amount */}
            <div className='relative my-4'>
              <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700`}>
                <InputToken
                  onChange={(value: string | number) => setAmountA(value)}
                  value={amountA}
                  token={tokenA}
                  disable={false}
                  disableSelectToken={true}
                />
              </div>
              <div className={`w-full h-32 rounded-3xl border border-transparent dark:hover:border-slate-600 hover:border-slate-200 bg-slate-100/80 dark:bg-slate-700 mt-1`}>
                <InputToken
                  onChange={(value: string | number) => setAmountB(value)}
                  value={amountB}
                  token={tokenB}
                  disableSelectToken={true}
                />
              </div>
              <div className='absolute inset-0 m-auto h-9 w-9 rounded-full dark:text-slate-300 text-slate-500 dark:bg-slate-700 bg-slate-100 border-4 border-white dark:border-slate-900  p-1.5 flex justify-center items-center cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
            </div>

            {/* lp token */}

            <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3 text-xs sm:text-sm text-center text-gray-600 dark:text-gray-300'>
              <div className='flex gap-3 items-center mb-3'>
                {loadingPool ? <SkeletonBG width={50} height={30} /> : <div className='flex'>
                  <img className='w-6 h-6 rounded-full bg-white object-cover' src={dataPool.coin_x.icon} alt="token1-pool" />
                  <img className='-ml-2 w-6 h-6 rounded-full bg-white object-cover' src={dataPool.coin_y.icon} alt="token2-pool" />
                </div>}
                <p className='text-mainColor font-semibold'>{dataPool.coin_x?.symbol} - {dataPool.coin_y?.symbol} LP</p>
                <p className='ml-auto dark:text-white text-slate-900 font-semibold'>{formatNumberDisplay(dataPool.lp_amount)}</p>
              </div>
              <div className=' grid grid-cols-3 gap-2 dark:text-white text-slate-900 font-medium'>
                <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                  <p className='font-medium text-xs'>{tokenA?.symbol} per {tokenB?.symbol}</p>
                  {loadingOutput ? <SkeletonBG width={50} height={20} /> : <p>--</p>}
                </div>
                <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                  <p className='font-medium text-xs'>{tokenB?.symbol} per {tokenA?.symbol}</p>
                  {loadingOutput ? <SkeletonBG width={50} height={20} /> : <p>--</p>}
                </div>
                <div className='rounded-xl border dark:border-gray-700 dark:bg-slate-800 space-y-1 border-gray-100 bg-white shadow-md p-2'>
                  <p className='font-medium text-xs'>Share of Pool</p>
                  {loadingOutput ? <SkeletonBG width={50} height={20} /> : <p>{0}%</p>}
                </div>
              </div>
              <div className='flex justify-between items-center mt-3 font-medium'>
                <p className='text-mainColor '> Slippage Tolerance</p>
                <p className='dark:text-white text-slate-900'>{slippageTolerance} %</p>
              </div>
            </div>
          </div>}

          {connected ?
            <>
              <Button
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
                Add Liquidity
              </Button>
            </> :
            <Button size={'sm'} radius="xl" className='font-semibold w-full bg-mainColor hover:bg-mainColor/80'>
              Connect Wallet
            </Button>}
        </div>
      }
    </div>
  )
}

export default AddLiquidityPoolContainer