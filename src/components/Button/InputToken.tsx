import React, { useState } from 'react';


import ModalTokenSelect from '../Modal/ModalTokenSelect';
import { Button, NumberInput } from '@mantine/core';
import ImageBG from '@/components/Image/ImageBG';
import { formatPriceTokenDisplay } from '@/helpers/format_number_display';
import SkeletonBG from '@/components/SkeletonBG';
import SelectToken from './SelectToken';

interface InputTokenProps {
  value: string | number;
  onChange: (amount: string | number) => void;
  onChangeToken?: (token: TOKEN_METADATA) => void;
  token?: any;
  disable?: boolean;
  loading?: boolean;
  disableSelectToken?: boolean;
  hiddenMaxBtn?: boolean;
}
const InputToken = ({ value, onChange, onChangeToken, token, disable, loading, disableSelectToken, hiddenMaxBtn }: InputTokenProps) => {
  const loadingCoin = true;
  const onChangeByPercent = (percent_num: number) => {
    // const price = BigNumber.parseNumberWithDecimals(balance?.[token?.coinType]?.totalBalance * (value / 100) - 10000, token?.decimals)?.toString();
    onChange && onChange('1110');
  };
  return (
    <>
      <div className="relative">
        <div className="absolute right-4 top-6 w-fit h-fit z-20">
          <SelectToken
            disableSelectToken={disableSelectToken}
            token={token}
            onChangeToken={(token: TOKEN_METADATA) => onChangeToken && onChangeToken(token)}
          />
        </div>
        <div className="w-full relative">
          <div className="absolute -bottom-6 left-6 flex flex-row-reverse gap-2">
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(100)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">{'Max'}</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(50)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">50%</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(25)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md font-medium rounded-md p-1 cursor-pointer">25%</p>}
          </div>
          {!loading ? (
            <div className="block w-full p-4  sm:text-3xl placeholder-gray-100 text-black dark:text-txtdark-200 border border-transparent rounded-lg sm:text-md ">
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
        <div className="px-5 pb-3 h-8 flex justify-end">
          {token?.symbol && <>
            {loadingCoin ? <SkeletonBG width={110} height={20} /> : <p className="text-xs sm:text-sm dark:text-gray-300 text-gray-500 font-medium">{'Balance'}: {formatPriceTokenDisplay(0)} {token.symbol}</p>}
          </>
          }
        </div>
      </div>
    </>

  );
};

export default InputToken;
