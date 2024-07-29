'use client'
import React from 'react'
import OverviewChartTab from './components/OverviewChartTab'
import OverviewToken from './components/OverviewToken'
import OverviewTopTrading from './components/OverviewTopTrading'
import OverviewTransaction from './components/OverviewTransaction'

const OverviewContainer = () => {
  return (
    <div className='min-h-[90vh] pb-10'>
      <OverviewChartTab />
      <OverviewToken />
      <OverviewTopTrading />
      <OverviewTransaction />
    </div>
  )
}

export default OverviewContainer