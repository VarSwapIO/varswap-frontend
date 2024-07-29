'use client'
import { SortingState } from '@tanstack/react-table';
import React, { useState } from 'react'
import TokenDataTable from './components/TokenDataTable'
import { CloseButton, Input } from '@mantine/core';
import FilterDropdown from '@/components/Dropdown/FilterDropdown';
import PaginationBG from '@/components/Pagination/PaginationBG';

const TokenContainer = () => {
  const [dataTokenPriceFilter, setDataTokenPriceFilter] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchCoin, setSearchCoin] = useState('')
  const [filter, setFilter] = useState('30d')

  return (
    <div className='min-h-[90vh]'>
      <p className='text-mainColor font-bold text-center text-5xl mt-10'>Top Tokens on VarSwap</p>
      <div className='container mx-auto mt-10'>
        <div className='mb-4 flex justify-end items-center gap-4'>
          <Input
            size={'sm'}
            leftSection={<svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 dark:text-slate-500' viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>}
            variant="filled"
            placeholder="Search token ..."
            classNames={{
              input: `dark:bg-slate-800 bg-white shadow-sm dark:placeholder-slate-500 h-[40px] rounded-xl focus:border-mainColor/80`,
              wrapper: ``
            }}
            value={searchCoin}
            onChange={(e: any) => setSearchCoin(e?.target?.value)}
            rightSectionPointerEvents={'all'}
            rightSection={
              <CloseButton
                aria-label="Clear input"
                onClick={() => setSearchCoin('')}
                style={{ display: searchCoin ? undefined : 'none' }}
                size="sm"
                className="dark:hover:bg-slate-800 "
              />
            }
          />
          <FilterDropdown
            options={[
              {
                title: '30D',
                key: '30d'
              },
              {
                title: '7D',
                key: '7d'
              },
              {
                title: '1D',
                key: '1d'
              }
            ]}
            selected={filter}
            onSelected={(value: string) => setFilter(value)}
          />
        </div>
        <TokenDataTable
          data={dataTokenPriceFilter}
          sorting={sorting}
          onSort={(sort: SortingState) => setSorting(sort)}
          loading={loading}
        />

        {(!loading && dataTokenPriceFilter?.length > 0) && <div className='flex justify-center mt-auto'>
          <PaginationBG
            total={totalPage}
            value={currentPage}
            radius="md"
            className='my-3'
            onChange={(page: number) => setCurrentPage(page)}
          />
        </div>}
      </div>
    </div>
  )
}

export default TokenContainer