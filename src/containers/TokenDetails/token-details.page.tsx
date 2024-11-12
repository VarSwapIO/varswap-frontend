'use client'
import SkeletonBG from '@/components/SkeletonBG';
import { MAIN_COLOR } from '@/config/asset';
import { formatNumberDisplay, formatPriceTokenDisplay } from '@/helpers/format_number_display';
import { TOKEN_LIST } from '@/mockData';
import { Button, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import ChartTokenDetail from './components/ChartTokenDetails';

const TokenDetails = () => {
  const params = useParams();
  const address = decodeURIComponent(params?.token_address?.toString() || '');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(TOKEN_LIST[0])
  return (
    <div className={`relative container max-w-7xl mx-auto px-2 py-10 min-h-[90vh]`}>
      <div className='flex gap-2 items-center'>
        <div onClick={() => router.back()} className='bg-white shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-full cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className='text-slate-900 dark:text-white font-medium'>Tokens</p>
      </div>

      {/* detail token */}
      <div className='mt-4 px-2'>
        <div
          className={`flex gap-2 items-center`}>
          {loading ? <>
            <SkeletonBG width={40} height={40} />
            <SkeletonBG width={70} height={20} />
            <SkeletonBG width={70} height={20} />
          </> :
            <>
              <img className='w-10 h-10 rounded-full bg-white object-cover' src={tokenData.icon} alt="token" />
              <p className='text-2xl font-semibold dark:text-white text-slate-900'>{tokenData?.name}</p>
              <p className='text-slate-600 text-lg mt-1 dark:text-slate-400 font-semibold'>{tokenData?.symbol}</p>
            </>
          }
          {tokenData?.verified && <Tooltip
            position="top"
            label='Verified'
          >
            <svg viewBox="0 0 17 17" fill="none" className='w-6 h-6'>
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
        </div>
        <div className='relative gap-2'>
          <ChartTokenDetail data={[]} loading={loading} />
          <div className='absolute right-0 top-0 w-1/5 pl-10 hidden md:block'>
            <Button
              component='a'
              href={`/swap/${address}` || '#'}
              target="_blank"
              rel="noopener noreferrer"
              variant={'light'}
              className="w-full text-center rounded-full"
              color={MAIN_COLOR}
            >
              Trade Now
            </Button>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className='mt-10'>
        <div className='flex justify-between items-center'>
          <p className='text-3xl font-semibold dark:text-white text-slate-900'>Stats</p>
          <Link href={tokenData?.address?.includes("::sui::SUI") ? '/swap/0xd9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE/0x2::sui::SUI' : `/swap/0x2::sui::SUI/${tokenData?.address}`} className="text-base text-blue-500 hover:text-blue-400 md:hidden block">
            Swap now
          </Link>
        </div>
        <div className='w-full md:w-3/5 grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6'>
          <div className='rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-sm space-y-2'>
            <p className='font-medium dark:text-slate-400 text-slate-600'>TVL</p>
            {loading ? <SkeletonBG width={70} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>${formatNumberDisplay(100000)}</p>}
          </div>
          <div className='rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-sm space-y-2'>
            <p className='font-medium dark:text-slate-400 text-slate-600'>Volume 24h</p>
            {loading ? <SkeletonBG width={70} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>${formatNumberDisplay(5000)}</p>}
          </div>
          <div className='rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-sm space-y-2'>
            <p className='font-medium dark:text-slate-400 text-slate-600'>Price</p>
            {loading ? <SkeletonBG width={70} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>{formatPriceTokenDisplay(1.54)}</p>}
          </div>
          <div className='rounded-xl border dark:border-slate-800 border-slate-100 dark:bg-slate-900 bg-white text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-sm space-y-2'>
            <p className='font-medium dark:text-slate-400 text-slate-600'>Total Volume</p>
            {loading ? <SkeletonBG width={70} height={20} /> : <p className='font-semibold dark:text-white text-slate-900'>${formatNumberDisplay(135000000)}</p>}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className='mt-6'>
        <div className='flex justify-between items-center'>
          <p className='text-3xl font-semibold dark:text-white text-slate-900'>Token Address</p>
        </div>
        <div className='flex items-center gap-2'>
          <p style={{ wordBreak: 'break-word' }} className="font-medium dark:text-slate-400 text-slate-600">{'NATIVE'}</p>
        </div>
      </div>
    </div>
  )
}

export default TokenDetails