import SkeletonBG from "@/components/SkeletonBG";
import { formatNumberDisplay } from "@/helpers/format_number_display";
import { useEffect, useState } from "react";
import BarChartContainer from "./BarChartContainer";
import LineChartContainer from "./LineChartContainer";
import QueryString from 'qs'
import { get_chart_data, get_dex_data } from "@/services/overview.services";

const OverviewChartTab = () => {
    const [dataVolume24H, setDataVolume24H] = useState<Array<any>>([])
    const [dataTVL, setDataTVL] = useState<Array<any>>([])
    const [dataOverview, setDataOverview] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getData()
    }, [currentPage])

    const getData = async () => {
        setLoading(true)
        const { data: dataDex, error: errorDex } = await get_dex_data()
        if (!errorDex) {
            setDataOverview(dataDex?.attributes || {})
        }
        console.log('dataDex', dataDex)
        const query_string = QueryString.stringify({
            sort: ['date:asc'],
            pagination: {
                page: currentPage,
                pageSize: 100,
            },
        }, {
            encodeValuesOnly: true,
        });
        const { data, error, meta } = await get_chart_data(query_string);
        console.log('dataget_chart_data', data)
        if (!error) {
            let data_volume_24h: Array<any> = []
            let data_tvl: Array<any> = []
            data.forEach((element: any) => {
                data_volume_24h.push({ time: new Date(+element?.date).toISOString(), value: element?.volume_usd })
                data_tvl.push({ time: new Date(+element?.date).toISOString(), value: element?.tvl_usd })
            });

            setDataVolume24H((v24h: any) => ([...v24h, ...data_volume_24h]))
            setDataTVL((dvl: any) => ([...dvl, ...data_tvl]))
            if (currentPage < meta.pagination.pageCount) {
                setCurrentPage((x: number) => x + 1)
            }
        }
        setLoading(false)
    }


    return (
        <div className='relative container mx-auto px-2 mb-6 dark:text-white text-slate-900'>
            <p className='text-mainColor font-bold text-center text-5xl my-10'>Overview</p>
            <div className="flex lg:flex-row flex-col gap-4 items-center">
                <LineChartContainer data={dataTVL} />
                <BarChartContainer data={dataVolume24H} />
            </div>
            <div className="text-xs sm:text-base rounded-xl border dark:border-slate-700 p-4 grid grid-cols-2 sm:flex gap-4 items-center mt-4">
                <p className="dark:text-slate-400 font-medium flex gap-1 items-center ">
                    Volume 24H: {loading ? <><p className="hidden sm:block">
                        <SkeletonBG width={100} height={20} /></p>
                        <p className="block sm:hidden"> <SkeletonBG width={50} height={15} /></p>
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(+dataOverview?.volume_24h_usd?.toFixed(2) || 0)}</span>}
                </p>
                <p className="dark:text-slate-400 font-medium flex gap-1 items-center ">
                    Fees 24H: {loading ? <><p className="hidden sm:block">
                        <SkeletonBG width={100} height={20} /></p>
                        <p className="block sm:hidden"> <SkeletonBG width={50} height={15} /></p>
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(+(+dataOverview?.volume_24h_usd * 0.003)?.toFixed(2) || 0)}</span>}
                </p>
                <p className="dark:text-slate-400 font-medium flex gap-1 items-center ">
                    TVL: {loading ? <><p className="hidden sm:block">
                        <SkeletonBG width={100} height={20} /></p>
                        <p className="block sm:hidden"> <SkeletonBG width={50} height={15} /></p>
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(+dataOverview?.total_tvl_usd?.toFixed(2) || 0)}</span>}
                </p>
            </div>
        </div>
    );
}

export default OverviewChartTab