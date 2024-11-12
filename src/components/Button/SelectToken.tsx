import { Button } from '@mantine/core';
import React, { useState } from 'react'
import ImageBG from '../Image/ImageBG';
import ModalTokenSelect from '../Modal/ModalTokenSelect';

interface InputSelectToken {
  onChangeToken?: (token: COIN_METADATA) => void;
  token?: COIN_METADATA;
  disable?: boolean;
  disableSelectToken?: boolean;
}

const SelectToken = ({ onChangeToken, token, disableSelectToken }: InputSelectToken) => {
  const [modalSelectToken, setModalSelectToken] = useState(false)
  return (
    <>
      {token?.name ? (
        <div
          onClick={() => !disableSelectToken && setModalSelectToken(true)}
          className={'cursor-pointer shadow-md flex justify-center gap-2 items-center font-semibold rounded-full w-fit p-1 py-2 text-center text-sm min-w-[150px] text-black dark:text-white dark:bg-slate-800 bg-white dark:hover:bg-slate-900 hover:bg-slate-200'}>
          <ImageBG
            className="!w-6 !h-6 rounded-full bg-white object-cover"
            src={token.icon}
            alt="token"
            width={24}
            height={24}
          />
          {token.symbol}
          {!disableSelectToken && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>}
        </div>
      ) : (
        <Button className="font-semibold bg-mainColor hover:bg-mainColor/80 text-sm text-white rounded-3xl w-fit p-3 py-2 text-center min-w-[120px] flex items-center gap-2 justify-center" onClick={() => setModalSelectToken(true)}>
          {'Select a token'}
          {!disableSelectToken && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>}
        </Button>
      )}
      <ModalTokenSelect
        tokenSelected={token}
        show={modalSelectToken}
        onClick={(token: any) => {
          onChangeToken && onChangeToken(token);
          setModalSelectToken(false);
        }}
        onClose={() => setModalSelectToken(false)}
      />
    </>
  )
}

export default SelectToken