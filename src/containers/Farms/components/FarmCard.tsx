import ImageBG from '@/components/Image/ImageBG'
import TimeBoxCountDown from '@/components/TextLine/TimeBoxCountDown'
import { MAIN_COLOR } from '@/config/asset'
import { BigNumber } from '@/helpers/big_number_cal'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import { TOKEN_LIST } from '@/mockData'
import { ActionIcon, Button, RingProgress, Tooltip } from '@mantine/core'
import Link from 'next/link'
import React, { useState } from 'react'
import ModalStakedLP from './ModalStakedLP'

const FarmCard = () => {
  const [tokenA, setTokenA] = useState<TOKEN_METADATA>(TOKEN_LIST[0]);
  const [tokenB, setTokenB] = useState<TOKEN_METADATA>(TOKEN_LIST[1]);
  const [reawardA, setReawardA] = useState(10000000000000);
  const [rewardB, setRewardB] = useState(100000000);
  const [amountWithdraw, setAmountWithdraw] = useState<string | number>('0')
  const [amountStake, setAmountStake] = useState<string | number>('0')

  const [openModalStakeLP, setOpenModalStakeLP] = useState(false)
  const [openModalWithdrawLP, setOpenModalWithdrawLP] = useState(false)


  const isPoolStable = false;
  const isFinished = false;

  return (
    <>
      <div className='dark:text-white text-slate-900 shadow-md relative p-3 pb-1 w-full border dark:border-slate-700 border-slate-200 rounded-3xl dark:bg-slate-900 bg-white'>
        <div className='flex gap-2 items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <div className='flex'>
              <ImageBG
                className='w-12 h-12 rounded-full object-cover bg-white border border-slate-200 dark:border-slate-700'
                src={tokenA?.icon}
                alt="token1-pool"
                width={48}
                height={48}
              />
              <ImageBG
                className='-ml-4 w-12 h-12 rounded-full object-cover bg-white border border-slate-200 dark:border-slate-700'
                src={tokenB?.icon}
                alt="token2-pool"
                width={48}
                height={48}
              />
            </div>
            <div className=''>
              <p className='font-semibold text-lg'>{tokenA?.symbol}-{tokenB?.symbol} LP</p>
              <div className='flex items-center gap-2 '>
                <div className='flex items-center justify-between gap-0.5 border-2 font-semibold border-mainColor text-mainColor rounded-full p-0.5 px-1.5'>
                  <Tooltip
                    position="top"
                    label='Core'
                  >
                    <svg viewBox="0 0 17 17" fill="none" className='w-4 h-4'>
                      <path
                        d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                        fill={MAIN_COLOR}
                        stroke={MAIN_COLOR}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.08691 8.98833L7.69358 10.6017L10.9136 7.375"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Tooltip>
                  {isPoolStable ? 'Stable LP' : ' Core'}
                </div>
                <p className='rounded-xl text-white font-bold bg-mainColor w-fit text-xs p-2'>{'10X' || '1X'}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center text-sm font-semibold border dark:border-slate-700 border-slate-200 p-2 px-4 rounded-2xl'>
            <p className='font-semibold'>APY</p>

            <Tooltip
              position="top"
              label={<div className='flex gap-6 items-start min-w-[250px] py-2 z-50'>
                <RingProgress
                  size={120}
                  thickness={12}
                  roundCaps
                  sections={[
                    { value: 80, color: '#22c55e' },
                    { value: 20, color: 'blue' },
                  ]}
                />
                <div>
                  <div className='flex gap-2 items-center justify-between text-gray-400'>
                    <p className='ml-3'>Total APR</p>
                    <p className='text-white'>{formatNumberDisplay(7.25) || 0}%</p>
                  </div>
                  <div className='flex gap-2 items-center justify-between text-gray-400'>
                    <div className='flex items-center gap-1'>
                      <p className='w-2 h-2 rounded-full bg-[#22c55e]'></p>
                      <p>Rewards</p>
                    </div>
                    <p className='text-[#22c55e]'>{formatNumberDisplay(5.8) || 0}%</p>
                  </div>
                  <div className='flex gap-2 items-center justify-between text-gray-400'>
                    <div className='flex items-center gap-1'>
                      <p className='w-2 h-2 rounded-full bg-blue-500'></p>
                      <p>Fees</p>
                    </div>
                    <p className='text-blue-500'>{formatNumberDisplay(1.45) || 0}% </p>
                  </div>
                </div>
              </div>}
            >
              <p className='text-green-500'>{formatNumberDisplay(7.25) || 0}%</p>
            </Tooltip>
          </div>
        </div>
        <div className='space-y-4 p-4 text-slate-600 font-medium dark:text-white text-sm'>
          <div>
            <div className='flex items-center justify-between font-semibold '>
              <p>Earn:</p>
              <div>
                {tokenA?.symbol && <span>{tokenA?.symbol}</span>}
                {tokenB?.symbol && <span> + {tokenB?.symbol} </span>}
                <span> + Fees</span>
              </div>
            </div>
            <div className='flex items-center justify-between font-semibold mt-1'>
              <p>End In:</p>
              <p>{isFinished ? 'Finished' : <TimeBoxCountDown end_time={new Date().getTime() + 60 * 60 * 24 * 1000} />}</p>
            </div>
          </div>
          <div>
            <p className='font-semibold text-md'>
              {tokenA?.symbol && <span className='text-mainColor'>{tokenA?.symbol} {tokenB?.symbol ? 'AND' : ''} </span>}
              {tokenB?.symbol && <span className='text-mainColor'>{tokenB?.symbol} </span>}
              EARNED</p>
            <div className='flex justify-between items-center mt-1 text-[16px] font-medium'>
              <div className='h-[85px] text-green-400 flex flex-col justify-center gap-1.5'>
                {tokenA?.symbol && <div>
                  <p className='font-semibold flex gap-2 items-center'>+{formatNumberDisplay(BigNumber.parseNumberToOriginal(+reawardA || 0, +tokenA?.decimals))}
                    <ImageBG
                      src={tokenA?.icon}
                      className='w-6 h-6 rounded-full border dark:border-slate-700 border-slate-200 bg-white'
                      alt="icon-token"
                      width={24}
                      height={24}
                    /> </p>
                  <p className='text-xs text-slate-600 dark:text-slate-400 font-semibold'>~${formatNumberDisplay((BigNumber.parseNumberToOriginal(+reawardA || 0, +tokenA?.decimals)))}</p>
                </div>}
                {tokenB?.symbol && <div>
                  <div className='font-semibold flex gap-2 items-center'>
                    +{formatNumberDisplay(BigNumber.parseNumberToOriginal(+rewardB || 0, +tokenB?.decimals))}
                    <ImageBG
                      src={tokenB?.icon}
                      className='w-6 h-6 rounded-full border dark:border-slate-700 border-slate-200 bg-white'
                      alt="icon-token"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 font-semibold'>
                    ~${formatNumberDisplay((BigNumber.parseNumberToOriginal(+rewardB || 0, +tokenB?.decimals)))}
                  </p>
                </div>}
              </div>
              <Button
                onClick={() => { }}
                disabled={+reawardA === 0 || + rewardB === 0}
                size={'sm'}
                radius="xl"
                color={MAIN_COLOR}
                variant={"light"}
                style={{
                  '--mantine-color-dark-6': '#232a37', '--mantine-color-dark-3': '#7C8898'
                }}
              >
                Harvest
              </Button>
            </div>
          </div>
          <div>
            <p className='font-semibold text-md'><span className='text-mainColor'>{tokenA?.symbol}-{tokenB?.symbol} LP</span> STAKED</p>
            <div className='flex justify-between items-center'>
              <div className=''>
                <p className='text-xl font-semibold '>{formatNumberDisplay(123)}</p>
                <p className='text-xs dark:text-slate-400 font-semibold'>~${formatNumberDisplay(750)}</p>
              </div>
              <div>
                {true ? <div className='flex gap-2 items-center'>
                  <ActionIcon
                    radius={'xl'}
                    color={'red'}
                    onClick={() => setOpenModalWithdrawLP(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </ActionIcon>
                  <ActionIcon
                    radius={'xl'}
                    color={MAIN_COLOR}
                    onClick={() => setOpenModalStakeLP(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </ActionIcon>
                </div> :
                  <>
                    {isFinished ? <button className='w-fit mt-2 text-white flex items-center justify-center gap-2 bg-gradient-to-br font-medium from-gray-500 to-gray-600 focus:ring-4 cursor-not-allowed focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl py-2 px-5 text-center'>
                      Stake LP
                    </button> : <button onClick={() => { }} className='w-fit mt-2 text-white flex items-center justify-center gap-2 bg-gradient-to-br font-medium from-blue-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl py-2 px-5 text-center'>
                      Stake LP
                    </button>}
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className='space-y-2 p-4 text-slate-600 font-medium dark:text-white text-sm border-t dark:border-slate-700'>
          <div className='flex items-center justify-between font-semibold '>
            <p>Total liquidity:</p>
            <p>${formatNumberDisplay((15000 || 0))}</p>
          </div>
          <Link href={`/pool/add/${tokenA?.address}/${tokenB?.address}`} className='text-blue-500 flex gap-1 text-xs items-center font-semibold justify-end cursor-pointer hover:text-blue-600'>
            <p className='mt-1'>ADD {tokenA?.symbol}-{tokenB?.symbol} LP</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </Link>
        </div>
      </div>

      <ModalStakedLP
        onChange={(amount: string | number) => setAmountStake(amount)}
        value={amountStake}
        opened={openModalStakeLP}
        close={() => setOpenModalStakeLP(false)}
        tokenA={tokenA}
        tokenB={tokenB}
        type={'stake'}
        lpBalance={1000}
      />

      <ModalStakedLP
        onChange={(amount: string | number) => setAmountWithdraw(amount)}
        value={amountWithdraw}
        opened={openModalWithdrawLP}
        close={() => setOpenModalWithdrawLP(false)}
        tokenA={tokenA}
        tokenB={tokenB}
        type={'withdraw'}
        lpBalance={123}
      />
    </>
  )
}

export default FarmCard