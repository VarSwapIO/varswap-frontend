import { BigNumber } from '@/helpers/big_number_cal';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { BALANCE_TOKEN, TOKEN_LIST } from '@/mockData';
import { Input, Loader, Modal, Tooltip } from '@mantine/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import ImageBG from '../Image/ImageBG';

export interface ModalTokenSelectProps {
  show: boolean;
  onClick: (token: any) => void;
  onClose: () => void;
  tokenSelected?: any;
}

const ModalTokenSelect: FC<ModalTokenSelectProps> = ({ show, onClick, onClose, tokenSelected }) => {
  const [tokenList, setTokenList] = useState<TOKEN_METADATA[]>(TOKEN_LIST);
  const [tokenByAddress, setTokenByAddress] = useState<any>({});

  const [loadingCheckToken, setLoadingCheckToken] = useState(false);
  const textareaRef = useRef(null);

  const tokens = TOKEN_LIST
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

  const handleSearchToken = async (e: any) => {
    // setTokenByAddress({});
    // const name = e.target.value?.trim();
    // const tokens_filter: any = [];

  };

  const handleOnClickNewToken = async () => {

  };

  const renderContent = () => {
    return (
      <div>
        <div className="mb-4">
          <Input
            size={'sm'}
            leftSection={<svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>}
            variant="filled"
            radius="xl"
            className='md:block hidden'
            classNames={{
              input: `dark:bg-slate-700 bg-slate-100`,
              wrapper: ``
            }}
            placeholder="Search token name or paste address"
            onChange={(e: any) => handleSearchToken(e)}
          />

          <div className="flex flex-wrap gap-2 pt-4">
            {tokens.map((x: TOKEN_METADATA) => (
              <div
                key={x?.address}
                onClick={() => onClick && onClick(x)}
                className={`rounded-full font-medium text-slate-900 dark:text-white w-fit px-3 py-1.5 flex gap-2 items-center shadow-sm 
              hover:shadow-md border border-slate-100 dark:border-slate-800 cursor-pointer 
              ${tokenSelected?.address === x.address ?
                    'bg-slate-100 dark:bg-slate-700 border !border-mainColor' :
                    'bg-slate-100 hover:bg-slate-200/50 dark:bg-slate-700 dark:hover:bg-slate-600  hover:border-mainColor/20 dark:hover:border-mainColor/20 '}`}>
                <ImageBG
                  className="!w-6 !h-6 rounded-full bg-white object-cover"
                  src={x.icon}
                  alt="token"
                  width={24}
                  height={24}
                />
                {x.symbol}
              </div>
            ))}
          </div>
        </div>
        <div className="border-b dark:border-gray-700 border-gray-200 mb-4 w-full"></div>
        <div className="min-h-[310px] md:min-h-[400px] max-h-[310px] md:max-h-[400px] scrollbar overflow-y-auto">
          {loadingCheckToken ? <Loader /> :
            <>
              {tokenList?.map((x: TOKEN_METADATA) => (
                <div key={x?.address} onClick={() => onClick && onClick(x)} className={`flex items-end gap-4 p-2 px-4 rounded-xl cursor-pointer mb-2 ${tokenSelected?.address === x.address ? 'bg-slate-100 dark:bg-slate-700 border border-mainColor' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border dark:border-slate-700'}`}>
                  <ImageBG
                    className='w-10 h-10 rounded-full bg-white'
                    src={x.icon}
                    alt="token"
                    width={40}
                    height={40}
                  />
                  <div className=''>
                    <p className='font-semibold flex items-center gap-2 dark:text-white text-slate-900'>
                      {x.symbol}
                      {x?.verified && <Tooltip
                        label='Verified'
                      >
                        <svg viewBox="0 0 17 17" fill="none" className='w-4 h-4'>
                          <path
                            d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                            fill="#38BDF8"
                            stroke="#38BDF8"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.08691 8.98833L7.69358 10.6017L10.9136 7.375"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Tooltip>}
                    </p>
                    <p className='font-medium text-sm dark:text-slate-400 text-slate-600'>{x.name}</p>
                  </div>
                  {+BALANCE_TOKEN?.[x?.address]?.totalBalance > 0 && <div className='ml-auto'>
                    <p className='text-xs dark:text-white text-slate-800 font-semibold'>Balance: {formatNumberDisplay(BigNumber.parseNumberToOriginal(BALANCE_TOKEN?.[x?.address]?.totalBalance || 0, x?.decimals))} {x.symbol}</p>
                  </div>}
                </div>
              ))}
              {tokenByAddress?.name ? <>
                <div onClick={() => handleOnClickNewToken()} className={`flex items-center gap-4 p-2 rounded-md cursor-pointer mb-1 dark:hover:bg-gray-800 hover:bg-blue-100 ${tokenSelected?.coinType === tokenByAddress?.symbol ? 'bg-blue-100 dark:bg-gray-800' : ''}`}>
                  <img className='w-10 h-10 rounded-full bg-white' src={tokenByAddress.icon} alt="token" />
                  <div className=''>
                    <p className='font-semibold'>{tokenByAddress.symbol}</p>
                    <p className='font-normal text-sm'>{tokenByAddress.name}</p>
                  </div>
                  {tokenSelected?.coinType === tokenByAddress.coinType && <div className='text-blue-500 ml-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>}
                </div>
              </> :
                <> {tokenList?.length === 0 && <p className="text-txt-200 dark:text-txtdark-200 text-center mt-4">No results found</p>}</>}
            </>
          }
        </div>
      </div>
    );
  };

  return (
    <Modal
      size={'lg'}
      opened={show}
      title="Select Token"
      centered
      radius="lg"
      classNames={{
        title: "font-semibold lg:text-2xl dark:text-white",
        header: 'dark:bg-slate-800',
        body: 'dark:bg-slate-800',
        close: 'dark:hover:bg-slate-700'
      }}
      // closeOnClickOutside={false}
      onClose={() => onClose()}
    >
      {renderContent()}
    </Modal>
  );
};

export default ModalTokenSelect;
