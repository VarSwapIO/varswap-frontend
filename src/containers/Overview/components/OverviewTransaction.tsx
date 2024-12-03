import DataTableBG from '@/components/DataTable'
import FilterDropdown from '@/components/Dropdown/FilterDropdown';
import ImageBG from '@/components/Image/ImageBG';
import PaginationBG from '@/components/Pagination/PaginationBG';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { formatTime, shortString } from '@/helpers/utils';
import { get_swap_history } from '@/services/overview.services';
import { useAssetStore } from '@/stores/assetStore';
import { SortingState } from '@tanstack/react-table';
import Link from 'next/link';
import QueryString from 'qs';
import React, { useEffect, useState } from 'react'

const OverviewTransaction = () => {
  const { cointype_by_chain } = useAssetStore()
  const [dataTokenPriceFilter, setDataTokenPriceFilter] = useState([]);
  const [totalPage, setTotalPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [type, setType] = useState('Swap')

  useEffect(() => {
    if (!!cointype_by_chain?.VARA) {
      getSwapHistory()
    }
  }, [currentPage, cointype_by_chain?.VARA, type, sorting])

  const formatDataHistory = (history: any) => {
    const event_swap = history?.type?.includes("Swap") ? "Swap" : (history?.type?.includes("Remove") ? "RemoveLiquidity" : 'AddLiquidity');
    switch (event_swap) {
      case 'AddLiquidity':
        const add_lp_token_in = history?.events?.token_a || 'NATIVE';
        const add_lp_token_out = history?.events?.token_b || "NATIVE"
        const add_lp_token_in_metadata = cointype_by_chain?.VARA?.[add_lp_token_in];
        const add_lp_token_out_metadata = cointype_by_chain?.VARA?.[add_lp_token_out];
        return {
          ...history,
          inputToken: {
            ...add_lp_token_in_metadata,
            amount: BigInt(history?.events?.amount_a || history?.events?.amount_vara)?.toString()
          },
          outputToken: {
            ...add_lp_token_out_metadata,
            amount: BigInt(history?.events?.amount_b || history?.events?.amount_vara)?.toString()
          },
          action_type: 'AddLiquidity'
        }
      case 'RemoveLiquidity':
        const remove_lp_token_in = history?.events?.token_a || 'NATIVE';
        const remove_lp_token_out = history?.events?.token_b || "NATIVE"
        const remove_lp_token_in_metadata = cointype_by_chain?.VARA?.[remove_lp_token_in];
        const remove_lp_token_out_metadata = cointype_by_chain?.VARA?.[remove_lp_token_out];
        return {
          ...history,
          inputToken: {
            ...remove_lp_token_in_metadata,
            amount: BigInt(history?.events?.amount_a_received)?.toString()
          },
          outputToken: {
            ...remove_lp_token_out_metadata,
            amount: BigInt(history?.events?.amount_b_received)?.toString()
          },
          action_type: 'AddLiquidity'
        }
      default:
        const paths = history?.events?.path || []
        const token_in = history?.events?.path?.[0];
        const token_out = history?.events?.path?.[paths.length - 1];
        const token_in_metadata = cointype_by_chain?.VARA?.[token_in];
        const token_out_metadata = cointype_by_chain?.VARA?.[token_out];
        return {
          ...history,
          inputToken: {
            ...token_in_metadata,
            amount: BigInt(history?.events?.amount_in)?.toString()
          },
          outputToken: {
            ...token_out_metadata,
            amount: +BigInt(history?.events?.amount_out)?.toString()
          },
          action_type: 'Swap'
        }
    }
  }

  const getSwapHistory = async () => {
    setLoading(true)
    const query_string = QueryString.stringify({
      filters: {
        type: {
          $contains: type
        }
      },
      sort: [`createdAt:desc`],
      pagination: {
        page: currentPage,
        pageSize: 10,
      },
    }, {
      encodeValuesOnly: true,
    });
    const { data, error, meta } = await get_swap_history(query_string)

    if (!error) {
      console.log('data-history-swap', data)
      const format_data = data?.map((history: any) => {
        const format = formatDataHistory(history)
        return format
      })
      setLoading(false)

      console.log('data-swap-history format_data', format_data)
      setDataTokenPriceFilter(format_data)
      setTotalPage(meta.pagination.pageCount)
    }
    setLoading(false)
  }

  const labelByTypeHistory = (type: any, tokenA: any, tokenB: any) => {
    switch (type) {
      case 'Swap':
        return `Swap ${tokenA?.symbol} for ${tokenB?.symbol}`
      case 'AddLiquidity':
        return `Add ${tokenA?.symbol} and ${tokenB?.symbol}`
      case 'RemoveLiquidity':
        return `Remove ${tokenA?.symbol} and ${tokenB?.symbol}`
    }
  }

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-2 mt-10 dark:text-white text-slate-900 font-semibold'>
        <p>Transaction</p>
        <FilterDropdown
          options={[
            {
              title: 'Swap',
              key: 'Swap'
            },
            {
              title: 'Add liquidity',
              key: 'AddLiquidity'
            },
            {
              title: 'Remove liquidity',
              key: 'RemoveLiquidity'
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
              accessorKey: 'type',
              header: `Type`,
              enableSorting: false,
              cell: (t: any) =>
                <a
                  href={`https://idea.gear-tech.io/explorer/${t?.row.original?.tx_hash}`}
                  target={"_blank"}
                  rel="noopener noreferrer"
                  className='w-[200px] min-w-[200px] text-mainColor hover:underline'>
                  {labelByTypeHistory(t?.row.original.action_type, t?.row.original.inputToken, t?.row.original.outputToken)}
                </a>
            },
            {
              accessorKey: 'address',
              header: "Address",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>{shortString(t?.row?.original?.sender, 4, 6)}</p>
            },
            {
              accessorKey: 'total_value',
              header: "Total Value",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>${formatNumberDisplay(t?.row?.original?.amount_usd)}</p>
            },
            {
              accessorKey: 'token_amount_a',
              header: "Input Amount",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(BigNumber.parseNumberToOriginal(t?.row?.original?.inputToken?.amount, t?.row?.original?.inputToken?.decimals))}</p>
            },
            {
              accessorKey: 'token_amount_b',
              header: "Output Amount",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>{formatNumberDisplay(BigNumber.parseNumberToOriginal(t?.row?.original?.outputToken?.amount, t?.row?.original?.outputToken?.decimals))}</p>
            },
            {
              accessorKey: 'time',
              header: "Time",
              enableSorting: false,
              cell: (t: any) => <p className='m-0'>{formatTime(+t?.row?.original?.timestamp_ms, 'ago')}</p>
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