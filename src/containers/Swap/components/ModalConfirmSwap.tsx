import ImageBG from '@/components/Image/ImageBG';
import { formatAmountWithFixed } from '@/helpers/format_number_display';
import { Button, Input, Loader, Modal } from '@mantine/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSwapState } from '../context/useSwapState';

export interface ModalConfirmSwapProps {
  show: boolean;
  onClick: () => void;
  onClose: () => void;
  data_trade: {
    minimum_received: string;
    amount_out: string;
    price_impact: number;
    price_ab: string;
    price_ba: string;
  }
  loading_swap: boolean;
}

const ModalConfirmSwap: FC<ModalConfirmSwapProps> = ({ show, onClick, onClose, data_trade, loading_swap }) => {
  const [confirmText, setConfirmText] = useState('')
  const { token_swap, typed_value, slippage } = useSwapState()
  const textareaRef = useRef(null);
  const [showPrice, setShowPrice] = useState(true);

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
          <div className={'shadow-md flex justify-center space-x-1.5 items-center font-medium rounded-full p-1.5 py-2.5 text-center text-sm md:text-lg w-full text-black dark:text-white dark:bg-slate-900'}>
            <ImageBG
              className="w-9 h-9 rounded-full object-cover bg-white"
              src={token_swap?.token_in?.icon || ''}
              alt="token"
              width={36}
              height={36}
            />
            <p>{formatAmountWithFixed(typed_value || 0)}</p>
            <p>{token_swap?.token_in?.symbol}</p>
          </div>
          <div className=" text-center flex justify-center items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
          </div>
          <div className={'shadow-md flex justify-center space-x-1.5 items-center font-medium rounded-full p-1.5 py-2.5 text-center text-sm md:text-lg w-full text-black dark:text-white dark:bg-slate-900'}>
            <ImageBG
              className="w-9 h-9 rounded-full object-cover bg-white"
              src={token_swap?.token_out?.icon || ''}
              alt="token"
              width={36}
              height={36}
            />
            <p>{formatAmountWithFixed((data_trade?.amount_out || 0))}</p>
            <p> {token_swap?.token_out?.symbol}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-blue-500 px-1">
          Slippage Tolerance
          <p>{slippage}%</p>
        </div>
        <p className="text-sm px-1 mt-2 font-semibold dark:text-white">Output is estimated. You will receive at least <span className="text-green-400 font-semibold">{formatAmountWithFixed(data_trade?.minimum_received || 0)} {token_swap?.token_out?.symbol}</span> or the transaction will revert.</p>
        {+data_trade?.price_impact > 20 && <div className="px-1 mt-1">
          <p className="text-red-500 text-xs font-semibold mb-2">{'Price impact is too high. Please enter "Confirm" to confirm want to swap'}</p>
          <Input
            size={'sm'}
            variant="filled"
            radius="xl"
            className='md:block hidden'
            classNames={{
              input: `dark:bg-slate-700 bg-slate-100 font-semibold text-white`,
              wrapper: ``
            }}
            placeholder="Confirm"
            value={confirmText}
            onChange={(e: any) => setConfirmText(e?.target?.value)}
          />
        </div>}
        <div className="space-y-1.5 text-txt-200 dark:text-white">
          <div className="flex justify-between items-center text-sm font-semibold px-1 pt-4 border-t dark:border-slate-700 border-slate-100 mt-4">
            <p>Price</p>
            <div className="flex gap-2 items-center">
              <div className=" hover:text-gray-800 dark:hover:text-white">
                {showPrice ?
                  <p>1 {token_swap?.token_in?.symbol} ≈ {data_trade?.price_ab} {token_swap?.token_out?.symbol}</p> :
                  <p>1 {token_swap?.token_out?.symbol} ≈ {data_trade?.price_ba} {token_swap?.token_in?.symbol}</p>
                }
              </div>
              <svg onClick={() => setShowPrice(x => !x)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 cursor-pointer hover:text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm px-1 font-semibold">
            <p>Minimum received</p>
            <div className="flex gap-2 items-center">
              {formatAmountWithFixed(data_trade?.minimum_received || 0)} {token_swap?.token_out?.symbol}
            </div>
          </div>
          <div className={`flex justify-between items-center text-sm px-1 ${+data_trade?.price_impact > 20 ? 'text-red-500' : ''}`}>
            <p>Price Impact</p>
            <div className={'flex gap-2 items-center'}>
              {data_trade?.price_impact}%
            </div>
          </div>

        </div>
        <div className=" mt-4 ">
          {(+data_trade?.price_impact > 20 && confirmText?.toLocaleLowerCase() !== 'confirm') ? (
            <Button className="text-white font-semibold bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl w-full  md:text-lg text-center opacity-50 cursor-default">
              Confirm
            </Button>
          ) : (
            <Button
              loading={loading_swap}
              onClick={() => onClick()}
              className="flex gap-2 items-center justify-center text-white bg-gradient-to-br font-semibold from-blue-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl w-full md:text-lg text-center">
              Confirm
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      size={'lg'}
      opened={show}
      title="Swap"
      centered
      radius="lg"
      classNames={{
        title: "font-semibold lg:text-2xl dark:text-white",
        header: 'dark:bg-slate-800',
        body: 'dark:bg-slate-800',
        close: 'dark:hover:bg-slate-700'
      }}
      closeOnClickOutside={false}
      onClose={() => onClose()}
    >
      {renderContent()}
    </Modal>
  );
};

export default ModalConfirmSwap;
