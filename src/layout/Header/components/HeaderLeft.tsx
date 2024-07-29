import { NAVIGATIONS } from '@/layout/navigation'
import { Input } from '@mantine/core'
import React from 'react'
import DropdownNavLink from './DropdownNavLink'
import Logo from './Logo'
import NavLink from './NavLink'

const HeaderLeft = () => {
  return (
    <div className='h-full flex justify-start items-center gap-6'>
      <Logo />
      <div className=' hidden lg:flex items-center text-sm gap-2'>
        {NAVIGATIONS.map((nav: ROUTER_NAV) => {
          if (nav.type === 'DROPDOWN') {
            return <DropdownNavLink key={nav.id} navlink={nav} />
          } else {
            return <NavLink key={nav.id} navlink={nav} />
          }
        })}
      </div>
    </div>
  )
}

export default HeaderLeft