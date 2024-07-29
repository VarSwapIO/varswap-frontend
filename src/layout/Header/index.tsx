'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import HeaderLeft from './components/HeaderLeft'
import HeaderRight from './components/HeaderRight'
import { useWindowScroll } from '@mantine/hooks'
import HeaderSearch from './components/HeaderSearch'

const Header = () => {
  const [transitonH, setTransitonH] = useState(true);
  const [currentY, setCurrentY] = useState(0)
  const [scroll,] = useWindowScroll()
  useEffect(() => {
    if (scroll.y > currentY) {
      setCurrentY(scroll.y)
      setTransitonH(false)
    }

    if (scroll.y < currentY) {
      setTransitonH(true)
      setCurrentY(scroll.y)
    }
  }, [scroll.y])

  return (
    <div className={`bg-transparent backdrop-blur-sm px-3 grid grid-cols-3 h-[48px] w-full sticky text-center z-50 transition-all duration-300 ${transitonH ? 'top-0' : '-top-[50px]'}`}>
      <HeaderLeft />
      <HeaderSearch />
      <div className='flex justify-end'>
        <HeaderRight />
      </div>
    </div>
  )
}

export default Header