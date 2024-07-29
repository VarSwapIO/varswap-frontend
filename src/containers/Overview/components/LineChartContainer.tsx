import SkeletonBG from '@/components/SkeletonBG'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { formatTime } from '@/helpers/utils'
import { useMantineColorScheme } from '@mantine/core'
import { Dispatch, SetStateAction, useState } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import { darkColors, lightColors } from '../color'
import { formatAmount } from '../format'

export type LineChartProps = {
    data: any[]
} & React.HTMLAttributes<HTMLDivElement>

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const LineChartContainer = ({ data }: LineChartProps) => {
    const { colorScheme } = useMantineColorScheme()
    const [dataHover, setDataHover] = useState<{ [key: string]: any }>({})
    const data_current_day = data?.[data?.length - 1] || {}
    const colorOptions = colorScheme === 'light' ? lightColors : darkColors
    console.log('data_chart_tvl', data)
    if (!data || data.length === 0) {
        return <div className='w-full h-full overflow-hidden relative border rounded-xl p-3 pb-6 px-6 dark:border-slate-700'>
            <div >
                <p className='text-xl dark:text-txtdark-200 font-semibold'>TVL</p>
                <SkeletonBG width={200} height={30} className='mt-1' />
                <SkeletonBG width={150} height={15} className='mt-1' />
            </div>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 50" color="text" xmlns="http://www.w3.org/2000/svg" className="Svg-sc-4ba21b47-0 GjBIu"><path d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6" stroke="#18d856" strokeWidth="0.2" strokeDasharray="156" strokeDashoffset="156" fill="transparent" opacity="0.5" filter="url(#glow)"><animate id="firstline" attributeName="stroke-dashoffset" dur="2s" from="156" to="-156" begin="0s;firstline.end+0.5s"></animate></path><path d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6" stroke="#1FC7D4" strokeWidth="0.2" strokeDasharray="156" strokeDashoffset="156" fill="transparent" opacity="0.5" filter="url(#glow)"><animate id="secondline" attributeName="stroke-dashoffset" dur="2s" from="156" to="-156" begin="1.3s;secondline.end+0.5s"></animate></path><defs><filter id="glow"><feGaussianBlur className="blur" result="coloredBlur" stdDeviation="4"></feGaussianBlur><feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs></svg>
        </div>
    }
    return (
        <div className='w-full h-full overflow-hidden relative border rounded-xl p-3 px-6 dark:border-slate-700'>
            <div className=''>
                <p className='text-xl dark:text-txtdark-200 font-semibold'>TVL</p>
                <p className='text-4xl font-semibold dark:text-txtdark-300 mt-1'>${formatNumberDisplay(dataHover?.value?.toFixed(2) || data_current_day?.value?.toFixed(2))}</p>
                <p className='h-6 text-sm dark:text-txtdark-200 ml-1 mt-1'>{formatTime(dataHover?.time || data_current_day?.time, 'short')}</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 15,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colorOptions.inputSecondary} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={colorOptions.secondary} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(time: Date) => new Date(time)?.toLocaleDateString(undefined, { day: '2-digit' })}
                        minTickGap={10}
                    />
                    <YAxis
                        dataKey="value"
                        tickCount={6}
                        scale="linear"
                        axisLine={false}
                        tickLine={false}
                        fontSize="12px"
                        tickFormatter={(val) => `$${formatAmount(val)}`}
                        orientation="right"
                        tick={{ dx: 10, fill: colorOptions.textSubtle }}
                    />
                    <Tooltip
                        cursor={{ stroke: colorOptions.secondary }}
                        contentStyle={{ display: 'none' }}
                        labelFormatter={(value: any, payload: any) => {
                            console.log('payload', payload)
                            setDataHover(payload?.[0]?.payload)
                            return `label: ${value}`;
                        }}
                    />
                    <Area dataKey="value" type="monotone" stroke={colorOptions.secondary} fill="url(#gradient)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>

    )
}

export default LineChartContainer
