import { Signer } from '@polkadot/types/types';
import { send_message } from "../router_sdk";
import SailsCalls from "../router_sdk/SailsCalls";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { rem } from "@mantine/core";

export const DepositFarmLP = async ({ token_a, token_b, farm_pool_info, deposit_amount, userAddress, signer, sails }:
  { token_a: COIN_METADATA; token_b: COIN_METADATA; farm_pool_info: FARM_POOL_METADATA, deposit_amount: string; userAddress: any; signer: Signer; sails: SailsCalls }) => {

  const id = notifications.show({
    loading: true,
    title: `Deposit ${token_a.symbol}-${token_b.symbol} LP`,
    message: `Processing ...`,
    autoClose: false,
    withCloseButton: false,
    className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
    classNames: {
      body: "dark:text-slate-300 text-slate-700 font-medium",
      root: 'mt-2',
      closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
      description: 'dark:text-slate-300 text-slate-700 mt-2'
    },
  });

  try {

    let url_command = `${farm_pool_info?.farm_contract_address}/LpStakingService/Deposit`;
    let methodName = 'Deposit'
    let args = [
      deposit_amount
    ]
    let value = '0'
    console.log('args', args)
    const approve_response = await send_message(url_command, {
      methodName,
      args,
      value
    }, () => {
      console.log('Message to send is loading');
    }, async () => {
      console.log('Approve successfully!');
    }, () => {
      console.log('An error ocurred!');
    }, { userAddress, signer }, sails);
    console.log('approve_response', approve_response)
    if (!!approve_response?.err) {
      notifications.update({
        id,
        color: 'red',
        title: `Deposit ${token_a.symbol}-${token_b.symbol} LP`,
        message: <p className='text-sm text-red-500 line-clamp-1'>{`An error occurred please try again!`}</p>,
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5000,
        className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
        classNames: {
          body: "dark:text-slate-300 text-slate-700 font-medium",
          root: 'mt-2',
          closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
          description: 'dark:text-slate-300 text-slate-700 mt-2'
        },
      });
      return false;
    } else {
      notifications.update({
        id,
        color: 'green',
        title: `Deposit ${token_a.symbol}-${token_b.symbol} LP`,
        withCloseButton: true,
        loading: false,
        message: <div className=''>
          <p className='text-green-500 text-xs font-semibold'>Deposit {token_a.symbol}-{token_b.symbol} LP successfully!</p>
        </div>,
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
        classNames: {
          body: "dark:text-slate-300 text-slate-700 font-medium",
          root: 'mt-2',
          closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
          description: 'dark:text-slate-300 text-slate-700 mt-2'
        },
        autoClose: 5000,
      });
      return true
    }
  } catch (error) {
    notifications.update({
      id,
      color: 'red',
      title: `Deposit ${token_a.symbol}-${token_b.symbol} LP`,
      message: <p className='text-sm text-red-500 line-clamp-1'>{error?.toString()}</p>,
      icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      loading: false,
      withCloseButton: true,
      autoClose: 5000,
      className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
      classNames: {
        body: "dark:text-slate-300 text-slate-700 font-medium",
        root: 'mt-2',
        closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
        description: 'dark:text-slate-300 text-slate-700 mt-2'
      },
    });
    return false;
  }
}

export const WithdrawFarmLP = async ({ token_a, token_b, farm_pool_info, withdraw_amount, userAddress, signer, sails, is_harvest }:
  { token_a: COIN_METADATA; token_b: COIN_METADATA; farm_pool_info: FARM_POOL_METADATA, withdraw_amount: string; userAddress: any; signer: Signer; sails: SailsCalls, is_harvest?: boolean }) => {

  const noti_title = is_harvest ? `Harvest ` : `Withdraw ${token_a.symbol}-${token_b.symbol} LP`
  const id = notifications.show({
    loading: true,
    title: noti_title,
    message: `Processing ...`,
    autoClose: false,
    withCloseButton: false,
    className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
    classNames: {
      body: "dark:text-slate-300 text-slate-700 font-medium",
      root: 'mt-2',
      closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
      description: 'dark:text-slate-300 text-slate-700 mt-2'
    },
  });

  try {

    let url_command = `${farm_pool_info?.farm_contract_address}/LpStakingService/Withdraw`;
    let methodName = 'Withdraw'
    let args = [
      withdraw_amount
    ]
    let value = '0'
    console.log('args', args)
    const approve_response = await send_message(url_command, {
      methodName,
      args,
      value
    }, () => {
      console.log('Message to send is loading');
    }, async () => {
      console.log('Approve successfully!');
    }, () => {
      console.log('An error ocurred!');
    }, { userAddress, signer }, sails);
    console.log('approve_response', approve_response)
    if (!!approve_response?.err) {
      notifications.update({
        id,
        color: 'red',
        title: noti_title,
        message: <p className='text-sm text-red-500 line-clamp-1'>{`An error occurred please try again!`}</p>,
        icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        withCloseButton: true,
        autoClose: 5000,
        className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
        classNames: {
          body: "dark:text-slate-300 text-slate-700 font-medium",
          root: 'mt-2',
          closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
          description: 'dark:text-slate-300 text-slate-700 mt-2'
        },
      });
      return false;
    } else {
      notifications.update({
        id,
        color: 'green',
        title: noti_title,
        withCloseButton: true,
        loading: false,
        message: <div className=''>
          {is_harvest ? <p className='text-green-500 text-xs font-semibold'>Harvest successfully!</p> : <p className='text-green-500 text-xs font-semibold'>Withdraw {token_a.symbol}-{token_b.symbol} LP successfully!</p>}
        </div>,
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
        classNames: {
          body: "dark:text-slate-300 text-slate-700 font-medium",
          root: 'mt-2',
          closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
          description: 'dark:text-slate-300 text-slate-700 mt-2'
        },
        autoClose: 5000,
      });
      return true
    }
  } catch (error) {
    notifications.update({
      id,
      color: 'red',
      title: noti_title,
      message: <p className='text-sm text-red-500 line-clamp-1'>{error?.toString()}</p>,
      icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
      loading: false,
      withCloseButton: true,
      autoClose: 5000,
      className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
      classNames: {
        body: "dark:text-slate-300 text-slate-700 font-medium",
        root: 'mt-2',
        closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
        description: 'dark:text-slate-300 text-slate-700 mt-2'
      },
    });
    return false;
  }
}
