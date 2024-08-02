import SkeletonBG from '@/components/SkeletonBG'
import { darkColors, lightColors } from '@/containers/Overview/color'
import { formatAmount } from '@/containers/Overview/format'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { formatTime, percentBetweenTwoValue } from '@/helpers/utils'
import { useState } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'

const getBaseLog = (x: number, y: number) => {
    const num_f = Math.log(y) / Math.log(x)
    return num_f > 0 ? num_f : 0;
}

export type LineChartProps = {
    data: any[];
    loading: boolean;
} & React.HTMLAttributes<HTMLDivElement>

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const ChartTokenDetail = ({ data, loading }: LineChartProps) => {
    const [dataHover, setDataHover] = useState<{ [key: string]: any }>({})
    const data_current_day = data?.[data?.length - 1] || {}
    const colorOptions = localStorage.theme === 'light' ? lightColors : darkColors;
    const change_price = percentBetweenTwoValue(data?.[0]?.value, dataHover?.value || data_current_day?.value)
    console.log('data_chart_tvl', data)
    if (!data || data.length === 0 || loading) {
        return <div className='w-full md:w-3/5 h-full overflow-hidden relative'>
            <div>
                <p className='mt-1'><SkeletonBG width={200} height={30} /></p>
                <p className='mt-1'><SkeletonBG width={150} height={15} /></p>
            </div>
            <svg width="100%" height="300px" preserveAspectRatio="none" viewBox="0 0 100 50" color="text" xmlns="http://www.w3.org/2000/svg" className="Svg-sc-4ba21b47-0 GjBIu"><path d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6" stroke="#3975fc" stroke-width="0.2" stroke-dasharray="156" stroke-dashoffset="156" fill="transparent" opacity="0.5" filter="url(#glow)"><animate id="firstline" attributeName="stroke-dashoffset" dur="2s" from="156" to="-156" begin="0s;firstline.end+0.5s"></animate></path><path d="M 0 49 C 1 49 1 45 4 47 C 7 49 7 35 11 37 C 13 38 14 32 16 34 C 18 35.6667 20 40 22 39 C 24 38 24 34 26 34 C 27 34 29 39 32 36 C 33 35 34 32 35 32 C 37 32 37 35 39 34 C 40 33 39 29 43 31 C 46 32 45 28 47 30 C 50 32 49 22 51 24 Q 53 26 55 24 C 56 23 56 25 57 26 C 58 27 59 28 60 28 C 63 28 66 17 67 16 C 68 15 69 17 70 16 C 71 15 71 13 74 13 C 76 13 76 14 77 15 C 79 17 80 18 82 18 C 83 18 83 17 84 17 C 87 17 89 24 91 24 C 93 24 95 20 96 17 C 97.6667 13.3333 98 9 101 6" stroke="#1FC7D4" stroke-width="0.2" stroke-dasharray="156" stroke-dashoffset="156" fill="transparent" opacity="0.5" filter="url(#glow)"><animate id="secondline" attributeName="stroke-dashoffset" dur="2s" from="156" to="-156" begin="1.3s;secondline.end+0.5s"></animate></path><defs><filter id="glow"><feGaussianBlur className="blur" result="coloredBlur" stdDeviation="4"></feGaussianBlur><feMerge><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="coloredBlur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs></svg>
        </div>
    }
    return (
        <div className='w-full md:w-3/5 h-full overflow-hidden relative'>
            <div className=''>
                <p className='text-4xl font-semibold dark:text-txtdark-300 mt-1'>${formatNumberDisplay((dataHover?.value || data_current_day?.value)?.toFixed(Math.floor(3 + getBaseLog(10, 1 / ((dataHover?.value || data_current_day?.value))))) || 0)}</p>
                <div className='flex gap-2 items-center'>
                    {change_price.value_number ? <p className={`text-green-400 flex items-center gap-1 ${change_price?.increase ? 'text-green-500' : 'text-red-500'}`}>
                        {change_price?.increase ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                        </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                            </svg>}
                        {change_price?.value}
                    </p> : <p>_</p>}
                    <p>-</p>
                    <p className='h-6 text-sm dark:text-txtdark-200 ml-1 mt-1'>{formatTime(+dataHover?.time || +data_current_day?.time)}</p>
                </div>
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

export default ChartTokenDetail
