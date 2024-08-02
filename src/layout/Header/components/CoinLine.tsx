import ImageBG from '@/components/Image/ImageBG';
import { MAIN_COLOR } from '@/config/asset';
import { formatPriceTokenDisplay } from '@/helpers/format_number_display';
import { percentBetweenTwoValue } from '@/helpers/utils';
import { Tooltip } from '@mantine/core'
import Link from 'next/link'
import React from 'react'


const CoinLine = ({ coin }: { coin: COIN_METADATA }) => {
  const change_price = percentBetweenTwoValue(+coin?.old_24h_price_usd, +coin?.price_usd);
  return (
    <div className='flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl'>
      <p className='flex gap-2 items-center '>
        <ImageBG
          src={coin.icon}
          className="w-10 h-10 rounded-full bg-white"
          alt="coin-img"
          height={40}
          width={40}
        />
        <Link href={`/token/${coin.address}`}
          className="flex flex-col items-start">
          <div className='flex items-center gap-2'>
            <p className='max-w-[150px] md:max-w-none line-clamp-1 font-semibold dark:text-white text-slate-900'>{coin?.name}</p>
            {coin?.verified && <Tooltip
              position="top"
              label='Verified'
            >
              <svg viewBox="0 0 17 17" fill="none" className='w-5 h-5'>
                <path
                  d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                  fill={MAIN_COLOR}
                  stroke={MAIN_COLOR}
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
          <p className='dark:text-slate-300 text-slate-600 font-medium text-sm'>{coin?.symbol}</p>
        </Link>
      </p>
      <div className='text-right'>
        <p className='dark:text-white text-slate-900 font-semibold text-sm'>{formatPriceTokenDisplay(coin?.price_usd)}</p>
        <div className='text-sm font-medium'>
          {change_price.value_number ? <p className={`text-green-400 flex items-center justify-end gap-1 ${change_price?.increase ? 'text-green-500' : 'text-red-500'}`}>
            {change_price?.increase ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
              </svg>}
            {change_price?.value}
          </p> : <p>_</p>}
        </div>
      </div>
    </div>
  )
}

export default CoinLine