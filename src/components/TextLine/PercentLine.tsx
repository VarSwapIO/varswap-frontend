import React from 'react'

const PercentLine = ({ value }: { value: number }) => {
  const increase = value > 0 ? true : false;

  if (value === 0) {
    return <span className={`m-0 text-medium dark:text-slate-400 text-slate-500`}>0.00%</span>
  }
  return (
    <span className={`m-0 text-medium ${increase ? 'text-green-500' : 'text-red-500'}`}>{increase ? '+' : ''}{value?.toFixed(2)}%</span>
  )
}

export default PercentLine