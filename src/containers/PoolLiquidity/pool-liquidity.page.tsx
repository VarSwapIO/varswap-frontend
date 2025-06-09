'use client'
import { MAIN_COLOR } from '@/config/asset'
import { useConnectWallet } from '@/context/useConnectWallet'
import { INFO_POOL_BY_ID, POOL_IDS } from '@/helpers/pools'
import { getBalanceLP, getLPMetadata, getPoolLiquidityByUser, getTokenMetadata } from '@/services/token.services'
import { Button, Loader, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import PoolCard from './components/PoolCard'
import { LIST_OF_TOKENS_BY_ADDRESS } from '@/config/tokens'

export type LPJoin = {
  token_a: string
  token_b: string
  pair: string
}

export type LPJoinWithBalance = LPJoin & {
  amount: string,
  name: string,
  symbol: string,
  decimals: number,
  icon: string,
  address: string
}

const PoolLiquidityContainer = () => {
  const { accountConnected } = useConnectWallet()
  const [yourLiquidity, setYourLiquidity] = useState<YOUR_LIQUIDITY_METADATA[] | undefined>(undefined);
  console.log('yourLiquidity', yourLiquidity)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!!accountConnected?.address_decoded) {
      getDataLP()
    }
  }, [accountConnected?.address_decoded])


  const getTokenMeta = async (address: string): Promise<COIN_METADATA> => {
    const token = LIST_OF_TOKENS_BY_ADDRESS[address];
    if (token) {
      return {
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        icon: token.icon,
        decimals: token.decimals,
      };
    }
    const tokenMetadata = await getTokenMetadata(address);
    return {
      name: tokenMetadata?.name || '',
      symbol: tokenMetadata?.symbol || '',
      address: tokenMetadata?.address || '',
      icon: tokenMetadata?.icon || '',
      decimals: tokenMetadata?.decimals || 12,
    };
  };

  const getDataLP = async () => {
    if (!accountConnected?.address_decoded) return;
    setLoading(true);

    try {
      const poolLiquidity = await getPoolLiquidityByUser(accountConnected.address_decoded);


      const lpInfoList: LPJoinWithBalance[] = await Promise.all(
        poolLiquidity.map(async (pool: LPJoin) => {
          const [lpInfo, lpBalance] = await Promise.all([
            getLPMetadata(pool.pair),
            getBalanceLP(pool.pair, accountConnected.address_decoded),
          ]);
          return {
            name: lpInfo?.name || '',
            symbol: lpInfo?.symbol || '',
            decimals: lpInfo?.decimals || 12,
            icon: lpInfo?.icon || '',
            address: lpInfo?.address || '',
            amount: lpBalance,
            token_a: pool.token_a,
            token_b: pool.token_b,
            pair: pool.pair,
          };
        })
      );


      const lpBalances = await Promise.all(
        lpInfoList.map(async (lp) => {
          const [coinX, coinY] = await Promise.all([
            getTokenMeta(lp.token_a),
            getTokenMeta(lp.token_b),
          ]);
          return {
            name: lp.name,
            symbol: lp.symbol,
            decimals: lp.decimals,
            icon: lp.icon,
            amount: lp.amount,
            coin_x: coinX,
            coin_y: coinY,
            pool_id: lp.pair,
          };
        })
      );

      setYourLiquidity(lpBalances);
    } catch (error) {

      setYourLiquidity([]);
    } finally {
      setLoading(false);
    }
  };

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