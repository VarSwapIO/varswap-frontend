'use client'
import { MAIN_COLOR } from '@/config/asset'
import { Box, Center, Loader, rem, SegmentedControl } from '@mantine/core'
import { IconCode, IconExternalLink, IconEye } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import FarmCard from './components/FarmCard'

const FARM_DATA: FARM_POOL_METADATA[] = [
  {
    token_x: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 12,
      address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
    },
    token_y: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
      symbol: 'TVARA',
      name: 'Vara Network Testnet',
      decimals: 12,
      address: 'NATIVE'
    },
    token_reward: {
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      symbol: 'USDT',
      name: 'USDT',
      decimals: 12,
      address: '0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738'
    },
    lp_stake_address: '0x3e58bb732341063cc7869636f84d6fac4524524f1c82dd6da0cb7a1711fd5aa4',
    farm_contract_address: '0x9f32ddcbf4bdf6cfc135d31ca906f93323e93a5c4d88b46939d7ff145ffff0c1',
    end_timestamp: '1735465248'
  }
]

const FarmsContainer = () => {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('live');
  const [dataLive, setDataLive] = useState<FARM_POOL_METADATA[]>([]);
  const [dataFinished, setDataFinished] = useState<FARM_POOL_METADATA[]>([])

  useEffect(() => {
    let timeout = setTimeout(() => {
      setLoading(false);
      let live_data = [];
      let finished_data = [];
      for (let index = 0; index < FARM_DATA.length; index++) {
        const element = FARM_DATA[index];
        if (element?.end_timestamp && +element?.end_timestamp <= new Date().getTime() / 1000) {
          finished_data.push(element)
        } else {
          live_data.push(element)
        }
      }

      setDataLive(live_data);
      setDataFinished(finished_data);
    }, 1000);

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className='min-h-[90vh]'>
      <p className='text-mainColor font-bold text-center text-7xl mt-10'>Farms</p>
      <p className='dark:text-slate-400 text-slate-600 font-semibold text-center text-2xl mt-2'>Stake LP tokens to earn</p>
      <div className='flex justify-center mt-4'>
        <SegmentedControl
          value={tab}
          onChange={setTab}
          data={[
            {
              value: 'live',
              label: (
                <Center style={{ gap: 10 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"></path></svg>
                  <span>Live</span>
                </Center>
              ),
            },
            {
              value: 'finished',
              label: (
                <Center style={{ gap: 10 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 19.5H6.75a.25.25 0 0 1-.25-.25v-.6A3.24 3.24 0 0 1 7.92 16L10 14.52A3.22 3.22 0 0 0 11.44 12h1.12A3.22 3.22 0 0 0 14 14.52L16.08 16a3.24 3.24 0 0 1 1.42 2.65v.6a.25.25 0 0 1-.25.25M6.75 2A2.75 2.75 0 0 0 4 4.75v.42a5.75 5.75 0 0 0 2.792 4.93l1.81 1.086a.75.75 0 0 1 .036 1.263l-2.121 1.443A5.75 5.75 0 0 0 4 18.647v.603A2.75 2.75 0 0 0 6.75 22h10.5A2.75 2.75 0 0 0 20 19.25v-.604a5.75 5.75 0 0 0-2.517-4.754l-2.121-1.443a.75.75 0 0 1 .036-1.263l1.81-1.086A5.75 5.75 0 0 0 20 5.17v-.42A2.75 2.75 0 0 0 17.25 2zM5.5 4.75c0-.69.56-1.25 1.25-1.25h10.5c.69 0 1.25.56 1.25 1.25v.42a4.25 4.25 0 0 1-2.063 3.643L14.627 9.9c-1.41.845-1.467 2.866-.108 3.79l2.12 1.442a4.25 4.25 0 0 1 1.861 3.515v.603c0 .69-.56 1.25-1.25 1.25H6.75c-.69 0-1.25-.56-1.25-1.25v-.604a4.25 4.25 0 0 1 1.86-3.514l2.121-1.442c1.359-.924 1.302-2.945-.107-3.79l-1.81-1.087A4.25 4.25 0 0 1 5.5 5.17z"></path></svg>
                  <span>Finished</span>
                </Center>
              ),
            },
          ]}
          color={MAIN_COLOR}
          radius={'xl'}
          classNames={{
            root: 'dark:bg-slate-700/60 bg-white shadow-sm rounded-full p-1 ',
            label: 'font-semibold w-[200px] dark:text-slate-100 text-sm',
          }}
        />
      </div>
      {loading ? <div className='flex justify-center items-center h-[400px]'>
        <Loader />
      </div> :
        <>
          <Box hidden={tab !== 'live'}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container mx-auto mt-10'>
              {dataLive?.map((v: FARM_POOL_METADATA) => (
                <FarmCard key={`${v?.token_x?.address}-${v?.token_y?.address}`} data={v} />
              ))}
            </div>
          </Box>
          <Box hidden={tab !== 'finished'}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 container mx-auto mt-10'>
              {dataFinished?.map((v: FARM_POOL_METADATA) => (
                <FarmCard key={`${v?.token_x?.address}-${v?.token_y?.address}`} data={v} />
              ))}
            </div>
          </Box>
        </>
      }
    </div>
  )
}

export default FarmsContainer