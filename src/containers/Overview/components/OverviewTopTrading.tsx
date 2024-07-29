import { MAIN_COLOR } from '@/config/asset'
import LeaderboardDataTable from '@/containers/Leaderboard/components/LeaderboardDataTable'
import { Button } from '@mantine/core'
import { SortingState } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useState } from 'react'

const OverviewTopTrading = () => {
  const [dataTokenPriceFilter, setDataTokenPriceFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center mb-2 mt-10 dark:text-white text-slate-900 font-semibold'>
        <p>Top Trading</p>
        <Button
          component={Link}
          href="/leaderboard"
          size={'sm'}
          radius="xl"
          color={MAIN_COLOR}
          variant={"light"}
          rightSection={
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M16.15 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.15L13.3 8.15q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L19.3 11.3q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.575 4.575q-.3.3-.712.288t-.713-.313q-.275-.3-.288-.7t.288-.7z"></path></svg>
          }
        >
          Explore
        </Button>
      </div>

      <LeaderboardDataTable
        data={dataTokenPriceFilter}
        sorting={sorting}
        onSort={(sort: SortingState) => setSorting(sort)}
        loading={loading}
      />
    </div>
  )
}

export default OverviewTopTrading