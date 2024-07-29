'use client';
import ImageBG from '@/components/Image/ImageBG';
import { Button, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import InputToken from '../../components/Button/InputToken';
import ModalConfirmSwap from './components/ModalConfirmSwap';
import SettingSlippage from '../../components/Button/SettingSlippage';

const SwapContainer = () => {
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
      <div className="mt-24 w-full max-w-lg m-auto bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-100 rounded-3xl shadow-lg p-4">
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
};

export default SwapContainer;
