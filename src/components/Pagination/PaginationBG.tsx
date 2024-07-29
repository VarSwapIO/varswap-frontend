import { MAIN_COLOR } from '@/config/asset'
import { Pagination, PaginationProps } from '@mantine/core'
import React from 'react'

const PaginationBG = ({ className, ...props }: PaginationProps) => {
  return (
    <Pagination
      {...props}
      className={`${className ?? ''}`}
      classNames={{
        control: 'font-semibold text-xs sm:text-sm'
      }}
      style={{
        '--mantine-color-body': 'transparent',
        '--mantine-color-dark-4': '#151e35',
        '--mantine-color-dark-6': '#2a3547',
        '--mantine-color-dark-5': '#19233d',
        '--pagination-active-bg': MAIN_COLOR,
        '--mantine-color-gray-4':'#deebf8'
      }}
    />
  )
}

export default PaginationBG