import DataTableBG from '@/components/DataTable'
import FilterDropdown from '@/components/Dropdown/FilterDropdown';
import ImageBG from '@/components/Image/ImageBG';
import PaginationBG from '@/components/Pagination/PaginationBG';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { formatTime } from '@/helpers/utils';
import { SortingState } from '@tanstack/react-table';
import Link from 'next/link';
import React, { useState } from 'react'

const OverviewTransaction = () => {
  const [dataTokenPriceFilter, setDataTokenPriceFilter] = useState([]);
  const [totalPage, setTotalPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [type, setType] = useState('swap')

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-2 mt-10 dark:text-white text-slate-900 font-semibold'>
        <p>Transaction</p>
        <FilterDropdown
          options={[
            {
              title: 'Swap',
              key: 'swap'
            },
            {
              title: 'Add liquidity',
              key: 'add_liquidity'
            },
            {
              title: 'Remove liquidity',
              key: 'remove_liquidity'
            }
          ]}
          selected={type}
          onSelected={(value: string) => setType(value)}
        />
      </div>

      <div className='border dark:border-slate-700 rounded-xl shadow-sm'>
        <DataTableBG
          data={dataTokenPriceFilter}
          isFetching={loading}
          sortDefault={sorting}
          columns={[
            {
              accessorKey: 'ty',
              header: `Type`,
              enableSorting: true,
              cell: (t: any) =>
                <Link href={`/trade/spot/${t?.row.original.symbol}`} className='my-1.5 flex gap-2 items-center w-fit no-underline text-black dark:text-white '>
                  <ImageBG
                    src={t?.row.original.logo}
                    alt={t?.row.original.symbol}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border border-solid border-slate-200 dark:border-slate-700 shadow-sm"
                    loading='lazy'
                  />
                  <p className='m-0 font-semibold'>{t?.row.original.symbol?.replace("USDT", "")}</p>
                </Link>
            },
            {
              accessorKey: 'address',
              header: "Address",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{t.getValue()}</p>
            },
            {
              accessorKey: 'total_value',
              header: "Total Value",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue())}</p>
            },
            {
              accessorKey: 'token_amount_a',
              header: "Total Amount",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue())}</p>
            },
            {
              accessorKey: 'token_amount_b',
              header: "Total Amount",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue())}</p>
            },
            {
              accessorKey: 'time',
              header: "Time",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatTime(t.getValue(), 'ago')}</p>
            },
          ]}
          onSorting={(state: SortingState) => setSorting(state)}
          sticky_first_column={true}
          emptyText="No transactions"
        />
      </div>

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
  )
}

export default OverviewTransaction