import ImageBG from '@/components/Image/ImageBG'
import { TOKEN_LIST } from '@/mockData'
import { Tooltip } from '@mantine/core'
import React from 'react'

const SmartRouterResult = ({ paths }: { paths: any[] }) => {
  const path_default = {
    percent: 100,
    token_in: {
      ...TOKEN_LIST[0]
    },
    token_out: {
      ...TOKEN_LIST[1]
    },
    routers: [
      {
        token_in: {
          ...TOKEN_LIST[0]
        },
        token_out: {
          ...TOKEN_LIST[1]
        },
        amount_token_in: 100 * 10 ** 12,
        amount_token_out: 1000 * 10 ** 6,
        protocol_name: 'Varswap'
      }
    ]
  }
  return (
    <div className=''>
      <div className='flex gap-2 items-center'>
        <p className='font-bold text-xs bg-white dark:bg-slate-800 py-4 rounded-xl px-2 shadow-sm'>{path_default.percent}%</p>
        <div className='bg-white dark:bg-slate-800 p-2 flex justify-between items-center gap-2 relative rounded-xl shadow-sm w-full'>
          <div className='z-10 cursor-pointer relative'>
            <Tooltip label={<p className='text-xs font-medium'>{path_default?.token_in?.symbol}</p>}>
              <ImageBG
                className='w-8 h-8 min-w-8 rounded-full bg-white dark:border-slate-700 border-slate-100 border '
                src={path_default?.token_in?.icon}
                alt="token"
                width={32}
                height={32}
              />
            </Tooltip>

          </div>
          <p className='w-full h-[1px] dark:bg-slate-600 bg-slate-200'></p>
          {path_default?.routers?.map((ps: any, index_ps: number) => (
            <div className='z-10 cursor-pointer' key={index_ps}>
              <Tooltip label={<p className='text-xs font-medium'>{ps?.protocol_name}</p>}>
                <div className='flex items-center'>
                  <ImageBG
                    className='w-8 h-8 min-w-8 rounded-full bg-white dark:border-slate-500 border-slate-100 border '
                    src={ps?.token_in?.icon}
                    alt="token"
                    width={32}
                    height={32}
                  />
                  <ImageBG
                    className='w-8 h-8 min-w-8 rounded-full bg-white dark:border-slate-500 border-slate-100 border  -ml-2'
                    src={ps?.token_out?.icon}
                    alt="token"
                    width={32}
                    height={32}
                  />
                </div>
              </Tooltip>
            </div>
          ))}
          <p className='w-full h-[1px] dark:bg-slate-600 bg-slate-200'></p>
          <div className='z-10 cursor-pointer'>
            <Tooltip label={<p className='text-xs font-medium'>{path_default?.token_out?.symbol}</p>}>
              <ImageBG
                className='w-8 h-8 min-w-8 rounded-full bg-white dark:border-slate-700 border-slate-100 border '
                src={path_default?.token_out?.icon}
                alt="token"
                width={32}
                height={32}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartRouterResult