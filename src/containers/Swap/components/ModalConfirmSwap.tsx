import ImageBG from '@/components/Image/ImageBG';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { Loader, Modal } from '@mantine/core';
import React, { FC, useEffect, useRef, useState } from 'react';

export interface ModalConfirmSwapProps {
  show: boolean;
  onClick: () => void;
  onClose: () => void;
  tokenA?: any;
  tokenB?: any;
  slippageTolerance?: any;
  priceAB?: any;
  priceBA?: any;
  minimumReceived?: any;
  priceImpact?: any;
  swapDoing?: boolean;
}

const ModalConfirmSwap: FC<ModalConfirmSwapProps> = ({ swapDoing, show, onClick, onClose, tokenA, tokenB, slippageTolerance, priceAB, priceBA, minimumReceived, priceImpact }) => {
  const textareaRef = useRef(null);
  const [showPrice, setShowPrice] = useState(true);
  const [confirmText] = useState('');

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        const element: HTMLTextAreaElement | null = textareaRef.current;
        if (element) {
          (element as HTMLTextAreaElement).focus();
          (element as HTMLTextAreaElement).setSelectionRange(
            (element as HTMLTextAreaElement).value.length,
            (element as HTMLTextAreaElement).value.length
          );
        }
      }, 400);
    }
  }, [show]);

  const renderContent = () => {
    return (
      <div>
        <div className="space-y-3 justify-between items-center gap-2 md:gap-6 ">
          <div className={'shadow-md flex justify-center space-x-1.5 items-center font-medium rounded-full p-1.5 py-2.5 text-center text-sm md:text-lg w-full text-black dark:text-white dark:bg-slate-200 bg-bglight-400'}>
            <ImageBG className="w-9 h-9 rounded-full object-cover bg-white" src={tokenA?.icon} alt="token" />
            <p>{formatNumberDisplay(tokenA?.amount || 0)}</p>
            <p>{tokenA?.symbol}</p>
          </div>
          <div className=" text-center flex justify-center items-cente">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
          </div>
          <div className={'shadow-md flex justify-center space-x-1.5 items-center font-medium rounded-full p-1.5 py-2.5 text-center text-sm md:text-lg w-full text-black dark:text-white dark:bg-slate-200 bg-bglight-400'}>
            <ImageBG className="w-9 h-9 rounded-full object-cover bg-white" src={tokenB?.icon} alt="token" />
            <p>{formatNumberDisplay(tokenB?.amount || 0)}</p>
            <p> {tokenB?.symbol}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-blue-500 px-1">
          Slippage Tolerance
          <p>{slippageTolerance}%</p>
        </div>
        <p className="text-sm px-1 mt-2 text-txt-200 dark:text-txtdark-200">Output is estimated. You will receive at least <span className="text-green-400 font-semibold">{formatNumberDisplay(minimumReceived || 0)} {tokenB?.symbol}</span> or the transaction will revert.</p>
        {/* {priceImpact > 20 && <div className="px-1 mt-1">
          <p className="text-red-500 mb-2">{'Price impact is too high. Please enter "Confirm" to confirm want to swap'}</p>
          <InputRPC onChange={(e: any) => setConfirmText(e.target.value)} />
        </div>} */}
        <div className="space-y-1.5 text-txt-200 dark:text-txtdark-200">
          <div className="flex justify-between items-center text-sm px-1 pt-4 border-t dark:border-slate-100 border-slate-100 mt-4">
            <p>Price</p>
            <div className="flex gap-2 items-center">
              <div className=" hover:text-gray-800 dark:hover:text-white">
                {showPrice ?
                  <p>1 {tokenA?.symbol} ≈ {priceAB} {tokenB?.symbol}</p> :
                  <p>1 {tokenB?.symbol} ≈ {priceBA} {tokenA?.symbol}</p>
                }
              </div>
              <svg onClick={() => setShowPrice(x => !x)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 cursor-pointer hover:text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm px-1">
            <p>Minimum received</p>
            <div className="flex gap-2 items-center">
              {formatNumberDisplay(minimumReceived || 0)} {tokenB?.symbol}
            </div>
          </div>
          <div className={`flex justify-between items-center text-sm px-1 ${priceImpact > 20 ? 'text-red-500' : ''}`}>
            <p>Price Impact</p>
            <div className={'flex gap-2 items-center'}>
              {priceImpact}%
            </div>
          </div>

        </div>
        <div className=" mt-4 ">
          {(priceImpact > 20 && confirmText !== 'Confirm') ? (
            <button className="text-white bg-gradient-to-br font-medium from-blue-500 to-blue-600 rounded-3xl w-full py-3 px-5 md:text-lg text-center opacity-50 cursor-default">
              Confirm
            </button>
          ) : (
            <button disabled={swapDoing} onClick={() => onClick()} className="flex gap-2 items-center justify-center text-white bg-gradient-to-br font-medium from-blue-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl w-full py-3 px-5 md:text-lg text-center">
              {swapDoing && <Loader className="!p-0 !w-fit" />} Confirm
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      opened={show}
      onClose={onClose}
    >
      {renderContent()}
    </Modal>
  );
};

export default ModalConfirmSwap;
