import ImageBG from '@/components/Image/ImageBG'
import TimeBoxCountDown from '@/components/TextLine/TimeBoxCountDown'
import { MAIN_COLOR } from '@/config/asset'
import { FARM_IDL, NETWORK } from '@/containers/router_sdk/constants'
import { BigNumber } from '@/helpers/big_number_cal'
import { formatAmountWithFixed, formatNumberDisplay } from '@/helpers/format_number_display'
import { ActionIcon, Button, RingProgress, Text, Tooltip } from '@mantine/core'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ModalStakedLP from './ModalStakedLP'
import SailsCalls from '@/containers/router_sdk/SailsCalls';
import { useConnectWallet } from '@/context/useConnectWallet'
import FarmCardSkeleton from './FarmCardSkeleton'
import { approveLPTokenForFarm, getUserSigner } from '@/containers/Swap/utils'
import { toast } from 'react-toastify'
import { DepositFarmLP, WithdrawFarmLP } from '../utils'
import { getBalanceLP } from '@/services/token.services'

const ACC_MOVE_PRECISION: number = 10000;

const calc_reward = (data_pool: any) => {
  let x_reward: number = 0;
  let acc_x_per_share = +data_pool.acc_x_per_share;
  let current_timestamp = new Date().getTime() / 1000;

  if (current_timestamp > data_pool.last_reward_timestamp) {
    let supply = +data_pool.total_amount;
    let multiplier = 0

    if (data_pool.end_timestamp <= data_pool.last_reward_timestamp) {
      multiplier = 0
    } else if (current_timestamp <= +data_pool.end_timestamp) {
      // if 'mass_update_pools' is ignored on any function which should be called,like 'upkeep',
      // should choose the max timestamp as 'last_reward_timestamp'.
      multiplier = current_timestamp - Math.max(+data_pool.last_reward_timestamp, +data_pool?.last_upkeep_timestamp || 0)
    } else {
      multiplier = data_pool.end_timestamp - Math.max(+data_pool.last_reward_timestamp, +data_pool?.last_upkeep_timestamp || 0)
    }
    if (supply > 0) {
      x_reward = (multiplier * +data_pool.x_per_second);
      acc_x_per_share = (+data_pool.acc_x_per_share) + (x_reward * ACC_MOVE_PRECISION) / supply;
    };
  };
  console.log('x_reward, acc_x_per_share,', x_reward, acc_x_per_share,)
  return { x_reward, acc_x_per_share, }
}

const FarmCard = ({ data }: { data: FARM_POOL_METADATA }) => {
  const { accountConnected } = useConnectWallet()
  const [amountWithdraw, setAmountWithdraw] = useState<string | number>('0')
  const [amountStake, setAmountStake] = useState<string | number>('0');
  const [rewardCurrent, setRewardCurrent] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [farmSailsCalls, setFarmSailsCalls] = useState<SailsCalls | undefined>(undefined);
  const [dataFarmPoolCurrent, setDataFarmPoolCurrent] = useState<FARM_POOL_METADATA>(data);
  const [dataUserFarm, setDataUserFarm] = useState({
    reward_debt: '0', stake_amount: '0'
  })
  const [lpBalance, setLpBalance] = useState('0')

  const [openModalStakeLP, setOpenModalStakeLP] = useState(false)
  const [openModalWithdrawLP, setOpenModalWithdrawLP] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingHarvest, setLoadingHarvest] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (data?.farm_contract_address) {
      getDataPool();

      const interval = setInterval(() => {
        getDataPool(true);
      }, 15000);

      return () => clearInterval(interval);
    }

  }, [data?.farm_contract_address])

  const getDataPool = async (disable_loading?: boolean) => {
    if (!data?.farm_contract_address) return;

    try {
      !disable_loading && setLoading(true)
      const sails = await SailsCalls.new({
        network: NETWORK,
        idl: FARM_IDL,
        contractId: data?.farm_contract_address as any,
      });

      const pool_farm_info = await sails?.query(
        `LpStakingService/PoolInfo`,
        {
          callArguments: []
        }
      )
      console.log('pool_farm_info :>> ', pool_farm_info);
      const format_data: FARM_POOL_METADATA = {
        ...data,
        end_timestamp: pool_farm_info?.end_timestamp,
        acc_x_per_share: BigInt(pool_farm_info?.acc_x_per_share)?.toString() || '0',
        x_per_second: BigInt(pool_farm_info?.x_per_second)?.toString() || '0',
        last_reward_timestamp: pool_farm_info?.last_reward_timestamp,
        total_amount: BigInt(pool_farm_info?.total_amount)?.toString() || '0',
      }
      if (format_data?.end_timestamp && +format_data?.end_timestamp <= new Date().getTime() / 1000) {
        setIsFinished(true)
      }
      console.log('format_data :>> ', format_data);
      setDataFarmPoolCurrent(format_data);
      setFarmSailsCalls(sails)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accountConnected?.address_decoded && farmSailsCalls) {
      getUserFarmData();
    }else{
      setDataUserFarm({ reward_debt: '0', stake_amount: '0'})
    }
  }, [accountConnected?.address_decoded, farmSailsCalls])

  const getUserFarmData = async () => {
    const user_data = await farmSailsCalls?.query(
      `LpStakingService/UserInfo`,
      {
        callArguments: [
          accountConnected?.address_decoded
        ]
      }
    )
    setDataUserFarm({
      reward_debt: BigInt(user_data?.reward_debt)?.toString() || '0', stake_amount: BigInt(user_data?.amount)?.toString()
    });

    if (!dataFarmPoolCurrent?.lp_stake_address || !accountConnected?.address_decoded) return;

    const balanceLP = await getBalanceLP(dataFarmPoolCurrent?.lp_stake_address, accountConnected?.address_decoded);
    console.log('balanceLP :>> ', balanceLP);
    setLpBalance(balanceLP)
  }

  useEffect(() => {
    if (!!dataUserFarm?.stake_amount && !!dataFarmPoolCurrent?.end_timestamp) {
      getRewardX(dataUserFarm);

      let interval = setInterval(() => {
        getRewardX(dataUserFarm);
      }, 5000);

      return () => clearInterval(interval)
    }
  }, [dataFarmPoolCurrent, dataUserFarm])

  const getRewardX = (userStaked: any) => {
    const { acc_x_per_share } = calc_reward(dataFarmPoolCurrent);
    console.log('acc_x_per_share :>> ', acc_x_per_share);
    const pending_x = ((+userStaked.stake_amount * +acc_x_per_share) / ACC_MOVE_PRECISION - userStaked.reward_debt);
    console.log('pending_x', pending_x, userStaked)
    setRewardCurrent(pending_x)
  }

  const handleDeposit = async () => {
    const amount_lp = BigNumber.parseNumberWithDecimals(amountStake, 12)
    if (!dataFarmPoolCurrent?.farm_contract_address || !dataFarmPoolCurrent?.lp_stake_address || !farmSailsCalls || !amount_lp) return
    try {
      setActionLoading(true)

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })

      const approve_lp_token_success = await approveLPTokenForFarm(dataFarmPoolCurrent?.lp_stake_address, dataFarmPoolCurrent?.farm_contract_address, amount_lp, userAddress, signer, {
        address: dataFarmPoolCurrent?.lp_stake_address,
        name: `${dataFarmPoolCurrent.token_x?.symbol}-${dataFarmPoolCurrent.token_y?.symbol}-LP`,
        icon: '',
        symbol: `${dataFarmPoolCurrent.token_x?.symbol}-${dataFarmPoolCurrent.token_y?.symbol}-LP`,
        decimals: 12
      });
      if (!approve_lp_token_success) {
        setActionLoading(false)
        return;
      }
      const deposit_result = await DepositFarmLP({
        token_a: dataFarmPoolCurrent.token_x,
        token_b: dataFarmPoolCurrent.token_y,
        deposit_amount: amount_lp,
        farm_pool_info: dataFarmPoolCurrent,
        sails: farmSailsCalls,
        signer: signer,
        userAddress: userAddress
      })

      if (!!deposit_result) {
        getDataPool(true);
        getUserFarmData();
        setOpenModalStakeLP(false)
      }
    } catch (error) {
      if (error?.toString()?.includes("User denied request signature")) {
        toast.error('User has rejected the request')
      } else {
        toast.error(error?.toString() || '')
      }

    } finally {
      setActionLoading(false)
    }
  }


  const handleWithdraw = async () => {
    const amount_lp = BigNumber.parseNumberWithDecimals(amountWithdraw, 12)
    if (!dataFarmPoolCurrent?.farm_contract_address || !dataFarmPoolCurrent?.lp_stake_address || !farmSailsCalls || !amount_lp) return
    try {
      setActionLoading(true)

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })
      const withdraw_result = await WithdrawFarmLP({
        token_a: dataFarmPoolCurrent.token_x,
        token_b: dataFarmPoolCurrent.token_y,
        withdraw_amount: amount_lp,
        farm_pool_info: dataFarmPoolCurrent,
        sails: farmSailsCalls,
        signer: signer,
        userAddress: userAddress
      })

      if (!!withdraw_result) {
        getDataPool(true);
        getUserFarmData();
        setOpenModalWithdrawLP(false)
      }
    } catch (error) {
      if (error?.toString()?.includes("User denied request signature")) {
        toast.error('User has rejected the request')
      } else {
        toast.error(error?.toString() || '')
      }

    } finally {
      setActionLoading(false)
    }

  }


  const handleHarvest = async () => {
    const amount_lp = '0'
    if (!dataFarmPoolCurrent?.farm_contract_address || !dataFarmPoolCurrent?.lp_stake_address || !farmSailsCalls || !amount_lp) return
    try {
      setLoadingHarvest(true)

      const [userAddress, signer] = await getUserSigner({
        address: accountConnected?.address,
        source: accountConnected?.meta?.source
      })
      const withdraw_result = await WithdrawFarmLP({
        token_a: dataFarmPoolCurrent.token_x,
        token_b: dataFarmPoolCurrent.token_y,
        withdraw_amount: amount_lp,
        farm_pool_info: dataFarmPoolCurrent,
        sails: farmSailsCalls,
        signer: signer,
        userAddress: userAddress,
        is_harvest: true
      })

      if (!!withdraw_result) {
        getDataPool(true);
        getUserFarmData();
      }
    } catch (error) {
      if (error?.toString()?.includes("User denied request signature")) {
        toast.error('User has rejected the request')
      } else {
        toast.error(error?.toString() || '')
      }

    } finally {
      setLoadingHarvest(false)
    }
  }



  return (
    <>
      {loading ? <FarmCardSkeleton /> :
        <>
          <div className='dark:text-white text-slate-900 shadow-md relative p-3 pb-1 w-full border dark:border-slate-700 border-slate-200 rounded-3xl dark:bg-slate-900 bg-white'>
            <div className='flex gap-2 items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <div className='flex'>
                  <ImageBG
                    className='w-12 h-12 rounded-full object-cover bg-white border border-slate-200 dark:border-slate-700'
                    src={dataFarmPoolCurrent?.token_x?.icon}
                    alt="token1-pool"
                    width={48}
                    height={48}
                  />
                  <ImageBG
                    className='-ml-4 w-12 h-12 rounded-full object-cover bg-white border border-slate-200 dark:border-slate-700'
                    src={dataFarmPoolCurrent?.token_y?.icon}
                    alt="token2-pool"
                    width={48}
                    height={48}
                  />
                </div>
                <div className=''>
                  <p className='font-semibold text-lg'>{dataFarmPoolCurrent?.token_x?.symbol}-{dataFarmPoolCurrent?.token_y?.symbol} LP</p>
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
                      Core
                    </div>
                    <p className='rounded-xl text-white font-bold bg-mainColor w-fit text-xs p-2'>{'10X' || '1X'}</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-center text-sm font-semibold border dark:border-slate-700 border-slate-200 p-2 px-4 rounded-2xl'>
                <p className='font-semibold' >APY</p>
                <Tooltip radius={'lg'} label={
                  <div className='flex items-center gap-1 justify-between w-[300px] rounded-xl p-2'>
                    <RingProgress
                      size={100}
                      thickness={8}
                      sections={[{ value: (100 - 30), color: 'yellow' }, { value: 30, color: '#3898ec' }]}
                      label={
                        <Text c="green" fw={700} ta="center" size="xs">
                          30%
                        </Text>
                      }
                    />
                    <div className='text-xs font-semibold space-y-2 w-full'>
                      <div className='flex gap-1 items-center'>
                        <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                        <div className='flex items-center justify-between w-full'><p>Total APR:</p> <p className='ml-auto'>{30}%</p> </div>
                      </div>
                      <div className='flex gap-1 items-center'>
                        <p className='w-2 h-2 bg-blue-500 rounded-full'></p>
                        <div className='flex items-center justify-between w-full'><p>Rewards</p> <p className='ml-auto'>{formatAmountWithFixed(12.5)}%</p> </div>
                      </div>
                      <div className='flex gap-1 items-center'>
                        <p className='w-2 h-2 bg-yellow-500 rounded-full'></p>
                        <div className='flex items-center justify-between  w-full'><p>Fees</p> <p className='ml-auto'>{formatAmountWithFixed(16.5)}%</p></div>
                      </div>
                    </div>
                  </div>
                } color={'black'}>
                  <p className='text-xs font-semibold text-mainColor'>+∞%</p>
                </Tooltip>
              </div>
            </div>
            <div className='space-y-4 p-4 text-slate-600 font-medium dark:text-white text-sm'>
              <div>
                <div className='flex items-center justify-between font-semibold '>
                  <p>Earn:</p>
                  <div>
                    {dataFarmPoolCurrent?.token_reward?.symbol && <span> {dataFarmPoolCurrent?.token_reward?.symbol} </span>}
                    <span> + Fees</span>
                  </div>
                </div>
                <div className='flex items-center justify-between font-semibold mt-1'>
                  <p>End In:</p>
                  <p>{isFinished ? 'Finished' : <TimeBoxCountDown end_time={(+(dataFarmPoolCurrent?.end_timestamp || 0)) * 1000} />}</p>
                </div>
              </div>
              <div>
                <p className='font-semibold text-md'>
                  {dataFarmPoolCurrent?.token_reward?.symbol && <span className='text-mainColor'>{dataFarmPoolCurrent?.token_reward?.symbol} </span>}
                  EARNED</p>
                <div className='flex justify-between items-center mt-1 text-[16px] font-medium'>
                  <div className=' text-green-400 flex flex-col justify-center gap-1.5'>
                    {dataFarmPoolCurrent?.token_reward?.symbol && <div>
                      <p className='font-semibold flex gap-2 items-center'>
                        {formatNumberDisplay(BigNumber.parseNumberToOriginal(rewardCurrent, 12))}
                        <ImageBG
                          src={dataFarmPoolCurrent?.token_reward?.icon}
                          className='w-6 h-6 rounded-full border dark:border-slate-700 border-slate-200 bg-white'
                          alt="icon-token"
                          width={24}
                          height={24}
                        /> </p>
                      <p className='text-xs text-slate-600 dark:text-slate-400 font-semibold'>~${formatNumberDisplay((BigNumber.parseNumberToOriginal(+rewardCurrent || 0, +dataFarmPoolCurrent?.token_reward?.decimals)))}</p>
                    </div>}
                  </div>
                  <Button
                    loading={loadingHarvest}
                    onClick={() => handleHarvest()}
                    disabled={+rewardCurrent === 0}
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
                <p className='font-semibold text-md'><span className='text-mainColor'>{dataFarmPoolCurrent?.token_x?.symbol}-{dataFarmPoolCurrent?.token_y?.symbol} LP</span> STAKED</p>
                <div className='flex justify-between items-center'>
                  <div className=''>
                    <p className='text-xl font-semibold '>{formatNumberDisplay(BigNumber.parseNumberToOriginal(dataUserFarm?.stake_amount, 12))}</p>
                    {/* <p className='text-xs dark:text-slate-400 font-semibold'>~</p> */}
                  </div>
                  <div>
                    {rewardCurrent > 0 ? <div className='flex gap-2 items-center'>
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
                        </button> : <button onClick={() => setOpenModalStakeLP(true)} className='w-fit mt-2 text-white flex items-center justify-center gap-2 bg-gradient-to-br font-medium from-blue-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-200 dark:focus:ring-blue-800 rounded-3xl py-2 px-5 text-center'>
                          Stake LP
                        </button>}
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className='space-y-2 p-4 text-slate-600 font-medium dark:text-white text-sm border-t dark:border-slate-700'>
              {/* <div className='flex items-center justify-between font-semibold '>
                <p>Total liquidity:</p>
                <p>${formatNumberDisplay((15000 || 0))}</p>
              </div> */}
              <Link href={`/liquidity/add/${dataFarmPoolCurrent?.token_x?.address}/${dataFarmPoolCurrent?.token_y?.address}`} className='text-blue-500 flex gap-1 text-xs items-center font-semibold justify-end cursor-pointer hover:text-blue-600'>
                <p className='mt-1'>ADD {dataFarmPoolCurrent?.token_x?.symbol}-{dataFarmPoolCurrent?.token_y?.symbol} LP</p>
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
            tokenA={dataFarmPoolCurrent?.token_x}
            tokenB={dataFarmPoolCurrent?.token_y}
            type={'stake'}
            lpBalance={BigNumber.parseNumberToOriginal(lpBalance, 12) || 0}
            onSubmit={() => handleDeposit()}
            loading={actionLoading}
          />

          <ModalStakedLP
            onChange={(amount: string | number) => setAmountWithdraw(amount)}
            value={amountWithdraw}
            opened={openModalWithdrawLP}
            close={() => setOpenModalWithdrawLP(false)}
            tokenA={dataFarmPoolCurrent?.token_x}
            tokenB={dataFarmPoolCurrent?.token_y}
            type={'withdraw'}
            lpBalance={BigNumber.parseNumberToOriginal(dataUserFarm?.stake_amount, 12) || 0}
            onSubmit={() => handleWithdraw()}
            loading={actionLoading}
          />
        </>
      }
    </>
  )
}

export default FarmCard