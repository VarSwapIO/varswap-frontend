import ButtonConnectWallet from '@/components/Button/ButtonConnectWallet'
import ImageBG from '@/components/Image/ImageBG'
import BlankLink from '@/components/Link/BlankLink'
import { useConnectWallet } from '@/context/useConnectWallet'
import { NAVIGATIONS } from '@/layout/navigation'
import { Burger, Button, Divider, Drawer, NavLink } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import React, { useState } from 'react'
import SwitchMode from './SwitchMode'
import UserAuthHeader from './UserAuthHeader'
import WrapUnwrapModal from './WrapUnwrapModal'

const HeaderRight = () => {
  const { connected } = useConnectWallet()
  const [opened, { toggle, close }] = useDisclosure();
  const [modalOpened, setModalOpened] = useState(false)
  return (
    <>
      <div className='flex justify-center items-center gap-2'>
        {!connected ? <div className='flex items-center gap-1'>
          <ButtonConnectWallet />
        </div> : 
        <div className='flex items-center gap-2'>
          <UserAuthHeader />
          <Button
            size="xs"
            radius="xl"
            className="font-semibold cursor-pointer  border-slate-200/60 dark:border-slate-700 shadow-sm dark:bg-slate-900/80 p-1 rounded-full px-2 flex items-center gap-2"
            onClick={() => setModalOpened(true)}
          >
            <span className="font-semibold text-white">Wrap/Unwrap Vara</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M7.293 17.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L8.586 14H4a1 1 0 1 0 0 2h4.586l-1.293 1.293zm9.414-10.586a1 1 0 0 0-1.414-1.414l-3 3a1 1 0 0 0 0 1.414l3 3a1 1 0 1 0 1.414-1.414L15.414 10H20a1 1 0 1 0 0-2h-4.586l1.293-1.293z"
              />
            </svg>
          </Button>
        </div>}
        <div className='lg:block hidden'>
          <SwitchMode />
        </div>
      </div>
      <div className='lg:hidden  ml-2 flex justify-center items-center'>
        <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
        <Drawer opened={opened} onClose={close} position='right' title="VarSwap" classNames={{
          title: 'text-3xl font-extrabold !text-mainColor',
          content: 'dark:bg-slate-900',
          header: 'dark:bg-slate-900'
        }}>
          <div>
            {NAVIGATIONS.map((navlink: ROUTER_NAV) => {
              return (
                <NavLink
                  component={Link}
                  key={navlink.title}
                  href={navlink.href}
                  label={navlink.title}
                  target={navlink?.is_blank ? '_blank' : '_parent'}
                  childrenOffset={6}
                  className="font-semibold"
                >
                  {
                    navlink.childrens?.map((navchild: NAV_CHILD) =>
                      <NavLink
                        component={Link}
                        key={navchild.title}
                        href={navchild.href}
                        label={navchild.title}
                        target={navchild?.is_blank ? '_blank' : '_parent'}
                        className="font-medium"
                        leftSection={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M12 7.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M4.5 15a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m7.5-1.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m6 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M16.5 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M6 7.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"></path></g></svg>}
                      />
                    )
                  }
                </NavLink>
              )
            })}
          </div>
          <Divider my="md" className='dark:border-t-slate-700 ' />
          <div className='flex items-center justify-between'>
            <SwitchMode />
            <div className="flex gap-2 items-center">
              <BlankLink link="#">
                <ImageBG
                  src="/images/icons/telegram.svg"
                  alt="Vercel Logo"
                  width={28}
                  height={28}
                  priority
                />
              </BlankLink>
              <BlankLink link="#">
                {" "}
                <ImageBG
                  src="/images/icons/twitter.svg"
                  alt="Vercel Logo"
                  width={28}
                  height={28}
                  priority
                />
              </BlankLink>
              <BlankLink link="#">
                {" "}
                <ImageBG
                  src="/images/icons/discord.svg"
                  alt="Vercel Logo"
                  width={28}
                  height={28}
                  priority
                />
              </BlankLink>
              <BlankLink link="#">
                {" "}
                <ImageBG
                  src="/images/icons/facebook.svg"
                  alt="Vercel Logo"
                  width={28}
                  height={28}
                  priority
                />
              </BlankLink>
            </div>
          </div>
        </Drawer>
      </div>
      <WrapUnwrapModal opened={modalOpened} onClose={() => setModalOpened(false)} />
    </>
  )
}

export default HeaderRight