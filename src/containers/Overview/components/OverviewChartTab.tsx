import SkeletonBG from "@/components/SkeletonBG";
import { formatNumberDisplay } from "@/helpers/format_number_display";
import { useEffect, useState } from "react";
import BarChartContainer from "./BarChartContainer";
import LineChartContainer from "./LineChartContainer";

const OverviewChartTab = () => {
    const [dataVolume24H, setDataVolume24H] = useState<Array<any>>([])
    const [dataTVL, setDataTVL] = useState<Array<any>>([])
    const [loading, setLoading] = useState(false)
    // const [dataCurrentDay, setDataCurrentDay] = useState<any>({})
    // const [loading, setLoading] = useState(false)
    // const [currentPage, setCurrentPage] = useState(1)


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
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(1000000)}</span>}
                </p>
                <p className="dark:text-slate-400 font-medium flex gap-1 items-center ">
                    Fees 24H: {loading ? <><p className="hidden sm:block">
                        <SkeletonBG width={100} height={20} /></p>
                        <p className="block sm:hidden"> <SkeletonBG width={50} height={15} /></p>
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(5400)}</span>}
                </p>
                <p className="dark:text-slate-400 font-medium flex gap-1 items-center ">
                    TVL: {loading ? <><p className="hidden sm:block">
                        <SkeletonBG width={100} height={20} /></p>
                        <p className="block sm:hidden"> <SkeletonBG width={50} height={15} /></p>
                    </> : <span className="dark:text-white text-slate-900 font-semibold">${formatNumberDisplay(53000000)}</span>}
                </p>
            </div>
        </div>
    );
}

export default OverviewChartTab