'use client'
import InputToken from '@/components/Button/InputToken';
import SelectToken from '@/components/Button/SelectToken';
import SettingSlippage from '@/components/Button/SettingSlippage';
import SkeletonBG from '@/components/SkeletonBG';
import { MAIN_COLOR } from '@/config/asset';
import { useConnectWallet } from '@/context/useConnectWallet';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatAmountWithFixed } from '@/helpers/format_number_display';
import { Button, Loader, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CreateLiquidityProvider, { useCreateLiquidity } from './context/useCreateLiquidityState';
import { toast } from 'react-toastify';
import { notifications } from '@mantine/notifications';
import ImageBG from '@/components/Image/ImageBG';
import Link from 'next/link';
import SailsCalls from '../router_sdk/SailsCalls';
import { CONTRACT_DATA, NETWORK } from '../router_sdk/constants';
import { convertToAddressNative, Field, Field_Liquidity } from '@/helpers/pools';
import { approveToken, getUserSigner, router_client } from '../Swap/utils';

const CreateLiquidityContainerImp = () => {
  const router = useRouter();
  const { connected, accountConnected } = useConnectWallet();
  const { token_swap, token_sort, amount_liquidity, slippage, onSelectToken, onTypingValue, onChangeSlippage, onClearTypedValue } = useCreateLiquidity()
  const [loadingPool, setLoadingPool] = useState<boolean>(false);
  const [poolCurrent, setPoolCurrent] = useState<POOL_LIQUIDITY_XY | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!!token_sort.token_x && !!token_sort.token_y) {
      getDataPool()
    }
  }, [token_sort])

  const getDataPool = async () => {
    if (!!token_sort.token_x && !!token_sort.token_y) {
      try {
        setLoadingPool(true);
        console.log('token_sort,token_swap :>> ', token_sort, token_swap);
        const sails = await SailsCalls.new({
          network: NETWORK,
          idl: CONTRACT_DATA.idl,
          contractId: CONTRACT_DATA.programId,
        });

        const pool_info = await sails?.query(
          `RouterService/GetReserves`,
          {
            callArguments: [
              token_sort.token_x.wrapped.address,
              token_sort.token_y.wrapped.address
            ]
          }
        )
        console.log('pool_info :>> ', pool_info);
        if (pool_info?.ok?.length > 0) {
          setPoolCurrent({
            reserve_x: BigInt(pool_info?.ok?.[0]?.toString())?.toString() || '0',
            reserve_y: BigInt(pool_info?.ok?.[1]?.toString())?.toString() || '0',
          })
        }

      } catch (error) {
        setPoolCurrent(undefined)
      } finally {
        setLoadingPool(false)
      }
    }
  }

  const handleCreateLiquidity = async () => {
    if (!accountConnected?.address || !token_swap?.token_in || !token_swap?.token_out) return
    console.log('amout_liquidity :>> ', token_swap, token_sort, amount_liquidity);

    try {
      setLoading(true);

      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
      });

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })

      const amount_x = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_in || 0), token_swap?.token_in?.decimals) || '0'
      const amount_y = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_out || 0), token_swap?.token_out?.decimals) || "0"

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


      const create_lp_success = await router_client.CreateLiquidityPair({
        token_a: token_swap?.token_in,
        token_b: token_swap?.token_out,
        signer: signer,
        userAddress: userAddress,
        sails: sails
      })

      if (!create_lp_success) {
        setLoading(false)
        return;
      }

      const add_lp_success = await router_client.AddLiquidity({
        token_a: token_swap?.token_in,
        token_b: token_swap?.token_out,
        signer: signer,
        userAddress: userAddress,
        sails: sails,
        decoded_address: accountConnected?.address_decoded,
        amount_liquidity: {
          [Field_Liquidity.INPUT]: amount_liquidity.token_in,
          [Field_Liquidity.OUTPUT]: amount_liquidity.token_out,
          [Field_Liquidity.MINIMUM_INPUT]: 0,
          [Field_Liquidity.MINIMUM_OUTPUT]: 0,
          [Field_Liquidity.LP_AMOUNT]: 0,
          [Field_Liquidity.LP_AMOUNT_PERCENT]: 0,
          [Field_Liquidity.PRICE_XY]: 0,
          [Field_Liquidity.PRICE_YX]: 0
        }
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
          <p className='text-lg font-semibold' > Create Pool</p>
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
          {loadingPool ? <div className='my-4 rounded-xl dark:bg-slate-800 bg-slate-100 p-10 flex justify-center items-center'>
            <Loader />
          </div> :
            <div>
              <div>
                <div className='my-4 rounded-xl dark:bg-slate-700 bg-slate-100 p-3'>
                  <p className='font-semibold text-sm mb-2 dark:text-white text-slate-900'>Select a pool</p>
                  <div className='cursor-pointer border border-mainColor/30 dark:bg-slate-800 bg-white flex gap-3 p-3 items-center font-medium rounded-xl text-center text-sm min-w-[120px] shadow-md'>
                    {loadingPool ? <SkeletonBG width={50} height={30} /> : <div className='flex'>
                      <img className='w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_in.icon} alt="token-x-pool" />
                      <img className='-ml-3 w-8 h-8 rounded-full object-cover bg-white' src={token_swap.token_out.icon} alt="token-y-pool" />
                    </div>}
                    {loadingPool ? <SkeletonBG width={100} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>{token_sort.token_x?.symbol} - {token_sort.token_y?.symbol}</p>}
                  </div>
                  {poolCurrent ? <div className='flex justify-between mt-3 dark:text-white text-slate-900'>
                    <p className='font-semibold text-sm'>Total liquidity</p>
                    {loadingPool ? <div className='h-[45px]'>
                      <SkeletonBG width={150} height={20} />
                      <SkeletonBG width={150} height={20} />
                    </div> :
                      <div className='text-right text-white font-semibold text-sm h-[45px]'>
                        <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(poolCurrent?.reserve_x, token_sort.token_x.decimals))} {token_sort.token_x?.symbol}</p>
                        <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(poolCurrent?.reserve_y, token_sort.token_y.decimals))} {token_sort.token_y?.symbol}</p>
                      </div>
                    }
                  </div> : null}
                </div>
                {!poolCurrent ? <div className='relative my-4'>
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
                </div> : null}
              </div>
              {/* Button  */}
              <>
                {connected ?
                  <>
                    {
                      !poolCurrent ? <Button
                        onClick={() => handleCreateLiquidity()}
                        size={'sm'}
                        radius="xl"
                        color={MAIN_COLOR}
                        variant={"light"}
                        className="w-full"
                        style={{
                          '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
                        }}
                      >
                        Create Pool
                      </Button> :
                        <Button
                          component={Link}
                          href={`/liquidity/add/${convertToAddressNative(token_sort?.token_x?.wrapped?.address)}/${convertToAddressNative(token_sort.token_y?.wrapped?.address)}`}
                          size={'sm'}
                          radius="xl"
                          color={MAIN_COLOR}
                          variant={"light"}
                          className="w-full"
                          style={{
                            '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
                          }}
                        >
                          Go to add liquidity
                        </Button>
                    }
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

const CreateLiquidityContainer = () => (
  <CreateLiquidityProvider>
    <CreateLiquidityContainerImp />
  </CreateLiquidityProvider>
)

export default CreateLiquidityContainer