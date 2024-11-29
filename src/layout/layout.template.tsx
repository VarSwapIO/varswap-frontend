'use client';
import { ENV_VARSWAP } from '@/config/env';
import ConnectWalletProvider from '@/context/useConnectWallet';
import { VaraAccountProvider, VaraAlertProvider, VaraAPIProvider } from '@/libraries/vara-gear';
import { Container, useMantineColorScheme } from '@mantine/core'
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import Footer from './Footer'
import Header from './Header'

const ModalConnectWallet = dynamic(() => import('@/wallet-provider/ModalConnectWallet'), {
  loading: () => <p>Loading...</p>,
})


const LayoutTemplate = ({ children }: { children: any }) => {
  const { colorScheme } = useMantineColorScheme()

  return (
    <VaraAccountProvider >
      <VaraAPIProvider initialArgs={{ endpoint: ENV_VARSWAP.NETWORK }}>
        <VaraAlertProvider >
          <ConnectWalletProvider>
            <div className='relative'>
              <div className='w-screen h-screen fixed inset-0 transform-none dark:hidden bg-gradient-custom '></div>
              <div className='w-screen h-screen fixed inset-0 transform-none hidden dark:block bg-gradient-custom-dark'></div>
              <ToastContainer
                position="bottom-left"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={colorScheme}
              />
              <Header />
              <Container px={0} fluid className='min-h-[79vh] relative' >
                {children}
              </Container>
              <Footer />
              <ModalConnectWallet />
            </div>
          </ConnectWalletProvider>
        </VaraAlertProvider>
      </VaraAPIProvider>
    </VaraAccountProvider>

  )
}

export default LayoutTemplate