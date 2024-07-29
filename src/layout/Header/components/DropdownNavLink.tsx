import { Group, HoverCard, Menu, Text, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import SubNavLink from './SubNavLink';

const DropdownNavLink = ({ navlink }: { navlink: ROUTER_NAV }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(false)
  const { colorScheme } = useMantineColorScheme()

  const active = navlink?.href === pathname || navlink?.similar_links?.includes(pathname) || (navlink?.start_child_link && pathname?.includes(navlink?.start_child_link))
  if (navlink?.is_blank) {
    return (
      <div className='h-[48px] flex justify-center items-center group cursor-pointer hover:bg-mainColor/10 px-2'>
        <a
          key={navlink.id}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold no-underline dark:group-hover:text-mainColor group-hover:text-mainColor text-gray-700 dark:text-gray-50`}
          href={navlink.href}
        >
          {navlink?.title}
        </a>
      </div>
    )
  }

  return (
    <Menu position="bottom-start"
      offset={5}
      trigger="hover"
      loop={false}
      withinPortal={false}
      trapFocus={false}
      menuItemTabIndex={0}
      onChange={(opened: boolean) => setOpenDropdown(opened)}
    >
      {/* Menu items */}
      < Menu.Target >
        <div className={`h-[48px] group cursor-pointer px-2 flex flex-col justify-center items-center relative`}>
          <div
            className={`flex justify-center items-center font-semibold no-underline  text-gray-700 dark:text-gray-50`}
          >
            <Link
              key={navlink.id}
              className={`font-semibold no-underline  text-gray-700 dark:text-gray-50`}
              href={navlink.href}
            >
              {navlink?.title}
            </Link>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 dark:group-hover:text-mainColor group-hover:text-mainColor group-hover:rotate-180 transition-all duration-200 ${openDropdown ? 'text-mainColor dark:text-mainColor rotate-180' : ''}`} viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z"></path></svg>
          </div>
          <p className={`h-[2px] ${active || openDropdown ? 'w-full' : 'w-0 '} group-hover:w-full group-hover:mr-auto group-hover:ml-0 ml-auto transition-all duration-300 absolute left-0 right-0 bottom-0.5 
      bg-gradient-to-r to-mainColor from-cyan-500`}></p>
        </div>
      </Menu.Target >
      <Menu.Dropdown w={'160px'} className="border-none bg-white p-0 dark:bg-slate-700 rounded-2xl">
        <div className={`w-full h-full shadow-sm rounded-2xl p-2 space-y-1 ${colorScheme === 'light' ? 'bg-white' : ''}`}>
          {navlink?.childrens?.map((nav_child: NAV_CHILD) => {
            return (
              <SubNavLink key={nav_child.id} sub_nav_link={nav_child} />
            )
          })}
        </div>
      </Menu.Dropdown>
    </Menu >
  );
}

export default DropdownNavLink