import ImageBG from '@/components/Image/ImageBG';
import SkeletonBG from '@/components/SkeletonBG';
import { Button } from '@mantine/core';
import React from 'react'

type SWAP_SKELETON_PROPS = {
  token_input?: COIN_METADATA;
  token_output?: COIN_METADATA;
  is_swap: boolean;
}

const InputTokenPreview = ({ token }: { token?: COIN_METADATA; }) => {
  return (
    <div className="relative">
      <div className="absolute right-4 top-6 w-fit h-fit z-20">
        {token?.name ? (
          <div
            className={'cursor-pointer shadow-md flex justify-center gap-2 items-center font-semibold rounded-full w-fit p-1 py-2 text-center text-sm min-w-[150px] text-black dark:text-white dark:bg-slate-800 bg-white dark:hover:bg-slate-900 hover:bg-slate-200'}>
            <ImageBG
              className="!w-6 !h-6 rounded-full bg-white object-cover"
              src={token.icon}
              alt="token"
              width={24}
              height={24}
            />
            {token.symbol}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        ) : (
          <Button className="font-semibold bg-mainColor hover:bg-mainColor/80 text-sm text-white rounded-3xl w-fit p-3 py-2 text-center min-w-[120px] flex items-center gap-2 justify-center">
            {'Select a token'}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </Button>
        )}
      </div>
      <div className="w-full relative">
        <div className="block w-full p-4 pt-6 bg-transparent text-3xl text-black dark:text-white border border-transparent rounded-lg  sm:text-md dark:placeholder-gray-400">
          <SkeletonBG width={180} height={35} />
        </div>

      </div>
      <div className="px-5 pb-3 h-8 flex justify-end">
        {/* {token?.symbol && <>
            {loadingCoin ? <SkeletonBG width={110} height={20} /> : <p className="text-xs sm:text-sm dark:text-gray-300 text-gray-500 font-medium">{'Balance'}: {formatPriceTokenDisplay(BigNumber.parseNumberToOriginal(balances?.[token?.address]?.amount || 0, balances?.[token?.address]?.decimals))} {token.symbol}</p>}
          </>
          } */}
      </div>
    </div>
  )
}
const SwapSkeleton = ({ is_swap, token_input, token_output }: SWAP_SKELETON_PROPS) => {
  return (
    <>
      <div className={`w-full border border-transparent dark:border-mainColor dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 transition-all duration-300 ${is_swap ? 'translate-y-[116px]' : ''}`}>
        <InputTokenPreview token={is_swap ? token_input : token_output} />
      </div>
      <div className={`w-full border border-transparent dark:border-mainColor dark:hover:border-slate-600 hover:border-slate-200 rounded-3xl bg-slate-100/80 dark:bg-slate-700 mt-1 transition-all duration-300 ${is_swap ? '-translate-y-[116px]' : ''}`}>
        <InputTokenPreview token={is_swap ? token_output : token_input} />
      </div>
    </>
  )
}

export default SwapSkeleton