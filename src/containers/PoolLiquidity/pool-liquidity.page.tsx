'use client'
import { MAIN_COLOR } from '@/config/asset'
import { Button, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState } from 'react'
import PoolCard from './components/PoolCard'

const PoolLiquidityContainer = () => {
  const [yourLiquidity, setYourLiquidity] = useState([1])
  return (
    <div className='relative py-16 container max-w-screen-md mx-auto px-2 min-h-[90vh]'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold sm:text-2xl dark:text-white text-slate-900'>Your Liquidity</p>
        <div className='flex gap-4 items-center'>
          <Button
            component={Link}
            href={`/pool/create`}
            variant={'light'}
            radius={'xl'}
             color={MAIN_COLOR}
            leftSection={<IconPlus size={18} />}
            className="shadow-sm"
          >
            Create a pool
          </Button>
          <Button
            component={Link}
            href={`/pool/add`}
            variant={'light'}
            radius={'xl'}
             color={MAIN_COLOR}
            className="shadow-sm"
          >
            Add Liquidity
          </Button>
        </div>
      </div>
      <div className='mt-6 border dark:border-slate-700 dark:bg-slate-900/50 bg-white shadow-sm rounded-2xl min-h-[400px] p-4'>
        {yourLiquidity?.length > 0 ?
          <ScrollArea h={400} type="auto" offsetScrollbars scrollbarSize={4} >
            <div className='space-y-2 pr-2'>
              {yourLiquidity?.map((d: any , index: number) => {
                return (
                  <PoolCard key={index} />
                )
              }
              )}
            </div>
          </ScrollArea>
          :
          <div className="dark:text-slate-500 text-slate-400 flex flex-col justify-center items-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <p className="text-sm font-medium">Your active liquidity positions will appear here.</p>
          </div>
        }
      </div>
    </div>
  )
}

export default PoolLiquidityContainer