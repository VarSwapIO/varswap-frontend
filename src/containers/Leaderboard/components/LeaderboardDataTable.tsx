import DataTableBG from '@/components/DataTable'
import ImageBG from '@/components/Image/ImageBG';
import PercentLine from '@/components/TextLine/PercentLine';
import { formatNumberDisplay, formatPriceTokenDisplay } from '@/helpers/format_number_display';
import { shortString } from '@/helpers/utils';
import { SortingState } from '@tanstack/react-table';
import Link from 'next/link';
import React, { useState } from 'react'

const LeaderboardDataTable = ({
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
              accessorKey: 'address',
              header: `Address`,
              enableSorting: true,
              cell: (t: any) =>
                <div className='my-1.5 flex gap-2 items-center w-fit no-underline text-black dark:text-white '>
                  <p className='m-0 font-semibold'>{shortString(t?.row.original.address, 6, 6)}</p>
                </div>
            },
            // {
            //   accessorKey: 'priceChangePercent',
            //   header: "Change 24H",
            //   enableSorting: true,
            //   cell: (t: any) => <p className='m-0'>{<PercentLine value={+t.getValue()} />}</p>,
            //   sortingFn: (rowA: any, rowB: any) => {
            //     return +rowA.original.priceChangePercent - rowB.original.priceChangePercent
            //   },
            // },
            {
              accessorKey: 'total_volume_usd',
              header: "Total Volume",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>${formatNumberDisplay(t.getValue(), 'thousand')}</p>
            },
            {
              accessorKey: 'volume_24h_usd',
              header: "Volume 24h",
              enableSorting: true,
              cell: (t: any) => <p className='m-0'>${formatNumberDisplay(t.getValue(), 'thousand')}</p>
            },
          ]}
          onSorting={(state: SortingState) => onSort(state)}
          sticky_first_column={true}
          emptyText="No trading"
        />
      </div>
    </>
  )
}

export default LeaderboardDataTable