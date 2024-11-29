import InputLPToken from '@/components/Button/InputLPToken'
import { MAIN_COLOR } from '@/config/asset';
import { Button, LoadingOverlay, Modal } from '@mantine/core'
import React from 'react'

const ModalStakedLP = ({ opened, close, value, onChange, tokenA, tokenB, lpBalance, type, onSubmit, loading }: MODAL_TYPE & {
  value: string | number;
  tokenA: TOKEN_METADATA;
  tokenB: TOKEN_METADATA;
  lpBalance: number | string;
  type: 'withdraw' | 'stake';
  loading: boolean;
  onChange: (amount: string | number) => void;
  onSubmit: () => void;
}) => {
  return (
    <Modal
      size={'lg'}
      opened={opened}
      title={<p className={`${type === 'stake' ? 'text-mainColor' : 'text-red-500'}`}>{type === 'stake' ? 'Stake LP token' : 'Withdraw LP token'}</p>}
      centered
      radius="lg"
      classNames={{
        title: "font-semibold lg:text-2xl dark:text-white",
        header: 'dark:bg-slate-800',
        body: 'dark:bg-slate-800',
        close: 'dark:hover:bg-slate-700'
      }}
      closeOnClickOutside={false}
      onClose={close}
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 1 }}
        loaderProps={{ color: '#3898ec' }}
      />
      <InputLPToken
        lpBalance={lpBalance}
        tokenA={tokenA}
        tokenB={tokenB}
        type={type}
        value={value}
        onChange={(amount: string | number) => onChange(amount)}
      />
      <div className='flex gap-4 items-center mt-4'>
        <Button
          onClick={() => close()}
          className='font-semibold'
          radius={'xl'}
          w={'100%'}
          size={'sm'}
          color="#EF4344"
          variant={'light'}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit()}
          className='font-semibold '
          w={'100%'}
          size={'sm'}
          color={MAIN_COLOR}
          variant={'light'}
          radius={'xl'}
          style={{
            '--mantine-color-dark-6': '#3e495c', '--mantine-color-dark-3': '#7C8898'
          }}
        >
          {type === 'stake' ? ' Stake' : 'Withdraw'}
        </Button>
      </div>
    </Modal>
  )
}

export default ModalStakedLP