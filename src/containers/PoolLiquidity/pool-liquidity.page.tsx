'use client'
import { MAIN_COLOR } from '@/config/asset'
import { useConnectWallet } from '@/context/useConnectWallet'
import { INFO_POOL_BY_ID, POOL_IDS } from '@/helpers/pools'
import { getBalanceLP } from '@/services/token.services'
import { Button, Loader, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import PoolCard from './components/PoolCard'

const PoolLiquidityContainer = () => {
  const { accountConnected } = useConnectWallet()
  const [yourLiquidity, setYourLiquidity] = useState<YOUR_LIQUIDITY_METADATA[] | undefined>(undefined);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!accountConnected?.address_decoded) {
      getDataLP()
    }
  }, [accountConnected?.address_decoded])

  const getDataLP = async () => {
    if (!accountConnected?.address_decoded) return;
    setLoading(true)
    const lp_balances = []
    const promises = await POOL_IDS.map(async (x: string) => {
      return await getBalanceLP(x, accountConnected?.address_decoded)
    })
    const amount_all = await Promise.all(promises)
    for (let index = 0; index < POOL_IDS.length; index++) {
      const lp_address = POOL_IDS[index];
      const lp_info = INFO_POOL_BY_ID[lp_address];
      const lp_amount = amount_all[index]
      lp_balances.push({
        ...lp_info,
        amount: lp_amount
      })
    }
    setYourLiquidity(lp_balances);
    setLoading(false)
  }

  return (
    <div className='relative py-16 container max-w-screen-md mx-auto px-2 min-h-[90vh]'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold sm:text-2xl dark:text-white text-slate-900'>Your Liquidity</p>
        <div className='flex gap-4 items-center'>
          <Button
            component={Link}
            href={`/liquidity/create`}
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
            href={`/liquidity/add/0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738/NATIVE`}
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
        <>
          {loading ? <div className='w-full h-[300px] flex justify-center items-center'><Loader /> </div> :
            <>
              {!!yourLiquidity && yourLiquidity?.length > 0 ?
                <ScrollArea h={400} type="auto" offsetScrollbars scrollbarSize={4} >
                  <div className='space-y-2 pr-2'>
                    {yourLiquidity?.map((d: YOUR_LIQUIDITY_METADATA, index: number) => {
                      return (
                        <PoolCard key={index} data={d} />
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
            </>}
        </>
      </div>
    </div>
  )
}

export default PoolLiquidityContainer