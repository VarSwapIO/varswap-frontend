import { useConnectWallet } from '@/context/useConnectWallet';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatNumberDisplay } from '@/helpers/format_number_display';
import { useAssetStore } from '@/stores/assetStore';
import { Input, Loader, Modal, Tooltip } from '@mantine/core';
import React, { FC, useCallback, useEffect, useRef, useState, memo } from 'react';
import ImageBG from '../Image/ImageBG';
import _ from 'lodash'
import { FixedSizeList as List } from "react-window";
import { getTokenMetadata } from '@/services/token.services';

export interface ModalTokenSelectProps {
  show: boolean;
  onClick: (token: any) => void;
  onClose: () => void;
  tokenSelected?: any;
}

const ModalTokenSelect: FC<ModalTokenSelectProps> = ({ show, onClick, onClose, tokenSelected }) => {
  const { cointype_by_chain_arr, updateCoinTypeByChain } = useAssetStore();
  const { balances } = useConnectWallet();

  const [listToken, setListToken] = useState<TOKEN_METADATA[]>([])

  const [loadingCheckToken, setLoadingCheckToken] = useState(false);

  useEffect(() => {
    if (!show) {
      if (cointype_by_chain_arr?.['VARA']?.length > 0) {
        setListToken(cointype_by_chain_arr?.['VARA'])
      }
    }
  }, [show, cointype_by_chain_arr]);


  const handleSearchToken = async (e: any) => {
    const name = e.target.value?.trim();
    const name_lowcase = name?.toLowerCase();
    if (!name) {
      const list_token = cointype_by_chain_arr.VARA
      setListToken(list_token || [])
    } else {
      const token_filter = cointype_by_chain_arr?.VARA?.filter((x: COIN_METADATA) => {
        if (x?.address?.includes(name) || x?.name?.toLowerCase()?.includes(name_lowcase) || x?.symbol?.includes(name_lowcase)) {
          return true;
        } else {
          return false
        }
      })

      if (name?.length >= 64 && name?.length <= 66) {
        setLoadingCheckToken(true)
        try {
          const check_token = await getTokenMetadata(name)
          console.log('check_token', check_token)
          if (check_token?.symbol) {
            const obj: any = {
              symbol: check_token?.symbol,
              name: check_token?.name ? check_token?.name : check_token?.symbol,
              icon: check_token?.icon || '/images/features/image-placeholder.png',
              decimals: check_token?.decimals,
              address: check_token?.address || name,
              verified: false,
              is_new: true
            }
            setListToken([obj]);
          }
        } catch (error) {
          setListToken([]);
        }
        setLoadingCheckToken(false)
      } else {
        setListToken(token_filter || []);
      }
    }

  };
  const onClickNewToken = (token_new: any) => {
    const token_metadata: COIN_METADATA = {
      symbol: token_new?.symbol,
      name: token_new?.name,
      icon: token_new?.icon || '/images/features/image-placeholder.png',
      decimals: token_new?.decimals,
      address: token_new?.address,
      verified: token_new?.verified,
    }
    if (token_new?.is_new) {
      updateCoinTypeByChain([token_metadata], 'VARA')
    }
    onClick && onClick(token_metadata);
  }

  const Row = ({ data, style, index }: any) => {
    const token_detail = data?.[index] || {}
    const balance_token = balances?.[token_detail?.address]
    return (
      <div style={style} >
        <div onClick={() => {
          onClickNewToken(token_detail);
        }} className={`flex items-end gap-4 p-2 px-4 rounded-xl cursor-pointer ${tokenSelected?.address === token_detail.address ? 'bg-slate-100 dark:bg-slate-700 border border-mainColor' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border dark:border-slate-700'}`}>
          <ImageBG
            className='w-10 h-10 rounded-full bg-white'
            src={token_detail?.icon || '/images/features/image-placeholder.png'}
            alt="token"
            width={40}
            height={40}
          />
          <div className=''>
            <p className='font-semibold flex items-center gap-2 dark:text-white text-slate-900'>
              {token_detail?.symbol}
              {token_detail?.verified && <Tooltip
                label='Verified'
              >
                <svg viewBox="0 0 17 17" fill="none" className='w-4 h-4'>
                  <path
                    d="M7.66691 2.62178C8.12691 2.22845 8.88025 2.22845 9.34691 2.62178L10.4002 3.52845C10.6002 3.70178 10.9736 3.84178 11.2402 3.84178H12.3736C13.0802 3.84178 13.6602 4.42178 13.6602 5.12845V6.26178C13.6602 6.52178 13.8002 6.90178 13.9736 7.10178L14.8802 8.15512C15.2736 8.61512 15.2736 9.36845 14.8802 9.83512L13.9736 10.8884C13.8002 11.0884 13.6602 11.4618 13.6602 11.7284V12.8618C13.6602 13.5684 13.0802 14.1484 12.3736 14.1484H11.2402C10.9802 14.1484 10.6002 14.2884 10.4002 14.4618L9.34691 15.3684C8.88691 15.7618 8.13358 15.7618 7.66691 15.3684L6.61358 14.4618C6.41358 14.2884 6.04025 14.1484 5.77358 14.1484H4.62025C3.91358 14.1484 3.33358 13.5684 3.33358 12.8618V11.7218C3.33358 11.4618 3.19358 11.0884 3.02691 10.8884L2.12691 9.82845C1.74025 9.36845 1.74025 8.62178 2.12691 8.16178L3.02691 7.10178C3.19358 6.90178 3.33358 6.52845 3.33358 6.26845V5.12178C3.33358 4.41512 3.91358 3.83512 4.62025 3.83512H5.77358C6.03358 3.83512 6.41358 3.69512 6.61358 3.52178L7.66691 2.62178Z"
                    fill="#38BDF8"
                    stroke="#38BDF8"
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
              </Tooltip>}
            </p>
            <p className='font-medium text-sm dark:text-slate-400 text-slate-600'>{token_detail?.name}</p>
          </div>
          {+(balance_token?.amount || 0) > 0 && <div className='ml-auto'>
            <p className='text-xs dark:text-white text-slate-800 font-semibold'>Balance: {formatNumberDisplay(BigNumber.parseNumberToOriginal(balance_token?.amount || '0', token_detail?.decimals))} {token_detail.symbol}</p>
          </div>}
        </div>
      </div >
    );
  }

  const renderListToken = useCallback(
    () => {
      return (
        <List
          className="dark:bg-slate-800 rounded-b-lg overflow-hidden scrollbar "
          height={400}
          itemCount={listToken?.length}
          itemSize={70}
          width={'100%'}
          itemData={listToken}
        >
          {(props: any) => <Row key={props?.index} data={props?.data} index={props?.index} style={props?.style} />}
        </List>
      )
    },
    [balances, listToken, tokenSelected],
  )

  const renderContent = () => {
    return (
      <div>
        <div className="mb-4">
          <Input
            size={'sm'}
            leftSection={<svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>}
            variant="filled"
            radius="xl"
            className='md:block hidden'
            classNames={{
              input: `dark:bg-slate-700 bg-slate-100`,
              wrapper: ``
            }}
            placeholder="Search token name or paste address"
            onChange={(e: any) => handleSearchToken(e)}
          />
        </div>
        <div className="border-b dark:border-gray-700 border-gray-200 mb-4 w-full"></div>
        <div className="">
          {loadingCheckToken ? <div className='flex justify-center items-center h-[300px]'>
            <Loader />
          </div> :
            <>
              {listToken?.length > 0 ? renderListToken() : null}
              <>
                {listToken?.length === 0 ? <p className="text-txt-200 dark:text-white text-center mt-4 py-32">No results found</p> : null}
              </>
            </>
          }
        </div>
      </div>
    );
  };

  return (
    <Modal
      size={'lg'}
      opened={show}
      title="Select Token"
      centered
      radius="lg"
      classNames={{
        title: "font-semibold lg:text-2xl dark:text-white",
        header: 'dark:bg-slate-800',
        body: 'dark:bg-slate-800',
        close: 'dark:hover:bg-slate-700'
      }}
      // closeOnClickOutside={false}
      onClose={() => onClose()}
    >
      {renderContent()}
    </Modal>
  );
};

export default memo(ModalTokenSelect);
