import ImageBG from '@/components/Image/ImageBG'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { YOUR_LIQUIDITY_MOCKDATA } from '@/mockData'
import { Button, Collapse } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import React from 'react'

const PoolCard = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const data_pool = YOUR_LIQUIDITY_MOCKDATA
  return (
    <div className='w-full h-fit rounded-xl dark:bg-slate-800 bg-slate-100 overflow-hidden'>
      <div className='group flex justify-between items-center text-slate-500 p-2 px-4 cursor-pointer dark:text-slate-200 ' onClick={() => toggle()}>
        <div className='flex justify-start items-center text-sm gap-4'>
          <div className='flex'>
            <ImageBG
              className='w-6 h-6 rounded-full object-cover bg-white'
              src={data_pool?.coin_x.icon}
              alt="token1-pool"
              width={24}
              height={24}
            />
            <ImageBG
              className='-ml-2 w-6 h-6 rounded-full object-cover bg-white'
              src={data_pool?.coin_y?.icon}
              alt="token2-pool"
              width={24}
              height={24}
            />
          </div>
          <div className='font-semibold'>
            <p >{data_pool?.coin_x?.symbol} - {data_pool?.coin_y?.symbol}</p>
            {formatNumberDisplay(data_pool.lp_amount)}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 group-hover:text-mainColor transition-all duration-200 ${opened ? 'rotate-180 text-mainColor' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {/* details rewards form */}
      <Collapse in={opened}>
        <div className={`dark:text-slate-100 grid grid-cols-3 gap-4 px-6 mt-4`}>
          <div className='font-semibold p-2 px-4 bg-white dark:bg-slate-900 rounded-md space-y-1 text-center'>
            <p className=''>Pooled {data_pool?.coin_x?.symbol}</p>
            <div className='flex items-center justify-center gap-2'>
              <p>{formatNumberDisplay(data_pool?.coin_x_amount)}</p>
              <ImageBG
                className='border dark:border-slate-700 border-slate-200 w-5 h-5 rounded-full object-cover bg-white'
                src={data_pool?.coin_x.icon}
                alt="token1-pool"
                width={22}
                height={22}
              />
            </div>
          </div>
          <div className='font-semibold p-2 px-4 bg-white dark:bg-slate-900 rounded-md space-y-1 text-center'>
            <p className=''>Pooled {data_pool?.coin_y?.symbol}</p>
            <div className='flex items-center justify-center gap-2'>
              <p>{formatNumberDisplay(data_pool?.coin_y_amount)}</p>
              <ImageBG
                className='border dark:border-slate-700 border-slate-200 w-5 h-5 rounded-full object-cover bg-white'
                src={data_pool?.coin_y.icon}
                alt="token1-pool"
                width={22}
                height={22}
              />
            </div>
          </div>
          <div className='font-semibold p-2 px-4 bg-white dark:bg-slate-900 rounded-md space-y-1 text-center'>
            <p>Share Of Pool</p>
            <div className='flex items-center justify-center gap-2'>
              100 %
            </div>
          </div>
        </div>
        <div className='my-6 flex justify-center gap-4'>
          <Button
            className='rounded-full bg-mainColor hover:bg-mainColor/80'
            href={'/pool/add'}
            component={Link}
          >
            Add liquidity instead
          </Button>
          <Button
            className='rounded-full'
            color={'red'}
            href={'/pool/create'}
            component={Link}
          >
            Remove
          </Button>
        </div>
      </Collapse>

    </div>
  )
}

export default PoolCard