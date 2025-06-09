import ImageBG from '@/components/Image/ImageBG'
import { CONTRACT_DATA, LPR_IDL, NETWORK } from '@/containers/router_sdk/constants'
import SailsCalls from '@/containers/router_sdk/SailsCalls'
import { BigNumber } from '@/helpers/big_number_cal'
import { formatAmountWithFixed, formatNumberDisplay } from '@/helpers/format_number_display'
import { convertToAddressNative, token_in_pool } from '@/helpers/pools'
import { Button, Collapse, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const PoolCard = ({ data: data_pool }: { data: YOUR_LIQUIDITY_METADATA }) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [poolCurrent, setPoolCurrent] = useState<POOL_LIQUIDITY_XY | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!data_pool?.pool_id) {
      getDataPoolCurrent()
    }
  }, [data_pool?.pool_id])


  const getDataPoolCurrent = async () => {
    if (!data_pool?.coin_x || !data_pool?.coin_y) return;
    try {
      setLoading(true)
      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
      });

      const pool_info = await sails?.query(
        `RouterService/GetReserves`,
        {
          callArguments: [
            data_pool?.coin_x.address,
            data_pool?.coin_y.address
          ]
        }
      )
      console.log('pool_info', data_pool, pool_info)
      if (pool_info?.ok?.length > 0) {
        const value_reserve_x = BigInt(pool_info?.ok?.[0]?.toString())?.toString() || '0';
        const value_reserve_y = BigInt(pool_info?.ok?.[1]?.toString())?.toString() || '0';

        setPoolCurrent({
          reserve_x: value_reserve_x,
          reserve_y: value_reserve_y,
          total_supply: Math.round(Math.sqrt(+value_reserve_x * +value_reserve_y))?.toString(),
        })
      }

    } catch (error) {
      setPoolCurrent(undefined)
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='w-full h-fit rounded-xl dark:bg-slate-800 bg-slate-100 overflow-hidden'>
      <div className='group flex justify-between items-center text-slate-500 p-2 px-4 cursor-pointer dark:text-slate-200 ' onClick={() => toggle()}>
        <div className='flex justify-start items-center text-sm gap-4'>
          <div className='flex'>
            <ImageBG
              className='w-6 h-6 rounded-full object-cover bg-white'
              src={data_pool?.coin_x?.icon || ""}
              alt="token1-pool"
              width={24}
              height={24}
            />
            <ImageBG
              className='-ml-2 w-6 h-6 rounded-full object-cover bg-white'
              src={data_pool?.coin_y?.icon || ''}
              alt="token2-pool"
              width={24}
              height={24}
            />
          </div>
          <div className='font-semibold'>
            <p >{data_pool?.coin_x?.symbol} - {data_pool?.coin_y?.symbol}</p>
            {formatAmountWithFixed(BigNumber.parseNumberToOriginal(data_pool.amount, data_pool.decimals))}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 group-hover:text-mainColor transition-all duration-200 ${opened ? 'rotate-180 text-mainColor' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {/* details rewards form */}
      <Collapse in={opened}>
        {loading ? <div className='w-full flex justify-center items-center'><Loader /></div> : <div className={`dark:text-slate-100 grid grid-cols-3 gap-4 px-6 mt-4`}>
          <div className='font-semibold p-2 px-4 bg-white dark:bg-slate-900 rounded-md space-y-1 text-center'>
            <p className=''>Pooled {data_pool?.coin_x?.symbol}</p>
            <div className='flex items-center justify-center gap-2'>
              <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(token_in_pool(+data_pool?.amount, +(poolCurrent?.reserve_x || 0), +(poolCurrent?.total_supply || 0)), data_pool?.coin_x?.decimals))}</p>
              <ImageBG
                className='border dark:border-slate-700 border-slate-200 w-5 h-5 rounded-full object-cover bg-white'
                src={data_pool?.coin_x?.icon || ''}
                alt="token1-pool"
                width={22}
                height={22}
              />
            </div>
          </div>
          <div className='font-semibold p-2 px-4 bg-white dark:bg-slate-900 rounded-md space-y-1 text-center'>
            <p className=''>Pooled {data_pool?.coin_y?.symbol}</p>
            <div className='flex items-center justify-center gap-2'>
              <p>{formatAmountWithFixed(BigNumber.parseNumberToOriginal(token_in_pool(+data_pool?.amount, +(poolCurrent?.reserve_y || 0), +(poolCurrent?.total_supply || 0)), data_pool?.coin_y?.decimals))}</p>
              <ImageBG
                className='border dark:border-slate-700 border-slate-200 w-5 h-5 rounded-full object-cover bg-white'
                src={data_pool?.coin_y?.icon || ''}
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
        </div>}
        <div className='my-6 flex justify-center gap-4'>
          <Button
            className='rounded-full bg-mainColor hover:bg-mainColor/80'
            href={`/liquidity/add/${convertToAddressNative(data_pool?.coin_x?.address || "")}/${convertToAddressNative(data_pool?.coin_y?.address || "")}`}
            component={Link}
          >
            Add liquidity instead
          </Button>
          <Button
            className='rounded-full'
            color={'red'}
            href={`/liquidity/remove/${data_pool?.coin_x?.address || ""}/${data_pool?.coin_y?.address || ""}`}
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