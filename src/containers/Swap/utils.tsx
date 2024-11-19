import { BigNumber } from "@/helpers/big_number_cal";
import { decodeAddress, HexString } from '@gear-js/api';
import { Signer } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import JSBI from "jsbi";
import { calculate_best_trade_exact_in, get_all_pairs, Router, send_message } from "../router_sdk";
import { CONTRACT_DATA, LPR_IDL, NETWORK, VFT_IDL } from "../router_sdk/constants";
import { ChainId, CurrencyAmount, Percent, Token, Vara } from "../router_sdk/core";
import SailsCalls from "../router_sdk/SailsCalls";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { AMOUNT_ADD_LIQUIDITY, convertNativeToAddress } from "@/helpers/pools";
import ImageBG from "@/components/Image/ImageBG";

type EXAC_IN_SWAP_PROPS = {
    fromToken: COIN_METADATA;
    toToken: COIN_METADATA;
    fromTokenAmount: string;
    slippage: number,
    walletAddress: string;
}

export const getUserSigner = ({ address, source }: { address: any, source?: string }): Promise<[HexString, Signer]> => {
    return new Promise(async (resolve, reject) => {
        if (!address || !source) {
            console.log("Accounts not ready!");
            reject('Account not ready!');
            return;
        }
        const { signer } = await web3FromSource(source);
        resolve([address, signer]);
    })
}

export const approveToken = async (contract_id: string, value: string, userAddress: any, signer: Signer, token_info?: COIN_METADATA) => {
    console.log('token_info', value, token_info)
    const id = notifications.show({
        loading: true,
        title: `Approve ${token_info?.symbol} for transaction`,
        message: `Confirming use of ${BigNumber.parseNumberToOriginal(value, token_info?.decimals)} ${token_info?.symbol}`,
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
        const vft_sails = await SailsCalls.new({
            network: NETWORK,
            idl: VFT_IDL,
            contractId: contract_id as any,
        });

        const approve_payload = {
            value: '0',
            args: [
                CONTRACT_DATA.programId,
                value
            ]
        }

        const url_vft_command = `${contract_id}/Vft/Approve`
        const approve_response = await send_message(url_vft_command, approve_payload, () => {
            console.log('Message to send is loading');
        }, async () => {
            console.log('Approve successfully!');
        }, () => {
            console.log('An error ocurred!');
        }, { userAddress, signer }, vft_sails);
        console.log('approve_response', approve_response)
        if (!approve_response) {
            notifications.update({
                id,
                color: 'red',
                title: `Approve ${token_info?.symbol} for transaction`,
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
                title: `Approve ${token_info?.symbol} for transaction`,
                withCloseButton: true,
                loading: false,
                message: <div className=''>
                    <p className='text-green-500 text-xs font-semibold'>Approve successfully!</p>
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
            title: `Approve ${token_info?.symbol} for transaction`,
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

export const approveLPToken = async (contract_id: string, value: string, userAddress: any, signer: Signer, token_info?: COIN_METADATA) => {
    console.log('token_info', value, token_info)
    const id = notifications.show({
        loading: true,
        title: `Approve ${token_info?.symbol} for transaction`,
        message: `Confirming use of ${BigNumber.parseNumberToOriginal(value, token_info?.decimals)} ${token_info?.symbol}`,
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
        const vft_sails = await SailsCalls.new({
            network: NETWORK,
            idl: LPR_IDL,
            contractId: contract_id as any,
        });

        const approve_payload = {
            value: '0',
            args: [
                CONTRACT_DATA.programId,
                value
            ]
        }

        const url_vft_command = `${contract_id}/LpService/Approve`
        const approve_response = await send_message(url_vft_command, approve_payload, () => {
            console.log('Message to send is loading');
        }, async () => {
            console.log('Approve successfully!');
        }, () => {
            console.log('An error ocurred!');
        }, { userAddress, signer }, vft_sails);
        console.log('approve_response', approve_response)
        if (!approve_response) {
            notifications.update({
                id,
                color: 'red',
                title: `Approve ${token_info?.symbol} for transaction`,
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
                title: `Approve ${token_info?.symbol} for transaction`,
                withCloseButton: true,
                loading: false,
                message: <div className=''>
                    <p className='text-green-500 text-xs font-semibold'>Approve successfully!</p>
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
            title: `Approve ${token_info?.symbol} for transaction`,
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

export const CreateLiquidityPair = async ({ token_a, token_b, userAddress, signer, sails }:
    { token_a: COIN_METADATA; token_b: COIN_METADATA; userAddress: any; signer: Signer; sails: SailsCalls }) => {

    const id = notifications.show({
        loading: true,
        title: `Create ${token_a.symbol}-${token_b.symbol} LP`,
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

        let url_command = `${CONTRACT_DATA.programId}/RouterService/CreatePair`;
        let methodName = 'CreatePair'
        let args = [
            convertNativeToAddress(token_a?.address),
            convertNativeToAddress(token_b?.address)
        ]
        let value = '1000000000000'
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
                title: `Create ${token_a.symbol}-${token_b.symbol} LP`,
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
                title: `Create ${token_a.symbol}-${token_b.symbol} LP`,
                withCloseButton: true,
                loading: false,
                message: <div className=''>
                    <p className='text-green-500 text-xs font-semibold'>Create {token_a.symbol}-{token_b.symbol} LP successfully!</p>
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
            title: `Create ${token_a.symbol}-${token_b.symbol} LP`,
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

export const RemoveLiquidity = async ({ token_a, token_b, userAddress, signer, sails, amount_liquidity, decoded_address }:
    { token_a: COIN_METADATA; token_b: COIN_METADATA; amount_liquidity: AMOUNT_ADD_LIQUIDITY; userAddress: any; signer: Signer; sails: SailsCalls, decoded_address: string }) => {

    const id = notifications.show({
        loading: true,
        title: `Remove ${token_a.symbol}-${token_b.symbol} LP`,
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


        const deadline = (Math.floor(new Date().getTime()) + 50000 * 1000)
        let url_command = `${CONTRACT_DATA.programId}/RouterService/RemoveLiquidity`;
        let methodName = 'RemoveLiquidity'
        let args = [
            token_a?.address,
            token_b?.address,
            amount_liquidity.lp_amount?.toString(),
            amount_liquidity.token_in,
            amount_liquidity.token_out,
            decoded_address,
            deadline
        ]
        let value = '0'

        if (token_a?.address === 'NATIVE') {
            url_command = `${CONTRACT_DATA.programId}/RouterService/RemoveLiquidityVara`;
            methodName = `RemoveLiquidityVara`
            args = [
                token_b?.address,
                amount_liquidity.lp_amount,
                amount_liquidity.token_out,
                amount_liquidity.token_in,
                decoded_address,
                deadline
            ]
            value = '0'
        }

        if (token_b?.address === 'NATIVE') {
            url_command = `${CONTRACT_DATA.programId}/RouterService/RemoveLiquidityVara`;
            methodName = `RemoveLiquidityVara`
            args = [
                token_a?.address,
                amount_liquidity.lp_amount,
                amount_liquidity.token_in,
                amount_liquidity.token_out,
                decoded_address,
                deadline
            ]
            value = '0'
        }
        console.log(' methodName ', methodName,
            args,
            value);
        let block_current: string | undefined = undefined
        const remove_lp_response = await send_message(url_command, {
            methodName,
            args,
            value
        }, () => {
            console.log('Message to send is loading');
        }, (block) => {
            block_current = block
        }, () => {

        }, {
            userAddress, signer
        }, sails);
        console.log('remove_lp_response', remove_lp_response)
        if (!!remove_lp_response?.ok) {
            notifications.update({
                id,
                color: 'green',
                withCloseButton: true,
                loading: false,
                title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                    <ImageBG
                        src={token_a?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <ImageBG
                        src={token_b?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
                </div>,
                message: <div className=''>
                    <p className='text-green-500 text-xs font-semibold'>Remove {token_a?.symbol} - {token_b?.symbol} liquidity successful</p>
                    <div className='text-[10px] flex justify-end items-center gap-2 text-mainColor hover:text-mainColor/80 w-fit ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' viewBox="0 0 24 24"><path fill="currentColor" d="M18 10.82a1 1 0 0 0-1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h7.18a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-7.18a1 1 0 0 0-1-1m3.92-8.2a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59L8.29 14.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38"></path></svg>
                        <a
                            href={`https://idea.gear-tech.io/explorer/${block_current}`}
                            target={"_blank"}
                            rel="noopener noreferrer"
                            className='font-semibold'
                        >View transaction </a>
                    </div>
                </div>,
                className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
                classNames: {
                    body: "dark:text-slate-300 text-slate-700 font-medium",
                    root: 'mt-2',
                    closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                    description: 'dark:text-slate-300 text-slate-700 mt-2'
                },
                autoClose: 5000,
            });
            return true;
        } else {
            notifications.update({
                id,
                color: 'red',
                title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                    <ImageBG
                        src={token_a?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <ImageBG
                        src={token_b?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
                </div>,
                withCloseButton: true,
                loading: false,
                message: <p className='text-sm text-red-500 line-clamp-1'>{`An error occurred please try again!`}</p>,
                icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                autoClose: 5000,
                className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
                classNames: {
                    body: "dark:text-slate-300 text-slate-700 font-medium",
                    root: 'mt-2',
                    closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                    description: 'dark:text-slate-300 text-slate-700 mt-2'
                },
            });
            return false
        }
    } catch (error) {
        notifications.update({
            id,
            color: 'red',
            title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                <ImageBG
                    src={token_a?.icon || ''}
                    alt="product-logo"
                    width={23}
                    height={23}
                    className="w-[23px] h-[23px] rounded-full object-cover"
                />
                <ImageBG
                    src={token_b?.icon || ''}
                    alt="product-logo"
                    width={23}
                    height={23}
                    className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                />
                <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
            </div>,
            withCloseButton: true,
            loading: false,
            message: <p className='text-sm text-red-500 line-clamp-1'>{error?.toString() || `An error occurred please try again!`}</p>,
            icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
            autoClose: 5000,
            className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
            classNames: {
                body: "dark:text-slate-300 text-slate-700 font-medium",
                root: 'mt-2',
                closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                description: 'dark:text-slate-300 text-slate-700 mt-2'
            },
        });
        return false
    }
}

export const AddLiquidity = async ({ token_a, token_b, userAddress, signer, sails, amount_liquidity, decoded_address }:
    { token_a: COIN_METADATA; token_b: COIN_METADATA; amount_liquidity: AMOUNT_ADD_LIQUIDITY; userAddress: any; signer: Signer; sails: SailsCalls, decoded_address: string }) => {

    const id = notifications.show({
        loading: true,
        title: `Add ${token_a.symbol}-${token_b.symbol} LP`,
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
        const amount_x = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_in || 0), token_a?.decimals) || '0'
        const amount_y = BigNumber.parseNumberWithDecimals(+(amount_liquidity.token_out || 0), token_b?.decimals) || "0"

        const deadline = (Math.floor(new Date().getTime()) + 50000 * 1000)
        let url_command = `${CONTRACT_DATA.programId}/RouterService/AddLiquidity`;
        let methodName = 'AddLiquidity'
        let args = [
            token_a?.address,
            token_b?.address,
            amount_x,
            amount_y,
            amount_liquidity.minimum_input?.toString(),
            amount_liquidity.minimum_output?.toString(),
            decoded_address,
            deadline
        ]
        let value = '0'

        if (token_a?.address === 'NATIVE') {
            url_command = `${CONTRACT_DATA.programId}/RouterService/AddLiquidityVara`;
            methodName = `AddLiquidityVara`
            args = [
                token_b?.address,
                amount_y,
                amount_liquidity.minimum_output?.toString(),
                amount_liquidity.minimum_input?.toString(),
                decoded_address,
                deadline
            ]
            value = amount_x
        }

        if (token_b?.address === 'NATIVE') {
            url_command = `${CONTRACT_DATA.programId}/RouterService/AddLiquidityVara`;
            methodName = `AddLiquidityVara`
            args = [
                token_a?.address,
                amount_x,
                amount_liquidity.minimum_input?.toString(),
                amount_liquidity.minimum_output?.toString(),
                decoded_address,
                deadline
            ]
            value = amount_y
        }
        console.log(' methodName ', methodName,
            args,
            value);
        let block_current: string | undefined = undefined
        const add_lp_response = await send_message(url_command, {
            methodName,
            args,
            value
        }, () => {
            console.log('Message to send is loading');
        }, (block) => {
            block_current = block
        }, () => {

        }, {
            userAddress, signer
        }, sails);
        if (!!add_lp_response) {
            notifications.update({
                id,
                color: 'green',
                withCloseButton: true,
                loading: false,
                title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                    <ImageBG
                        src={token_a?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <ImageBG
                        src={token_b?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
                </div>,
                message: <div className=''>
                    <p className='text-green-500 text-xs font-semibold'>Add {token_a?.symbol} - {token_b?.symbol} liquidity successful</p>
                    <div className='text-[10px] flex justify-end items-center gap-2 text-mainColor hover:text-mainColor/80 w-fit ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' viewBox="0 0 24 24"><path fill="currentColor" d="M18 10.82a1 1 0 0 0-1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h7.18a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-7.18a1 1 0 0 0-1-1m3.92-8.2a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59L8.29 14.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38"></path></svg>
                        <a
                            href={`https://idea.gear-tech.io/explorer/${block_current}`}
                            target={"_blank"}
                            rel="noopener noreferrer"
                            className='font-semibold'
                        >View transaction </a>
                    </div>
                </div>,
                className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
                classNames: {
                    body: "dark:text-slate-300 text-slate-700 font-medium",
                    root: 'mt-2',
                    closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                    description: 'dark:text-slate-300 text-slate-700 mt-2'
                },
                autoClose: 5000,
            });
            return true;
        } else {
            notifications.update({
                id,
                color: 'red',
                title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                    <ImageBG
                        src={token_a?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <ImageBG
                        src={token_b?.icon || ''}
                        alt="product-logo"
                        width={23}
                        height={23}
                        className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                    />
                    <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
                </div>,
                withCloseButton: true,
                loading: false,
                message: <p className='text-sm text-red-500 line-clamp-1'>{`An error occurred please try again!`}</p>,
                icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
                autoClose: 5000,
                className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
                classNames: {
                    body: "dark:text-slate-300 text-slate-700 font-medium",
                    root: 'mt-2',
                    closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                    description: 'dark:text-slate-300 text-slate-700 mt-2'
                },
            });
            return false
        }
    } catch (error) {
        notifications.update({
            id,
            color: 'red',
            title: <div className='flex gap-2 items-center font-semibold dark:text-white text-slate-900'>
                <ImageBG
                    src={token_a?.icon || ''}
                    alt="product-logo"
                    width={23}
                    height={23}
                    className="w-[23px] h-[23px] rounded-full object-cover"
                />
                <ImageBG
                    src={token_b?.icon || ''}
                    alt="product-logo"
                    width={23}
                    height={23}
                    className="-ml-4 w-[23px] h-[23px] rounded-full object-cover"
                />
                <p className='text-white font-semibold'>{token_a?.symbol} - {token_b?.symbol}</p>
            </div>,
            withCloseButton: true,
            loading: false,
            message: <p className='text-sm text-red-500 line-clamp-1'>{error?.toString() || `An error occurred please try again!`}</p>,
            icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
            autoClose: 5000,
            className: 'dark:bg-slate-800 bg-white shadow-md rounded-xl',
            classNames: {
                body: "dark:text-slate-300 text-slate-700 font-medium",
                root: 'mt-2',
                closeButton: 'dark:hover:bg-slate-700 absolute right-2 top-2',
                description: 'dark:text-slate-300 text-slate-700 mt-2'
            },
        });
        return false
    }
}

export const coinToCurrency = (token: COIN_METADATA) => {
    return token.address === "NATIVE" ? Vara.onChain(ChainId.TESTNET) : new Token(
        ChainId.TESTNET,
        token.address,
        token.decimals,
        token.symbol,
        token.name,
    )
}
export const ExactInSwapQuote = async (data: EXAC_IN_SWAP_PROPS) => {
    const sails = await SailsCalls.new({
        network: NETWORK,
        idl: CONTRACT_DATA.idl,
        contractId: CONTRACT_DATA.programId,
    });

    const currency_in = coinToCurrency(data.fromToken);
    const currency_out = coinToCurrency(data.toToken);
    const amount_in_decimals = BigNumber.parseNumberWithDecimals(data.fromTokenAmount, data.fromToken.decimals) || '0'
    const amount_in = CurrencyAmount.fromRawAmount(currency_in, JSBI.BigInt(amount_in_decimals));

    const all_pairs = await get_all_pairs(currency_in, currency_out, sails);
    const best_trades = calculate_best_trade_exact_in(all_pairs, amount_in, currency_out);
    if (!best_trades) {
        console.log('No best trade found');
        return {
            amount_in: amount_in_decimals,
            amount_out: '0',
            amount_out_formatted: '0',
            amount_in_formatted: data.fromTokenAmount,
            formatted_price1: '0',
            formatted_price2: "0",
            minimum_received: '0',
            price_impact: 0,
            router: undefined,
            payload: undefined
        };
    }
    const payload = Router.swapCallParameters(best_trades, {
        ttl: 50000 * 1000,
        allowedSlippage: new Percent(data.slippage, 10000), // slippage 1%
        recipient: data.walletAddress as string
    })
    const amount_in_string = best_trades?.inputAmount.quotient.toString();
    const amount_out_string = best_trades?.outputAmount.quotient.toString();

    const minimum_received: any = best_trades.minimumAmountOut(new Percent(data.slippage, 10000))?.quotient?.toString();
    let formatted_price1 = (+amount_out_string / +amount_in_string)?.toFixed(6);
    let formatted_price2 = (+amount_in_string / +amount_out_string)?.toFixed(6);
    console.log('best_trades :>> ', best_trades);
    let price_impact = +(+(best_trades?.priceImpact?.quotient?.toString() || 0) / 10 ** 6)?.toFixed(4);

    return {
        amount_in: amount_in_string,
        amount_out: amount_out_string,
        amount_out_formatted: BigNumber.parseNumberToOriginal(amount_out_string, currency_out.decimals) || '0',
        amount_in_formatted: BigNumber.parseNumberToOriginal(amount_in_string, currency_in.decimals) || '0',
        formatted_price1,
        formatted_price2,
        minimum_received: BigNumber.parseNumberToOriginal(minimum_received, currency_out.decimals) || '0',
        price_impact,
        router: best_trades?.route,
        payload: payload
    }
}

export const router_client = {
    ExactInSwapQuote,
    CreateLiquidityPair,
    AddLiquidity,
    RemoveLiquidity
}