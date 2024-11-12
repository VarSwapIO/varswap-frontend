import React, { memo } from 'react';
import { NumberInput } from '@mantine/core';
import { formatPriceTokenDisplay } from '@/helpers/format_number_display';
import SkeletonBG from '@/components/SkeletonBG';
import { BigNumber } from '@/helpers/big_number_cal';
import SelectToken from './SelectToken';
import { useConnectWallet } from '@/context/useConnectWallet';

interface InputTokenProps {
  value: string | number;
  onChange: (amount: string | number) => void;
  onChangeToken?: (token: COIN_METADATA) => void;
  token?: COIN_METADATA;
  disable?: boolean;
  loading?: boolean;
  disableSelectToken?: boolean;
  hiddenMaxBtn?: boolean;
}
const InputToken = ({ value, onChange, onChangeToken, token, disable, loading, disableSelectToken, hiddenMaxBtn }: InputTokenProps) => {
  const { balances } = useConnectWallet();
  const balance_token = token?.address ? balances?.[token?.address] : {
    amount: 0,
  }
  const onChangeByPercent = (percent_num: number) => {

    if (!balance_token?.amount) {
      onChange && onChange('0');
      return;
    }

    const price = BigNumber.parseNumberToOriginal(Math.floor((+balance_token?.amount || 0) * (percent_num / 100) - 10000), token?.decimals)?.toString();
    onChange && onChange(price || '0');
  };
  return (
    <>
      <div className="relative">
        <div className="absolute right-4 top-6 w-fit h-fit z-20">
          <SelectToken
            disableSelectToken={disableSelectToken}
            token={token}
            onChangeToken={(token: COIN_METADATA) => onChangeToken && onChangeToken(token)}
          />
        </div>
        <div className="w-full relative">
          <div className="absolute -bottom-6 left-6 flex flex-row-reverse gap-2 font-semibold">
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(100)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md rounded-md p-1 cursor-pointer">{'Max'}</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(50)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md rounded-md p-1 cursor-pointer">50%</p>}
            {!hiddenMaxBtn && <p onClick={() => onChangeByPercent(25)} className="text-xs dark:bg-slate-900 dark:hover:bg-slate-800 bg-white hover:bg-slate-50 shadow-md rounded-md p-1 cursor-pointer">25%</p>}
          </div>
          {!loading ? (
            <div className="block w-full p-4 sm:text-3xl placeholder-gray-100 text-black dark:text-white border border-transparent rounded-lg sm:text-md ">
              <NumberInput
                disabled={disable}
                className="w-full mt-2"
                classNames={{
                  input: `leading-9 text-xl sm:text-3xl border-transparent font-medium dark:!text-white !opacity-100
                  focus:outline-none bg-transparent dark:placeholder-gray-400 focus:border-transparent focus:ring-0`,
                }}
                style={{
                  '--mantine-color-dark-2': '#334155', '--mantine-color-dark-6': '#334155'
                }}
                placeholder="0"
                thousandSeparator=","
                decimalScale={6}
                hideControls
                valueIsNumericString={true}
                value={value}
                onChange={(value_input: string | number) => onChange(value_input)}
                allowNegative={false}
              />
            </div>

          ) : (
            <div className="block w-full p-4 pt-6 bg-transparent text-3xl text-black dark:text-white border border-transparent rounded-lg  sm:text-md dark:placeholder-gray-400">
              <SkeletonBG width={180} height={35} />
            </div>
          )}
        </div>
        <div className="px-5 pb-3 h-8 flex justify-end">
          {token?.symbol && <>
            <p className="text-xs sm:text-sm font-semibold dark:text-gray-100 text-gray-500 ">{'Balance'}: {formatPriceTokenDisplay(BigNumber.parseNumberToOriginal(balance_token?.amount || 0, token?.decimals), true)} {token.symbol}</p>
          </>
          }
        </div>
      </div>
    </>

  );
};

export default memo(InputToken);
