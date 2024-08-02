import { Input, Popover } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import React, { useState } from 'react'
import CoinLine from './CoinLine'

const coins_default: COIN_METADATA[] = [
  {
    name: 'Vara Network',
    symbol: "VARA",
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png',
    address: '0x0',
    verified: true,
    price_usd: 1.54,
    old_24h_price_usd: 1.32,
  },
  {
    name: 'Tether USD ',
    symbol: "USDT",
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    address: '0x0::usdt',
    verified: true,
    price_usd: 1.00,
    old_24h_price_usd: 1.00,
  },
]
const HeaderSearch = () => {
  const [dataSearch, setDataSearch] = useState<COIN_METADATA[]>(coins_default)
  const [openRecommendSearch, setOpenRecommendSearch] = useState(false)
  const [loadingSearchInput, setLoadingSearchInput] = useState(false)
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState<any>({});
  const searchDebounce = useDebouncedValue(search, 500);

  return (
    <div className='flex justify-center items-center'>
      <Popover
        position="bottom"
        opened={openRecommendSearch}
      >
        <Popover.Target>
          <Input
            size={'sm'}
            leftSection={<svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 dark:text-slate-500' viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>}
            variant="filled"
            radius="xl"
            placeholder="🔥 Vara token ..."
            className='md:block hidden'
            classNames={{
              input: `dark:bg-slate-700 bg-white dark:placeholder-slate-500 font-medium focus:border-mainColor`,
              wrapper: `w-3/4`
            }}
            onChange={(e: any) => setSearch(e?.target?.value || "")}
            onFocus={() => setOpenRecommendSearch(true)}
            onBlur={() => setOpenRecommendSearch(false)}
          />
        </Popover.Target>
        <Popover.Dropdown className='rounded-3xl !w-[470px] bg-white dark:bg-slate-800 dark:border-slate-700'>
          <h2 className="text-lg font-semibold dark:text-white text-slate-900">Tokens</h2>
          {dataSearch.length === 0 && <p className="text-center text-gray-400 text-sm"> Not found result</p>}
          {dataSearch?.map((c: COIN_METADATA) => (<CoinLine key={c.address} coin={c} />))}
        </Popover.Dropdown>
      </Popover>

    </div>
  )
}

export default HeaderSearch