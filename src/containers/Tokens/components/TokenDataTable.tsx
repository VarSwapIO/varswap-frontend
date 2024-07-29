import DataTableBG from '@/components/DataTable'
import ImageBG from '@/components/Image/ImageBG';
import PercentLine from '@/components/TextLine/PercentLine';
import { formatNumberDisplay, formatPriceTokenDisplay } from '@/helpers/format_number_display';
import { SortingState } from '@tanstack/react-table';
import Link from 'next/link';
import React, { useState } from 'react'

const TokenDataTable = ({
  data,
  loading,
  sorting,
  onSort
}: {
  data: { [key: string]: string }[];
  loading: boolean;
  sorting: SortingState;
  onSort: (sort: SortingState) => void;
}) => {

  return (
    <>

      <div className='border dark:border-slate-700 rounded-xl shadow-sm'>
        <DataTableBG
          data={data}
          isFetching={loading}
          sortDefault={sorting}
          showIndexRow={true}
          columns={[
            {
              accessorKey: 'symbol',
              header: `Token Name`,
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
              accessorKey: 'bidPrice',
              header: "Price",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatPriceTokenDisplay(t.getValue())}</p>
            },
            {
              accessorKey: 'priceChangePercent',
              header: "Change 24H",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{<PercentLine value={+t.getValue()} />}</p>,
              sortingFn: (rowA: any, rowB: any) => {
                return +rowA.original.priceChangePercent - rowB.original.priceChangePercent
              },
            },
            {
              accessorKey: 'tvl',
              header: "TVL",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue(), 'thousand')}</p>
            },
            {
              accessorKey: 'quoteVolume',
              header: "Volume",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue(), 'thousand')}</p>
            },
            {
              accessorKey: 'chart',
              header: "",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(t.getValue(), 'thousand')}</p>
            },
          ]}
          onSorting={(state: SortingState) => onSort(state)}
          sticky_first_column={true}
        />
      </div>
    </>
  )
}

export default TokenDataTable