import { Menu, Tabs, useMantineColorScheme } from '@mantine/core'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const SubNavLink = ({ sub_nav_link }: { sub_nav_link: NAV_CHILD }) => {
  const { colorScheme } = useMantineColorScheme();
  const pathname = usePathname()
  if (sub_nav_link.type === 'TAB_MORE') {
    return (
      <Menu position="right-start"
        offset={0}
        trigger="hover"
        loop={false}
        withinPortal={false}
        trapFocus={false}
        menuItemTabIndex={0}
      >
        {/* Menu items */}
        < Menu.Target >
          <div className='p-2 py-3 rounded-md text-start h-fit hover:bg-mainColor/10 dark:hover:bg-mainColor/10 cursor-pointer group'>
            <div className='flex justify-between items-center'>
              <p className='m-0 text-md font-extrabold dark:text-white group-hover:text-mainColor'>{sub_nav_link.title}</p>
              <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 group-hover:text-mainColor' viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"></path></svg>
            </div>
            <p className='m-0 text-sm dark:text-gray-400'>{sub_nav_link.descriptions}</p>
          </div>
        </Menu.Target >
        <Menu.Dropdown top={-5} w={'280px'} h={'500px'} className="border-none bg-white p-0 dark:bg-slate-900">
          <div className={`w-full h-full shadow-sm rounded-b-md dark:bg-mainColor/10 p-2 space-y-1 ${colorScheme === 'light' ? 'bg-gradient-to-b from-mainColor/5 to-white' : ''}`}>
            <Tabs defaultValue="first">
              <Tabs.List classNames={{
                list: 'before:border-solid before:border-[1px] dark:before:border-slate-700 before:start-0 before:end-0 before:content-[""] before:absolute before:bottom-0',
              }}>
                <Tabs.Tab value="first" className='hover:!bg-mainColor/10 dark:text-white text-gray-500 font-medium dark:hover:border-slate-700'>USDT</Tabs.Tab>
                <Tabs.Tab value="second" className='hover:!bg-mainColor/10 dark:text-white text-gray-500 font-medium dark:hover:border-slate-700'>USDC</Tabs.Tab>
                <Tabs.Tab value="third" className='hover:!bg-mainColor/10 dark:text-white text-gray-500 font-medium dark:hover:border-slate-700'>BTC</Tabs.Tab>
                <Tabs.Tab value="four" className='hover:!bg-mainColor/10 dark:text-white text-gray-500 font-medium dark:hover:border-slate-700'>ETH</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </div>
        </Menu.Dropdown>
      </Menu >

    )
  }
  const active = pathname === sub_nav_link.href
  return (
    <Link href={sub_nav_link?.href} >
      <div className='p-2 py-3 rounded-xl text-start h-fit hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer group'>
        <div className='flex justify-between items-center'>
          <p className={`m-0 text-md font-extrabold ${active ? 'text-mainColor' : 'dark:text-white '}`}>{sub_nav_link.title}</p>
        </div>
        <p className='m-0 text-sm dark:text-gray-400'>{sub_nav_link.descriptions}</p>
      </div>
    </Link>
  )
}

export default SubNavLink