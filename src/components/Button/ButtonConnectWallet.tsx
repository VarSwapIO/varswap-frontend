import { useConnectWallet } from '@/context/useConnectWallet'
import { Button, ButtonProps } from '@mantine/core'
import React from 'react'

const ButtonConnectWallet = ({ ...props }: ButtonProps) => {
  const { onChangeStateModalConnect } = useConnectWallet()
  return (
    <Button
      size={'sm'}
      radius="xl"
      className='font-semibold bg-mainColor  hover:bg-mainColor/80'
      {...props}
      onClick={() => onChangeStateModalConnect(true)}
    >
      Connect Wallet
    </Button>
  )
}

export default ButtonConnectWallet