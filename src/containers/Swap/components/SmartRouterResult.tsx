import ImageBG from '@/components/Image/ImageBG'
import { TOKEN_LIST } from '@/mockData'
import { useAssetStore } from '@/stores/assetStore'
import { Tooltip } from '@mantine/core'
import React, { useEffect, useState } from 'react'

const SmartRouterResult = ({ paths }: { paths: any[] }) => {
  const { cointype_by_chain } = useAssetStore();
  const [pathRouters, setPathRouters] = useState<any>({});


  useEffect(() => {
    getPaths()
  }, [paths])

  const getPaths = () => {
    const paths_format = (paths)?.map((router: any) => {
      const find_token = cointype_by_chain.VARA?.[router.address]
      return find_token
    }) || []
    const paths_length = paths_format?.length;
    let routers: any[] = []

    if (paths_length === 2) {
      routers = [
        {
          token_in: {
            ...paths_format[0]
          },
          token_out: {
            ...paths_format[1]
          },
          protocol_name: 'VarSwap'
        }
      ]
    } else {
      for (let index = 0; index < paths_length - 1; index++) {
        const token_a = paths_format[index];
        const token_b = paths_format[index + 1];
        routers.push(
          {
            token_in: token_a,
            token_out: token_b,
            protocol_name: 'VarSwap'
          }
        )
      }
    }

    const path_default = {
      percent: 100,
      token_in: {
        ...paths_format[0]
      },
      token_out: {
        ...paths_format[paths_length - 1]
      },
      routers: routers
    }
    setPathRouters(path_default)
  }

  return (
    <div className=''>
      <div className='flex gap-2 items-center'>
        <p className='font-bold text-xs bg-white dark:bg-slate-800 py-4 rounded-xl px-2 shadow-sm'>{pathRouters.percent}%</p>
        <div className='bg-white dark:bg-slate-800 p-2 flex justify-between items-center gap-2 relative rounded-xl shadow-sm w-full'>
          <div className='z-10 cursor-pointer relative'>
            <Tooltip label={<p className='text-xs font-medium'>{pathRouters?.token_in?.symbol}</p>}>
              <ImageBG
                className='w-6 h-6 min-w-6 rounded-full bg-white dark:border-slate-700 border-slate-100 border '
                src={pathRouters?.token_in?.icon}
                alt="token"
                width={32}
                height={32}
              />
            </Tooltip>

          </div>
          <p className='w-full h-[1px] dark:bg-slate-600 bg-slate-200'></p>
          {pathRouters?.routers?.map((ps: any, index_ps: number) => (
            <div className='z-10 cursor-pointer flex gap-1 items-center' key={index_ps}>
              <Tooltip label={<p className='text-xs font-medium'>{ps?.protocol_name}</p>}>
                <div className='flex items-center'>
                  <ImageBG
                    className='w-6 h-6 min-w-6 rounded-full bg-white dark:border-slate-500 border-slate-100 border '
                    src={ps?.token_in?.icon}
                    alt="token"
                    width={24}
                    height={24}
                  />
                  <ImageBG
                    className='w-6 h-6 min-w-6 rounded-full bg-white dark:border-slate-500 border-slate-100 border  -ml-2'
                    src={ps?.token_out?.icon}
                    alt="token"
                    width={24}
                    height={24}
                  />
                </div>
              </Tooltip>
              {index_ps < (pathRouters?.routers?.length - 1) && <p className='w-[12px] h-[0px] border-t-[1px] border-dotted border-mainColor'></p>}
            </div>
          ))}
          <p className='w-full h-[1px] dark:bg-slate-600 bg-slate-200'></p>
          <div className='z-10 cursor-pointer'>
            <Tooltip label={<p className='text-xs font-medium'>{pathRouters?.token_out?.symbol}</p>}>
              <ImageBG
                className='w-6 h-6 min-w-6 rounded-full bg-white dark:border-slate-700 border-slate-100 border '
                src={pathRouters?.token_out?.icon}
                alt="token"
                width={24}
                height={24}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartRouterResult