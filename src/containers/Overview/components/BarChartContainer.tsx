import SkeletonBG from '@/components/SkeletonBG'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { formatTime } from '@/helpers/utils'
import { useMantineColorScheme } from '@mantine/core'
import { Dispatch, SetStateAction, useState } from 'react'
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import { darkColors, lightColors } from '../color'
import { formatAmount } from '../format'

export type BarChartProps = {
  data: any[]
} & React.HTMLAttributes<HTMLDivElement>

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
}) => {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  )
}


const BarChartContainer = ({ data }: BarChartProps) => {
  const { colorScheme } = useMantineColorScheme()
  const [dataHover, setDataHover] = useState<{ [key: string]: any }>({})
  const data_current_day = data?.[data?.length - 1] || {}
  const colorOptions = colorScheme === 'light' ? lightColors : darkColors
  console.log('data_chart_volume24h', data)
  if (!data || data.length === 0) {
    return (
      <div className='w-full h-full overflow-hidden relative border rounded-xl p-3 pb-6 px-6 dark:border-slate-700'>
        <div >
          <p className='text-xl dark:text-txtdark-200 font-semibold'>Volume 24H</p>
          <SkeletonBG width={200} height={30} className='mt-1' />
          <SkeletonBG width={150} height={15} className='mt-1' />
        </div>
        <svg width="100%" height="100%" viewBox="0 0 50 25" preserveAspectRatio="none" opacity="0.4" color="text" xmlns="http://www.w3.org/2000/svg" className="Svg-sc-4ba21b47-0 GjBIu"><rect width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.9s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.9s"></animate></rect><rect x="10.222%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.8s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.8s"></animate></rect><rect x="20.444%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.7s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.7s"></animate></rect><rect x="30.666%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.6s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.6s"></animate></rect><rect x="40.888%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.5s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.5s"></animate></rect><rect x="51.11%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.4s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.4s"></animate></rect><rect x="61.332%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.3s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.3s"></animate></rect><rect x="71.554%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.2s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.2s"></animate></rect><rect x="81.776%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.1s"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite" begin="-0.1s"></animate></rect><rect x="91.998%" width="8%" fill="#18d856"><animate attributeName="height" dur="0.9s" values="15%; 90%; 15%" keyTimes="0; 0.55; 1" repeatCount="indefinite"></animate><animate attributeName="y" dur="0.9s" values="85%; 10%; 85%" keyTimes="0; 0.55; 1" repeatCount="indefinite"></animate></rect></svg>
      </div>
    )
  }
  return (
    <div className='w-full h-full overflow-hidden relative border rounded-xl p-3 px-6 dark:border-slate-700'>
      <div className=''>
        <p className='text-xl dark:text-txtdark-200 font-semibold'>Volume 24H</p>
        <p className='text-4xl font-semibold dark:text-txtdark-300 mt-1'>${formatNumberDisplay(dataHover?.value?.toFixed(2) || data_current_day?.value?.toFixed(2))}</p>
        <p className='h-6 text-sm dark:text-txtdark-200 ml-1 mt-1'>{formatTime(dataHover?.time || data_current_day?.time, 'short')}</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tickFormatter={(time: Date) => new Date(time)?.toLocaleDateString(undefined, { day: '2-digit' })}
            minTickGap={10}
          />
          <YAxis
            dataKey="value"
            tickCount={3}
            scale="linear"
            axisLine={false}
            tickLine={false}
            color={colorOptions.textSubtle}
            fontSize="12px"
            tickFormatter={(val) => `$${formatAmount(val)}`}
            orientation="right"
            tick={{ dx: 10, fill: lightColors.textSubtle }}
          />
          <Tooltip
            cursor={{ fill: colorOptions.backgroundDisabled }}
            contentStyle={{ display: 'none' }}
            labelFormatter={(value: any, payload: any) => {
              setDataHover(payload?.[0]?.payload)
              return `label: ${value}`;
            }}
          />
          <Bar
            dataKey="value"
            fill={colorOptions.primary}
            shape={(props: any) => (
              <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={colorOptions.primary} />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

  )
}

export default BarChartContainer
