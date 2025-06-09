'use client'
import { WVARA } from '@/containers/router_sdk/core';
import { getUserSigner, WrapOrUnwrapVara } from '@/containers/Swap/utils';
import { useConnectWallet } from '@/context/useConnectWallet';
import { BigNumber } from '@/helpers/big_number_cal';
import { formatAmountWithFixed } from '@/helpers/format_number_display';
import { Modal, Button } from '@mantine/core';
import { useState } from 'react';

interface WrapUnwrapModalProps {
  opened: boolean;
  onClose: () => void;
}

const WrapUnwrapModal = ({ opened, onClose }: WrapUnwrapModalProps) => {
  const [amount, setAmount] = useState('0');
  const [isReverse, setIsReverse] = useState(false);
  const { balances , accountConnected, getBalances} = useConnectWallet();

  const varaBalance = formatAmountWithFixed(BigNumber.parseNumberToOriginal(balances?.NATIVE?.amount ?? 0, balances?.NATIVE?.decimals ?? 12),2) ?? '0.00';
  const wvaraBalance = formatAmountWithFixed(BigNumber.parseNumberToOriginal(balances?.[WVARA[1].address]?.amount ?? 0, balances?.[WVARA[1].address]?.decimals ?? 12),2) ?? '0.00';
  const rawVaraBalance = BigNumber.parseNumberToOriginal(balances?.NATIVE?.amount ?? 0, balances?.NATIVE?.decimals ?? 12) ?? 0;
  const rawWvaraBalance = BigNumber.parseNumberToOriginal(balances?.[WVARA[1].address]?.amount ?? 0, balances?.[WVARA[1].address]?.decimals ?? 12) ?? 0;

 
  const handleWrap = async () => {
    const [userAddress, signer] = await getUserSigner({
      address: accountConnected?.address,
      source: accountConnected?.meta?.source
    })
    const contract_id = WVARA[1].address
    const isWrap = true
   
    const wrap_or_unwrap_response = await WrapOrUnwrapVara({
      contract_id,
      userAddress,
      signer,
      amount,
      isWrap
    })
    if (!!wrap_or_unwrap_response) {
      getBalances()
    }
  };

  const handleUnwrap = async () => {
    const [userAddress, signer] = await getUserSigner({
      address: accountConnected?.address,
      source: accountConnected?.meta?.source
    })
    const contract_id = WVARA[1].address
    const isWrap = false
    const wrap_or_unwrap_response = await WrapOrUnwrapVara({
      contract_id,
      userAddress,
      signer,
      amount,
      isWrap
    })
    if (!!wrap_or_unwrap_response) {
      getBalances()
    }
  };

  // Input VARA
  const inputVara = (isTop: boolean) => (
    <div className="relative bg-[#232325] border border-[#333] rounded-xl px-4 py-3 flex items-center">
      <input
        className="bg-transparent outline-none text-2xl flex-1 text-white placeholder:text-gray-400"
        placeholder="0.00"
        value={amount}
        onChange={e => !isReverse && setAmount(e.target.value)}
        disabled={isReverse}
        min="0"
        type="text"
      />
      <div className="flex flex-col items-end ml-2">
        <div className="flex items-center gap-1">
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png" alt="VARA" className="w-6 h-6" />
          <span className="text-white font-semibold">VARA</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-xs text-gray-400">
          <span>Balance: {varaBalance}</span>
          {isTop && <span className="text-mainColor cursor-pointer font-semibold ml-1" onClick={() => setAmount(rawVaraBalance.toString())}>MAX</span>}
        </div>
      </div>
    </div>
  );

  // Input WVARA
  const inputWvara = (isTop: boolean) => (
    <div className="relative bg-[#232325] border border-[#333] rounded-xl px-4 py-3 flex items-center">
      <input
        className="bg-transparent outline-none text-2xl flex-1 text-white placeholder:text-gray-400"
        placeholder="0.00"
        value={amount}
        onChange={e => isReverse && setAmount(e.target.value)}
        disabled={!isReverse}
        min="0"
        type="text"
      />
      <div className="flex flex-col items-end ml-2">
        <div className="flex items-center gap-1">
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/28067.png" alt="WVARA" className="w-6 h-6" />
          <span className="text-white font-semibold">WVARA</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-xs text-gray-400">
          <span className='w-full'>Balance: {wvaraBalance}</span>
          {isTop && <span className="text-mainColor cursor-pointer font-semibold ml-1" onClick={() => setAmount(rawWvaraBalance.toString())}>MAX</span>}
        </div>
      </div>
    </div>
  );

  const isAmountValid = !!amount && Number(amount) > 0;
  const isExceedBalance = isReverse
    ? Number(amount) > Number(rawWvaraBalance)
    : Number(amount) > Number(rawVaraBalance);
  const buttonText = !isAmountValid
    ? 'Enter an amount'
    : isExceedBalance
      ? 'Insufficient balance'
      : isReverse
        ? 'Unwrap WVARA'
        : 'Wrap VARA';
  const buttonClass = isAmountValid && !isExceedBalance
    ? 'mt-2 bg-mainColor text-white text-lg font-semibold cursor-pointer border-none'
    : 'mt-2 bg-[#333] text-gray-400 text-lg font-semibold cursor-not-allowed border-none';

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<span className="font-bold text-xl">Wrap/Unwrap VARA</span>}
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
      radius="md"
      classNames={{ body: 'bg-[#232325] dark:bg-[#232325] p-0' }}
    >
      <div className="p-6 pt-2 flex flex-col gap-4">
        {isReverse ? (
          <>
            {inputWvara(true)}
          
            <div className="flex justify-center -my-2">
              <button
                className="bg-[#232325] border border-[#333] rounded-full p-2 hover:bg-[#2c2c2e] transition"
                onClick={() => setIsReverse(r => !r)}
                aria-label="Đảo chiều"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {inputVara(false)}
          </>
        ) : (
          <>
            {inputVara(true)}
         
            <div className="flex justify-center -my-2">
              <button
                className="bg-[#232325] border border-[#333] rounded-full p-2 hover:bg-[#2c2c2e] transition"
                onClick={() => setIsReverse(r => !r)}
                aria-label="Đảo chiều"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {inputWvara(false)}
          </>
        )}
        {/* Gas fee */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2h-4V2H7zm0 4v2h10V6H7zm-2 4v10h14V10H5zm2 2h2v2H7v-2zm4 0h2v2h-2v-2z"/></svg>
          {'< $0.01'}
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2"/><path d="M12 8v4" stroke="#888" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="#888"/></svg>
        </div>
       
        <Button
          fullWidth
          radius="xl"
          size="md"
          disabled={!isAmountValid || isExceedBalance}
          className={buttonClass}
          onClick={isAmountValid && !isExceedBalance ? (isReverse ? handleUnwrap : handleWrap) : undefined}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default WrapUnwrapModal; 