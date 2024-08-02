import ImageBG from '@/components/Image/ImageBG';
import { Button, Collapse, Loader, Tooltip } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import SkeletonBG from '@/components/SkeletonBG';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { useDisclosure } from '@mantine/hooks';
import SettingSlippage from '@/components/Button/SettingSlippage';
import InputToken from '@/components/Button/InputToken';
import SmartRouterResult from './SmartRouterResult';
import ModalConfirmSwap from './ModalConfirmSwap';
const SwapComponent = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [smartRouterOpened, { toggle: toggleSmartRouter }] = useDisclosure(false);
  // state
  const [firstToken, setFirstToken] = useState<TOKEN_METADATA>();
  const [secondToken, setSecondToken] = useState<TOKEN_METADATA>();
  const [amountFirstToken, setAmountFirstToken] = useState<any>(0);
  const [amountSecondToken, setAmountSecondToken] = useState<any>(0);
  const [swap, setSwap] = useState(false);
  const [slippageTolerance, setSlippageTolerance] = useState(0.1);
  const [currentFocusInput1, setCurrentFocusInput1] = useState(true);

  const [showModalConfirmSwap, setShowModalConfirmSwap] = useState(false);
  const [swapDoing] = useState(false);
  const [showPrice, setShowPrice] = useState(true)

  const connected = true;
  const data_cal: any = {};


  const handleReverse = () => {
    setSwap((x: boolean) => !x);
  };

  const handleSwap = async () => {
    //
  };
  return (
    <>
      <div className='bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4'>
        <div className="flex justify-between items-center">
          <p className="text-xl font-medium text-txt-300 dark:text-txtdark-300">{'Swap'}</p>
          <div className="flex gap-2 items-center">
            <SettingSlippage onChangeSlippageTolerance={(value: any) => setSlippageTolerance(value)} value={slippageTolerance} />
          </div>
        </div>
        <div className="relative my-4">
          <div className={`w-full border border-transparent dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 transition-all duration-300 ${swap ? 'translate-y-[116px]' : ''}`}>
            <InputToken
              onChangeToken={(token: TOKEN_METADATA) => setFirstToken(token)}
              onChange={(value: any) => setAmountFirstToken(value)}
              value={amountFirstToken}
              token={firstToken}
              hiddenMaxBtn={!!swap}
              loading={false}
            />
          </div>
          <div className={`w-full border border-transparent dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 mt-1 transition-all duration-300 ${swap ? '-translate-y-[116px]' : ''}`}>
            <InputToken
              onChangeToken={(token: TOKEN_METADATA) => setSecondToken(token)}
              onChange={(value: any) => setAmountSecondToken(value)}
              value={amountSecondToken}
              token={secondToken}
              hiddenMaxBtn={!swap}
              loading={false}
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
        {firstToken?.symbol && secondToken?.symbol &&
          <div className='overflow-hidden rounded-2xl px-3 sm:px-5 py-2 mb-2 font-medium dark:bg-slate-700 bg-slate-100 dark:text-white text-slate-900' >
            <div className='flex justify-between items-center group cursor-pointer' onClick={() => toggle()}>
              <div className='flex justify-start items-center text-sm gap-2'>
                {!opened ? <Tooltip position={'left'} label={
                  <div className=' p-3 rounded-3xl'>
                    <div className='flex justify-between items-center  text-xs'>
                      <p>Expected Output</p>
                      <p> {amountSecondToken} {secondToken.symbol} </p>
                    </div>
                    {data_cal?.priceImpacts && <div className={`flex justify-between items-center mt-1 text-xs ${Number(data_cal?.priceImpacts) > 15 ? 'text-red-500' : ''}`}>
                      <p>{"Price Impact"}</p>
                      {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{data_cal?.priceImpacts}%</p>}
                    </div>}
                    <div className='border-t dark:border-gray-600 border-gray-300 my-3'></div>
                    <div className='flex justify-between items-center gap-2 text-xs'>
                      <p>Minimum received after slippage  ({(slippageTolerance || 0)}%)</p>
                      {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{data_cal?.minimumReceived} {firstToken?.symbol}</p>}
                    </div>
                    <div className='flex justify-between items-center mt-1 text-xs'>
                      <p>Fee</p>
                      {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{formatNumberDisplay(amountFirstToken * 0.25)} {secondToken?.symbol}</p>}
                    </div>
                  </div>
                }>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </Tooltip> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>}
                <div onClick={() => setShowPrice(x => !x)} className="cursor-pointer hover:text-gray-800 dark:hover:text-white">
                  {showPrice ?
                    <p>1 {firstToken?.symbol} ≈ {10} {secondToken?.symbol}</p> :
                    <p>1 {secondToken?.symbol} ≈ {0.1} {firstToken?.symbol}</p>
                  }
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"
                className={`w-4 h-4 group-hover:text-mainColor transition-all duration-200 ${opened ? 'rotate-180 text-mainColor' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <Collapse in={opened}>
              <div className={`overflow-hidden rounded-b-md py-4`}>
                <div className=''>
                  <div className='flex justify-between items-center  text-sm'>
                    <p>Expected Output</p>
                    <p> {amountSecondToken} {secondToken.symbol} </p>
                  </div>
                  {data_cal?.priceImpacts && <div className={`flex justify-between items-center mt-1 text-sm ${Number(data_cal?.priceImpacts) > 15 ? 'text-red-500' : ''}`}>
                    <p>{"Price Impact"}</p>
                    {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{data_cal?.priceImpacts}%</p>}
                  </div>}
                  <div className='border-t dark:border-gray-600 border-gray-300 my-3'></div>
                  <div className='flex justify-between gap-4 items-center text-sm'>
                    <p>Minimum received after slippage ({(slippageTolerance || 0)}%)</p>
                    {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{data_cal?.minimumReceived} {secondToken?.symbol}</p>}
                  </div>
                  {!data_cal?.isCetus && <div className='flex justify-between items-center mt-1 text-sm'>
                    <p>Liquidity provider fee</p>
                    {!data_cal ? <SkeletonBG width={50} height={20} /> : <p>{formatNumberDisplay(0.05)} {firstToken?.symbol}</p>}
                  </div>}
                </div>
              </div>
            </Collapse>

          </div>}
        {firstToken?.symbol && secondToken?.symbol &&
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
                <SmartRouterResult paths={[]} />
              </div>
            </Collapse>

          </div>}
        {connected ? (
          <>
            {firstToken?.symbol && secondToken?.symbol ? (
              <>
                {(!!data_cal?.amountIn || !!data_cal?.ammountOut) ? (
                  <>
                    {!connected ? (
                      <button className="text-black bg-gradient-to-br font-medium from-mainColor to-mainColor rounded-3xl w-full py-3 px-5 md:text-lg text-center opacity-50 cursor-default">
                        Insufficient {firstToken?.symbol} balance
                      </button>
                    ) : (
                      <>
                        {Number(data_cal?.priceImpacts) > 15 ? (
                          <div>
                            <p className="text-red-500 my-2 ml-2">Price impact is too high</p>
                            <button disabled={swapDoing || data_cal?.loadingSwapCal} onClick={() => setShowModalConfirmSwap(true)} className="text-white flex items-center justify-center gap-2 bg-gradient-to-br font-medium from-mainColor to-mainColor hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl w-full py-3 px-5 md:text-lg text-center">
                              {swapDoing && <Loader className="!p-0 !w-fit" />} {'Swap'}
                            </button>
                          </div>
                        ) : (
                          <button disabled={swapDoing || data_cal?.loadingSwapCal} onClick={() => setShowModalConfirmSwap(true)} className="text-white flex items-center justify-center gap-2 bg-gradient-to-br font-medium from-mainColor to-mainColor hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl w-full py-3 px-5 md:text-lg text-center">
                            {swapDoing && <Loader className="!p-0 !w-fit" />} {'Swap'}
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!data_cal?.notFound ? (
                      <button className="text-black bg-gradient-to-br font-medium from-mainColor to-mainColor rounded-3xl w-full py-3 px-5 md:text-lg text-center opacity-50 cursor-default">
                        Insufficient liquidity for this trade.
                      </button>
                    ) : (
                      <button className="text-black bg-gradient-to-br font-medium from-mainColor to-mainColor rounded-3xl w-full py-3 px-5 md:text-lg text-center opacity-50 cursor-default">
                        {'Enter an amount'}
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <button className="text-black bg-gradient-to-br font-medium from-mainColor to-mainColor rounded-3xl w-full py-3 px-5 md:text-lg text-center opacity-50 cursor-default">
                Select a token
              </button>
            )}
          </>
        ) : (
          <Button className="w-full !px-5 !py-3" >
            {'Connect Wallet'}
          </Button>
        )}
      </div>
      <ModalConfirmSwap
        tokenA={{ ...firstToken, amount: currentFocusInput1 ? amountFirstToken ?? 0 : data_cal?.amountIn }}
        tokenB={{ ...secondToken, amount: currentFocusInput1 ? data_cal?.ammountOut : amountSecondToken }}
        slippageTolerance={slippageTolerance}
        minimumReceived={data_cal?.minimumReceived}
        priceAB={data_cal?.formattedPrice_1}
        priceBA={data_cal?.formattedPrice_2}
        priceImpact={data_cal?.priceImpacts}
        show={showModalConfirmSwap}
        onClose={() => setShowModalConfirmSwap(false)}
        onClick={() => handleSwap()}
        swapDoing={swapDoing}
      />
    </>
  );
}

export default SwapComponent