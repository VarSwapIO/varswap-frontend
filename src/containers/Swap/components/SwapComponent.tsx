'use client'
import { Button, Collapse, Tooltip } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import SettingSlippage from '@/components/Button/SettingSlippage';
import SmartRouterResult from './SmartRouterResult';
import ModalConfirmSwap from './ModalConfirmSwap';
import InputToken from '@/components/Button/InputToken';
import { MAIN_COLOR, MAIN_COLOR_DISABLE, MAIN_TEXT_COLOR_DISABLE } from '@/config/asset';
import { Field } from '../types';
import { toast } from 'react-toastify';
import { notifications } from '@mantine/notifications';
import ImageBG from '@/components/Image/ImageBG';
import { BigNumber } from '@/helpers/big_number_cal';
import { useConnectWallet } from '@/context/useConnectWallet';
import SwapStateProvider, { useSwapState } from '../context/useSwapState';
import SwapSkeleton from './SwapSkeleton';
import { approveToken, getUserSigner, router_client } from '../utils';
import { CONTRACT_DATA, NETWORK, VFT_IDL } from '@/containers/router_sdk/constants';
import { send_message } from '@/containers/router_sdk';
import SailsCalls from '@/containers/router_sdk/SailsCalls';

type RESULT_SWAP = {
  amount_in: string;
  amount_out: string;
  amount_out_formatted: string;
  amount_in_formatted: string;
  formatted_price1: string;
  formatted_price2: string;
  minimum_received: string;
  price_impact: number;
  router: undefined | any,
  payload: undefined | any
}

const SwapComponentImp = () => {
  const { connected, onChangeStateModalConnect, accountConnected, balances } = useConnectWallet();
  const [opened, { toggle }] = useDisclosure(false); // swap detail
  const [smartRouterOpened, { toggle: toggleSmartRouter }] = useDisclosure(false); //  swap router

  // animation for switch swap
  const [swap, setSwap] = useState(false);
  const [swapAnimationPending, setSwapAnimationPending] = useState(false);

  const [showModalConfirmSwap, setShowModalConfirmSwap] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [loadingSwap, setLoadingSwap] = useState(false)
  const [resultSwapCal, setResultSwapCal] = useState<RESULT_SWAP>({
    amount_in: '0',
    amount_out: '0',
    amount_out_formatted: '0',
    amount_in_formatted: '0',
    formatted_price1: '0',
    formatted_price2: '0',
    minimum_received: '0',
    price_impact: 0,
    router: undefined,
    payload: undefined
  })
  const [loadingResult, setLoadingResult] = useState(false)
  //state swap
  const {
    token_swap,
    slippage,
    independent_field,
    typed_value,
    onChangeSlippage,
    onSelectToken,
    onSwitchToken,
    onTypingValue
  } = useSwapState();

  const [typed_value_debounce] = useDebouncedValue(typed_value, 300);
  const [slippage_debounce] = useDebouncedValue(slippage, 300);

  useEffect(() => {
    getResultSwapCal();

    let interval = setInterval(() => {
      getResultSwapCal();
    }, 10000);
    return () => clearInterval(interval)
  }, [token_swap, typed_value_debounce, slippage_debounce])

  const getResultSwapCal = async () => {
    if (!token_swap?.token_in || !token_swap?.token_out ) return;
    try {
      setLoadingResult(true)
      const amount_in = typed_value_debounce
      if (+amount_in === 0) {
        setResultSwapCal({
          amount_in: '0',
          amount_out: '0',
          amount_out_formatted: '0',
          amount_in_formatted: '0',
          formatted_price1: '0',
          formatted_price2: '0',
          minimum_received: '0',
          price_impact: 0,
          router: undefined,
          payload: undefined
        })
        setLoadingResult(false)
        return;
      }
      const quoteResponse = await router_client.ExactInSwapQuote({
        fromToken: token_swap.token_in,
        toToken: token_swap.token_out,
        fromTokenAmount: amount_in,
        slippage: slippage_debounce * 100,
        walletAddress: accountConnected?.address_decoded || ''
      })
      console.log('quoteResponse :>> ', quoteResponse);
      setLoadingResult(false);
      setResultSwapCal(quoteResponse)

    } catch (error) {
      if (error?.toString()?.includes('Failed to fetch')) {
        getResultSwapCal()
      }
    }
  }




  const handleReverse = () => {
    setSwap((x: boolean) => !x);

    setSwapAnimationPending(true);
    setTimeout(() => {
      onSwitchToken()
      setSwapAnimationPending(false);
    }, 400);
  };

  const handleSwap = async () => {
    let id = null;
    try {
      setLoadingSwap(true);

      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
      });

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })

      // approve token
      if (token_swap?.token_in?.address !== 'NATIVE') {
        const approve_token_success = await approveToken(resultSwapCal?.payload.args[2][0], resultSwapCal?.payload.args[0], userAddress, signer, token_swap?.token_in)
        if (!approve_token_success) {
          setLoadingSwap(false)
          return;
        }
      }
      // end approve

      id = notifications.show({
        loading: true,
        title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
          <ImageBG
            src={token_swap?.token_in?.icon || ''}
            alt="product-logo"
            width={23}
            height={23}
            className="w-[23px] h-[23px] rounded-full object-cover"
          />
          <p className='text-white font-semibold'>{token_swap?.token_in?.symbol}</p>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-mainColor' viewBox="0 0 24 24"><path fill="currentColor" d="m15 3.086l7.414 7.414H2v-2h15.586l-4-4zM22 13.5v2H6.414l4 4L9 20.914L1.586 13.5z"></path></svg>
          <ImageBG
            src={token_swap?.token_out?.icon || ''}
            alt="product-logo"
            width={23}
            height={23}
            className="w-[23px] h-[23px] rounded-full object-cover"
          />
          <p className='text-white font-semibold'>{token_swap?.token_out?.symbol}</p>
        </div>,
        message: <p className='text-orange-500 text-xs font-semibold'>Swap {typed_value} {token_swap?.token_in?.symbol} to {resultSwapCal?.amount_out_formatted} {token_swap?.token_out?.symbol} processing ...</p>,
        autoClose: false,
        withCloseButton: false,
        className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
        classNames: {
          body: "dark:text-slate-300 text-slate-700 font-medium",
          root: 'mt-2',
          closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
          description: 'dark:text-slate-300 text-slate-700 mt-2'
        },
      });
      const url_command = `${CONTRACT_DATA.programId}/RouterService/${resultSwapCal.payload.methodName}`;
      let block_current: string | undefined = undefined
      const response = await send_message(url_command, resultSwapCal.payload, () => {
        console.log('Message to send is loading');
      }, (block) => {
        block_current = block
      }, () => {
        toast.error('An error occurred please try again!')
      }, {
        userAddress, signer
      }, sails);

      console.log('response', response)
      if (response?.ok?.length > 0) {
        notifications.update({
          id,
          loading: false,
          title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
            <ImageBG
              src={token_swap?.token_in?.icon || ''}
              alt="product-logo"
              width={23}
              height={23}
              className="w-[23px] h-[23px] rounded-full object-cover"
            />
            <p className='text-white font-semibold'>{token_swap?.token_in?.symbol}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-mainColor' viewBox="0 0 24 24"><path fill="currentColor" d="m15 3.086l7.414 7.414H2v-2h15.586l-4-4zM22 13.5v2H6.414l4 4L9 20.914L1.586 13.5z"></path></svg>
            <ImageBG
              src={token_swap?.token_out?.icon || ''}
              alt="product-logo"
              width={23}
              height={23}
              className="w-[23px] h-[23px] rounded-full object-cover"
            />
            <p className='text-white font-semibold'>{token_swap?.token_out?.symbol}</p>
          </div>,
          message: <div className=''>
            <p className='text-green-500 text-xs font-semibold'>Swap {typed_value} {token_swap?.token_in?.symbol} to {resultSwapCal?.amount_out_formatted} {token_swap?.token_out?.symbol} successful</p>
            <div className='text-[10px] flex justify-end items-center gap-2 text-mainColor hover:text-mainColor/80 w-fit ml-auto'>
              <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' viewBox="0 0 24 24"><path fill="currentColor" d="M18 10.82a1 1 0 0 0-1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h7.18a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-7.18a1 1 0 0 0-1-1m3.92-8.2a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59L8.29 14.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38"></path></svg>
              <a
                href={`https://idea.gear-tech.io/explorer/${block_current}`}
                target={"_blank"}
                rel="noopener noreferrer"
                className='font-semibold'
              >View transaction </a>
            </div>
          </div>,
          className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
          classNames: {
            body: "dark:text-slate-300 text-slate-700 font-medium",
            root: 'mt-2',
            closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
            description: 'dark:text-slate-300 text-slate-700 mt-2'
          },
          autoClose: 8000,
        })
        setLoadingSwap(false);
        setShowModalConfirmSwap(false);
      } else {
        notifications.update({
          id,
          loading: false,
          title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
            <ImageBG
              src={token_swap?.token_in?.icon || ''}
              alt="product-logo"
              width={23}
              height={23}
              className="w-[23px] h-[23px] rounded-full object-cover"
            />
            <p className='text-white font-semibold'>{token_swap?.token_in?.symbol}</p>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-mainColor' viewBox="0 0 24 24"><path fill="currentColor" d="m15 3.086l7.414 7.414H2v-2h15.586l-4-4zM22 13.5v2H6.414l4 4L9 20.914L1.586 13.5z"></path></svg>
            <ImageBG
              src={token_swap?.token_out?.icon || ''}
              alt="product-logo"
              width={23}
              height={23}
              className="w-[23px] h-[23px] rounded-full object-cover"
            />
            <p className='text-white font-semibold'>{token_swap?.token_out?.symbol}</p>
          </div>,
          message: <div className=''>
            <p className='text-red-500 text-xs font-semibold'>Swap {typed_value} {token_swap?.token_in?.symbol} to {resultSwapCal?.amount_out_formatted} {token_swap?.token_out?.symbol} failed</p>
          </div>,
          className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
          classNames: {
            body: "dark:text-slate-300 text-slate-700 font-medium",
            root: 'mt-2',
            closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
            description: 'dark:text-slate-300 text-slate-700 mt-2'
          },
          autoClose: 8000,
        })
      }

    } catch (error) {
      if (error?.toString()?.includes("User denied request signature")) {
        toast.error('User has rejected the request')
      } else {
        if (!!id) {
          notifications.update({
            id,
            loading: false,
            title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
              <ImageBG
                src={token_swap?.token_in?.icon || ''}
                alt="product-logo"
                width={23}
                height={23}
                className="w-[23px] h-[23px] rounded-full object-cover"
              />
              <p className='text-white font-semibold'>{token_swap?.token_in?.symbol}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-mainColor' viewBox="0 0 24 24"><path fill="currentColor" d="m15 3.086l7.414 7.414H2v-2h15.586l-4-4zM22 13.5v2H6.414l4 4L9 20.914L1.586 13.5z"></path></svg>
              <ImageBG
                src={token_swap?.token_out?.icon || ''}
                alt="product-logo"
                width={23}
                height={23}
                className="w-[23px] h-[23px] rounded-full object-cover"
              />
              <p className='text-white font-semibold'>{token_swap?.token_out?.symbol}</p>
            </div>,
            message: <div className=''>
              <p className='text-red-500 text-xs font-semibold'>{error?.toString()}</p>
            </div>,
            className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
            classNames: {
              body: "dark:text-slate-300 text-slate-700 font-medium",
              root: 'mt-2',
              closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
              description: 'dark:text-slate-300 text-slate-700 mt-2'
            },
            autoClose: 8000,
          })
        } else {
          toast.error(error?.toString() || '')
        }
      }
      setLoadingSwap(false);
    }


  };
  const balance_token_input = balances?.[token_swap?.token_in?.address || '']?.amount || '0'
  return (
    <>
      <div className='bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4'>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold text-txt-300 dark:text-white">{'Swap'}</p>
          <div className="flex gap-2 items-center">
            <SettingSlippage
              onChangeSlippageTolerance={(value: any) => onChangeSlippage(value)}
              value={slippage}
            />
          </div>
        </div>
        <div className="relative my-4">
          <div className={`absolute w-full h-full ${swapAnimationPending ? 'visible opacity-100' : 'invisible opacity-0'}`}>
            <SwapSkeleton
              is_swap={swap}
              token_input={token_swap[Field.INPUT]}
              token_output={token_swap[Field.OUTPUT]}
            />
          </div>
          <div className={`${swapAnimationPending ? 'invisible opacity-0' : ''} w-full border border-transparent dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 `}>
            <InputToken
              onChangeToken={(token: COIN_METADATA) => onSelectToken(token, Field.INPUT)}
              onChange={(value: string | number) => onTypingValue(value?.toString(), Field.INPUT)}
              value={independent_field === Field.INPUT ? typed_value : 0}
              token={token_swap[Field.INPUT]}
              hiddenMaxBtn={false}
              loading={false}
            />
          </div>
          <div className={`${swapAnimationPending ? 'invisible opacity-0' : ''} w-full border border-transparent dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 mt-1`}>
            <InputToken
              onChangeToken={(token: COIN_METADATA) => onSelectToken(token, Field.OUTPUT)}
              onChange={(value: string | number) => onTypingValue(value?.toString(), Field.OUTPUT)}
              value={independent_field === Field.OUTPUT ? typed_value : resultSwapCal?.amount_out_formatted}
              token={token_swap[Field.OUTPUT]}
              hiddenMaxBtn={true} 
              loading={loadingResult}
              disable={true}
            />
          </div>
          <div onClick={() => handleReverse()} className="absolute inset-0 m-auto h-9 w-9 rounded-3xl dark:text-gray-300 text-gray-500 dark:bg-slate-800 dark:hover:bg-slate-700 bg-[#edf8f1] hover:bg-[#def7e7] p-1.5 flex justify-center items-center cursor-pointer border-4 border-white dark:border-slate-900">
            <ImageBG
              src="/images/icons/swap-icon.svg"
              alt="Vercel Logo"
              width={22}
              height={22}
              priority
            />
          </div>
        </div>

        {/* calculate swap */}
        {!!token_swap?.token_in && !!token_swap?.token_out && !!typed_value &&
          <div className='overflow-hidden rounded-2xl px-3 sm:px-5 py-2 mb-2 font-medium dark:bg-slate-700 bg-slate-100 dark:text-white text-slate-900' >
            <div className='flex justify-between items-center group cursor-pointer' onClick={() => toggle()}>
              <div className='flex justify-start items-center text-sm gap-2'>
                {!opened ? <Tooltip position={'left'} label={
                  <div className=' p-3 rounded-3xl font-semibold'>
                    <div className='flex justify-between items-center  text-xs'>
                      <p>Expected Output</p>
                      <p> {resultSwapCal?.amount_out_formatted} {token_swap?.token_out.symbol} </p>
                    </div>
                    {resultSwapCal?.price_impact && <div className={`flex justify-between items-center mt-1 text-xs ${Number(resultSwapCal?.price_impact) > 15 ? 'text-red-500' : ''}`}>
                      <p>{"Price Impact"}</p>
                      <p>{resultSwapCal?.price_impact}%</p>
                    </div>}
                    <div className='border-t dark:border-gray-600 border-gray-300 my-3'></div>
                    <div className='flex justify-between items-center gap-2 text-xs'>
                      <p>Minimum received  ({(slippage || 0)}%)</p>
                      <p>{resultSwapCal?.minimum_received} {token_swap?.token_out?.symbol}</p>
                    </div>
                    {/* <div className='flex justify-between items-center mt-1 text-xs'>
                      <p>Fee</p>
                      <p>{formatPriceTokenDisplay(+typed_value * 0.01, true)} {token_swap?.token_in?.symbol}</p>
                    </div> */}
                  </div>
                }>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </Tooltip> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>}
                <div onClick={() => setShowPrice(x => !x)} className="cursor-pointer font-semibold hover:text-gray-800 dark:hover:text-white">
                  {showPrice ?
                    <p>1 {token_swap?.token_in?.symbol} ≈ {resultSwapCal?.formatted_price1} {token_swap?.token_out?.symbol}</p> :
                    <p>1 {token_swap?.token_out?.symbol} ≈ {resultSwapCal?.formatted_price2} {token_swap?.token_in?.symbol}</p>
                  }
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                className={`w-4 h-4 group-hover:text-mainColor transition-all duration-200 ${opened ? 'rotate-180 text-mainColor' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <Collapse in={opened}>
              <div className={`overflow-hidden rounded-b-md py-4 font-semibold`}>
                <div className=''>
                  <div className='flex justify-between items-center  text-sm'>
                    <p>Expected Output</p>
                    <p> {resultSwapCal?.amount_out_formatted} {token_swap?.token_out.symbol} </p>
                  </div>
                  {resultSwapCal?.price_impact && <div className={`flex justify-between items-center mt-1 text-sm ${Number(resultSwapCal?.price_impact) > 15 ? 'text-red-500' : ''}`}>
                    <p>{"Price Impact"}</p>
                    <p>{resultSwapCal?.price_impact}%</p>
                  </div>}
                  <div className='border-t dark:border-gray-600 border-gray-300 my-3'></div>
                  <div className='flex justify-between gap-4 items-center text-sm'>
                    <p>Minimum received({(slippage || 0)}%)</p>
                    <p>{resultSwapCal?.minimum_received} {token_swap?.token_out?.symbol}</p>
                  </div>
                  {/* <div className='flex justify-between items-center mt-1 text-sm'>
                    <p>Liquidity provider fee</p>
                    <p>{formatPriceTokenDisplay(+typed_value * 0.01, true)} {token_swap?.token_in?.symbol}</p>
                  </div> */}
                </div>
              </div>
            </Collapse>

          </div>}
        {!!token_swap?.token_in && !!token_swap?.token_out && !!typed_value &&
          <div className='overflow-hidden rounded-2xl px-3 sm:px-5 py-2 mb-2 font-medium dark:bg-slate-700 bg-slate-100 dark:text-white text-slate-900' >
            <div className='flex justify-between items-center group cursor-pointer' onClick={() => toggleSmartRouter()}>
              <div className='flex gap-2 items-center  text-mainColor font-semibold'>
                <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 256 256"><path fill="currentColor" d="M200 164a36.07 36.07 0 0 0-33.94 24H72a28 28 0 0 1 0-56h96a44 44 0 0 0 0-88H72a12 12 0 0 0 0 24h96a20 20 0 0 1 0 40H72a52 52 0 0 0 0 104h94.06A36 36 0 1 0 200 164m0 48a12 12 0 1 1 12-12a12 12 0 0 1-12 12"></path></svg>
                <p> Smart router</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                className={`w-4 h-4 group-hover:text-mainColor transition-all duration-200 ${smartRouterOpened ? 'rotate-180 text-mainColor' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <Collapse in={smartRouterOpened}>
              <div className={`overflow-hidden rounded-b-md py-4`}>
                <SmartRouterResult paths={resultSwapCal?.router?.path || []} />
              </div>
            </Collapse>

          </div>}
        {connected ? (
          <>
            {!!token_swap?.token_in && !!token_swap?.token_out ? (
              <>
                {(!!resultSwapCal?.amount_out_formatted && +resultSwapCal?.amount_out_formatted !== 0) ? (
                  <>
                    {+resultSwapCal?.amount_in_formatted > +(BigNumber.parseNumberToOriginal(balance_token_input, token_swap?.token_in?.decimals) || 0) ? (
                      <Button
                        color={MAIN_COLOR}
                        disabled
                        className="rounded-3xl w-full text-center"
                        style={{
                          '--mantine-color-dark-6': MAIN_COLOR_DISABLE, '--mantine-color-dark-3': MAIN_TEXT_COLOR_DISABLE
                        }}>
                        Insufficient {token_swap?.token_in?.symbol} balance
                      </Button>
                    ) : (
                      <>
                        {Number(resultSwapCal?.price_impact) > 15 ? <p className="text-red-500 my-2 ml-2">Price impact is too high</p> : null}
                        <Button
                          onClick={() => setShowModalConfirmSwap(true)}
                          color={MAIN_COLOR}
                          className="rounded-3xl w-full text-center"
                          style={{
                            '--mantine-color-dark-6': MAIN_COLOR_DISABLE, '--mantine-color-dark-3': MAIN_TEXT_COLOR_DISABLE
                          }}>
                          {'Swap'}
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!resultSwapCal && !!typed_value ? (
                      <Button
                        color={MAIN_COLOR}
                        disabled
                        className="rounded-3xl w-full text-center"
                        style={{
                          '--mantine-color-dark-6': MAIN_COLOR_DISABLE, '--mantine-color-dark-3': MAIN_TEXT_COLOR_DISABLE
                        }}>
                        Insufficient liquidity for this trade
                      </Button>
                    ) : (
                      <Button
                        color={MAIN_COLOR}
                        disabled
                        className="rounded-3xl w-full text-center"
                        style={{
                          '--mantine-color-dark-6': MAIN_COLOR_DISABLE, '--mantine-color-dark-3': MAIN_TEXT_COLOR_DISABLE
                        }}
                        onClick={() => handleSwap()}
                      >
                        {'Enter an amount'}
                      </Button>
                    )}
                  </>
                )}
              </>
            ) : (
              <Button
                color={MAIN_COLOR}
                disabled
                className=" rounded-3xl w-full text-center"
                style={{
                  '--mantine-color-dark-6': MAIN_COLOR_DISABLE, '--mantine-color-dark-3': MAIN_TEXT_COLOR_DISABLE
                }}
              >
                Select a token
              </Button>
            )}

          </>
        ) : (
          <Button
            radius={'xl'}
            size="md"
            color={MAIN_COLOR}
            className='w-full max-w-screen-md'
            onClick={() => onChangeStateModalConnect(true)}
          >
            Connect Wallet
          </Button>
        )}
      </div>
      <ModalConfirmSwap
        show={showModalConfirmSwap}
        onClose={() => setShowModalConfirmSwap(false)}
        onClick={() => handleSwap()}
        data_trade={
          {
            minimum_received: resultSwapCal?.minimum_received || '0',
            amount_out: resultSwapCal?.amount_out_formatted,
            price_impact: resultSwapCal?.price_impact || 0,
            price_ab: resultSwapCal?.formatted_price1 || '0',
            price_ba: resultSwapCal?.formatted_price2 || '0'
          }
        }
        loading_swap={loadingSwap}
      />
    </>
  );
}


export const SwapComponent = () => (
  <SwapStateProvider>
    <SwapComponentImp />
  </SwapStateProvider>
)
export default SwapComponent