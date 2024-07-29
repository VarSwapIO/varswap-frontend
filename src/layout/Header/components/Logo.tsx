'use client';
import ImageBG from '@/components/Image/ImageBG';
import Link from 'next/link';
import React from 'react'

const Logo = ({ showLogo }: { showLogo?: boolean }) => {
  return (
    <Link href='/' className='no-underline'>
      <div
        className="w-fit cursor-pointer mt-1"
      >
        <ImageBG
          alt="logo-varswap"
          width={35}
          height={40}
          src={'/images/icons/logo.svg'}
        />
      </div>
    </Link>
  )
}

export default Logo
