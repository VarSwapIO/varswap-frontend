import React, { useState } from 'react';


import { Button, NumberInput } from '@mantine/core';
import ImageBG from '@/components/Image/ImageBG';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import SkeletonBG from '@/components/SkeletonBG';
import { BigNumber } from '@/helpers/big_number_cal';

interface InputLPTokenProps {
  value: string | number;
  onChange: (amount: string | number) => void;
  tokenA: TOKEN_METADATA;
  tokenB: TOKEN_METADATA;
  lpBalance: number | string;
  disable?: boolean;
  loading?: boolean;
  hiddenMaxBtn?: boolean;
  type: 'withdraw' | 'stake'
}
const InputLPToken = ({ value, onChange, tokenA, tokenB, disable, loading, hiddenMaxBtn, lpBalance, type }: InputLPTokenProps) => {
  const onChangeByPercent = (percent_num: number) => {
    const price = (+(lpBalance || 0) * (percent_num / 100) - 0)?.toString();
    onChange && onChange(price || 0);
  };
  return (
    <>
      <div className="relative bg-slate-100 dark:bg-slate-900 rounded-3xl">
        <div className="absolute right-4 top-6 w-fit h-fit z-20">
          <div
            className={`cursor-pointer shadow-md flex justify-center gap-2 items-center font-medium rounded-full w-fit p-2 text-center text-sm min-w-[120px] text-black dark:text-white dark:bg-slate-800 bg-white`}>
            <div className='flex'>
              <img className='w-6 h-6 rounded-full object-cover bg-white' src={tokenA?.icon} alt="token1-pool" />
              <img className='-ml-2 w-6 h-6 rounded-full object-cover bg-white' src={tokenB?.icon} alt="token2-pool" />
            </div>
            <p className='font-semibold text-xs'>{tokenA?.symbol}-{tokenB?.symbol} LP</p>
          </div>
        </div>
        <div className="w-full relative">
          <div className="absolute -bottom-6 left-6 flex flex-row-reverse gap-2">
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(100)} className="text-xs dark:bg-slate-800 dark:hover:bg-slate-700 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">{'Max'}</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(50)} className="text-xs dark:bg-slate-800 dark:hover:bg-slate-700 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">50%</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(25)} className="text-xs dark:bg-slate-800 dark:hover:bg-slate-700 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">25%</p>}
          </div>
          {!loading ? (
            <div className="block w-full p-4  sm:text-3xl placeholder-gray-100 text-black border border-transparent rounded-lg sm:text-md ">
              <NumberInput
                disabled={disable}
                className="w-full mt-2"
                classNames={{
                  input: `leading-9 text-xl sm:text-3xl border-transparent font-medium dark:text-white focus:outline-none bg-transparent dark:placeholder-gray-400 focus:border-transparent focus:ring-0`,
                }}
                placeholder="0"
                thousandSeparator=","
                decimalScale={5}
                hideControls
                value={value}
                onChange={(value_input: string | number) => onChange(value_input)}
                allowNegative={false}
              />
            </div>

          ) : (
            <div className="block w-full p-4 pt-6 bg-transparent text-3xl text-black dark:text-txtdark-200 border border-transparent rounded-lg  sm:text-md dark:placeholder-gray-400">
              <SkeletonBG width={180} height={35} />
            </div>
          )}
        </div>
        <div className='px-5 pb-3 h-8 flex justify-end'>
          <p className='text-xs sm:text-sm dark:text-slate-300 text-slate-600 font-semibold'>{type === 'stake' ? 'LP Tokens Staked' : 'Balance'}: {formatNumberDisplay(lpBalance)} </p>
        </div>
      </div>
    </>

  );
};

export default InputLPToken;
