import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
const NavLink = ({ navlink }: { navlink: ROUTER_NAV }) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = navlink?.href === pathname
  if (navlink?.is_blank) {
    return (
      <div className='h-[48px] flex justify-center items-center group cursor-pointer hover:bg-mainColor/5 px-2'>
        <a
          key={navlink.id}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold no-underline dark:group-hover:text-mainColor group-hover:text-mainColor text-gray-700 dark:text-gray-50 `}
          href={navlink.href}
        >
          {navlink?.title}
        </a>
      </div>
    )
  }

  return (
    <Link
      key={navlink.id}
      href={navlink.href}
    >
      <div className='h-[48px] group cursor-pointer px-2 flex flex-col justify-center items-center relative'>
        <div
          className={`flex justify-center items-center font-semibold no-underline text-gray-700 dark:text-gray-50`}
        >
          {navlink?.icon}
          {navlink?.title}
        </div>
        <p className={`h-[2px] ${active ? 'w-full' : 'w-0 '} group-hover:w-full group-hover:mr-auto group-hover:ml-0 ml-auto transition-all duration-300 absolute left-0 right-0 bottom-0.5 
      bg-gradient-to-r to-mainColor from-cyan-500`}></p>
      </div>
    </Link>
  )
}

export default NavLink