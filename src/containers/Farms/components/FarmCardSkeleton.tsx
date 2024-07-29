import SkeletonBG from "@/components/SkeletonBG"
import { Button } from "@mantine/core"

const FarmCardSkeleton = () => {
  return (
    <div className='shadow-md relative p-3 pb-1 z-10 w-full border dark:border-slate-700 border-slate-200 rounded-3xl dark:bg-slate-900 bg-white'>
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <div className='flex'>
            <SkeletonBG width={50} height={50} circle={true} />
            <SkeletonBG width={50} height={50} circle={true} className="-ml-[16px]" />
          </div>
          <div>
            <SkeletonBG width={140} height={22} />
            <SkeletonBG width={140} height={22} className="mt-1" />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center text-sm font-semibold border dark:border-slate-700 border-slate-200 p-2 px-4 rounded-2xl'>
          <p className='font-semibold'>APY</p>
          <SkeletonBG width={40} height={20} />
        </div>
      </div>
      <div className='p-4 text-txt-200 dark:text-white text-sm'>
        <div>
          <div className='flex items-center justify-between font-semibold '>
            <p>Earn:</p>
            <SkeletonBG width={90} height={15} />
          </div>
          <div className='flex items-center justify-between font-semibold '>
            <p>End In:</p>
            <SkeletonBG width={90} height={15} />
          </div>
        </div>
        <div className="mt-4">
          <p className=" font-semibold">Earned</p>
          <div className='flex justify-between items-center'>
            <div className='mt-2'>
              <SkeletonBG width={90} height={15} />
              <SkeletonBG width={90} height={15} className="mt-2" />
            </div>
            <Button
              disabled
              radius={'xl'}
              size='sm'
              style={{
                '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
              }}
            >
              Claim
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <p className=" font-semibold">Staked</p>
          <div className='flex justify-between mt-1'>
            <div>
              <SkeletonBG width={90} height={15} />
              <SkeletonBG width={90} height={15} className="mt-2" />
            </div>
            <Button
              disabled
              radius={'xl'}
              size='sm'
              style={{
                '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
              }}
            >
              Stake LP
            </Button>
          </div>
        </div>
      </div>
      <div className='space-y-2 p-4 text-txt-200 dark:text-white text-sm border-t'>
        <div className='flex items-center justify-between font-semibold '>
          <p>Total liquidity:</p>
          <SkeletonBG width={90} height={15} />
        </div>
        <div className='flex gap-1 items-center font-semibold justify-end'>
          <SkeletonBG width={150} height={20} />
        </div>
      </div>
    </div>
  )
}

export default FarmCardSkeleton