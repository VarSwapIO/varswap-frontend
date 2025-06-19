'use client'
import React, { useEffect, useState } from 'react'
import { formatNumberDisplay } from '@/helpers/format_number_display'
import ImageBG from '@/components/Image/ImageBG';
import Link from 'next/link';

const HomepageContainer = () => {

  const handleClickScroll = () => {
    const element = document.getElementById('learn-more');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth', });
    }
  };

  const dataCurrentDay: any = {}
  return (
    <div className='relative container py-12 mx-auto px-2'>
      <div>
        <div className="lg:pt-10 pb-8">
          <div className="px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 justify-center items-start text-center md:text-left ">
              <p className="uppercase w-full text-sm lg:text-base font-medium dark:text-white">Trade crypto & NFTs with confidence</p>
              <h1 className="my-2 md:my-4 text-2xl md:text-3xl lg:text-5xl font-bold lg:leading-12 text-mainColor">
                The leading
                AMM DEX on Vara Network
              </h1>
              <p className="leading-normal dark:text-slate-300 font-medium text-slate-600 text-sm lg:text-lg md:mb-4">
                No registration needed. Over 100 tokens to trade at your fingertips
              </p>
              <div className='flex gap-4 items-center my-8 md:my-4 mx-auto md:mx-0 text-sm md:text-base'>
                <button className="z-10 mx-auto md:mx-0 bg-white text-gray-700 font-bold rounded-full py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                  <Link href="/swap">Get Started</Link>
                </button>
                <button onClick={() => handleClickScroll()} className="flex gap-2 items-center z-10 mx-auto md:mx-0 bg-gradient-to-br from-mainColor to-mainColor/60 hover:bg-gradient-to-bl text-gray-100 font-bold rounded-full py-3 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-3/5 py-6 text-center relative">

            </div>
          </div>
        </div>
        <div className="relative -mt-10 lg:-mt-20 text-[#FFFFFF] dark:text-slate-900/50">
          <svg viewBox="0 0 1428 174" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
              <g transform="translate(-2.000000, 44.000000)" fill="currentColor" fillRule="nonzero">
                <path d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496" opacity="0.100000001"></path>
                <path
                  d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                  opacity="0.100000001"
                ></path>
                <path d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z" id="Path-4" opacity="0.200000003"></path>
              </g>
              <g transform="translate(-4.000000, 76.000000)" fill="currentColor" fillRule="nonzero">
                <path
                  d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <section className="dark:bg-slate-900/50 bg-white pb-8 pt-4">
          <div className="container p-3 md:p-8 mx-auto m-8">
            <h2 className="w-full mb-6 text-3xl sm:text-5xl font-bold leading-tight text-center relative text-mainColor" >
              <p className='absolute -top-24' id="learn-more"></p>
              Feature
            </h2>
            <div className='grid lg:grid-cols-2 md:gap-6'>
              <div className="border dark:border-slate-700 border-slate-100 relative mt-4 md:mt-0 rounded-3xl bg-gradient-custom dark:bg-gradient-custom-dark  shadow-md sm:min-h-[400px]">
                <div className="p-6">
                  <h3 className="text-3xl font-bold leading-none mb-3 text-mainColor">
                    Swap tokens
                  </h3>
                  <p className=" mb-8 font-medium text-slate-600 dark:text-slate-400">
                    Buy, sell, and explore tokens on Vara
                  </p>
                  <div className='w-4/5 sm:w-2/3 grid grid-cols-2 gap-4 mb-8'>
                    <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100 text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-md space-y-2'>
                      <p className='font-semibold dark:text-white'>TVL</p>
                      <p className='dark:text-slate-300 text-sm font-medium'>${formatNumberDisplay(+dataCurrentDay?.total_tvl_usd?.toFixed(2) || 0)}</p>
                    </div>
                    <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100 text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-md space-y-2'>
                      <p className='font-semibold dark:text-white'>Volume 24h</p>
                      <p className='dark:text-slate-300 text-sm font-medium'>${formatNumberDisplay(+dataCurrentDay?.volume_24h_usd?.toFixed(2) || 0)}</p>
                    </div>
                    <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100 text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-md space-y-2'>
                      <p className='font-semibold dark:text-white'>Liquidity Pool</p>
                      <p className='dark:text-slate-300 text-sm font-medium'>50+</p>
                    </div>
                    <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100 text-xs sm:text-base py-4 px-2 xl:p-4 text-center shadow-md space-y-2'>
                      <p className='font-semibold dark:text-white'>Fees 24H</p>
                      <p className='dark:text-slate-300 text-sm font-medium'>${formatNumberDisplay(+(+dataCurrentDay?.volume_24h_usd * 0.003)?.toFixed(2) || 0)}</p>
                    </div>
                  </div>
                  <Link className="text-blue-500 font-medium" href="/swap">Trade Tokens</Link>
                </div>
                {/* <img src={swapCoin} alt='swap-coin' className='h-full object-cover absolute inset-y-0 right-0' /> */}
              </div>
              <div className="border dark:border-slate-700 border-slate-100 relative md:mt-0 mt-8 rounded-3xl bg-gradient-custom dark:bg-gradient-custom-dark shadow-md sm:min-h-[400px]">
                <div className="p-6 ">
                  <div className="align-middle">
                    <h3 className="text-3xl font-bold leading-none mb-3 text-mainColor">
                      Farms
                    </h3>
                    <p className=" mb-8 font-medium text-slate-600 dark:text-slate-400">
                      Stake LP tokens to earn.
                    </p>
                    <div className='w-4/5 sm:w-2/3 grid grid-cols-2 gap-4 mb-8'>
                      <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100 py-4 px-2 xl:p-4 text-center text-xs sm:text-base shadow-md space-y-2'>
                        <p className='font-semibold dark:text-white'>LP tokens</p>
                        <p className='dark:text-slate-300 font-medium text-sm'>15+</p>
                      </div>
                      <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100  py-4 px-2 xl:p-4 text-center text-xs sm:text-base shadow-md space-y-2'>
                        <p className='font-semibold dark:text-white'>Volume 24h</p>
                        <p className='dark:text-slate-300 font-medium text-sm'>$200,000</p>
                      </div>
                      <div className=' rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100  py-4 px-2 xl:p-4 text-center text-xs sm:text-base shadow-md space-y-2'>
                        <p className='font-semibold dark:text-white'>Total Volume</p>
                        <p className='dark:text-slate-300 font-medium text-sm'>$5,200,000</p>
                      </div>
                      <div className='rounded-xl bg-white dark:bg-slate-900/50 border dark:border-slate-800 border-slate-100  py-4 px-2 xl:p-4 text-center text-xs sm:text-base shadow-md space-y-2'>
                        <p className='font-semibold dark:text-white'>Fees 24H</p>
                        <p className='dark:text-slate-300 font-medium text-sm'>$1500</p>
                      </div>
                    </div>
                    <Link
                      className="text-blue-500 font-medium"
                      href="/farms"
                    >
                      Farm now
                    </Link>
                  </div>
                </div>
                {/* <img src={bannerNFTMarketplace} className='h-full object-cover absolute inset-y-0 right-0 w-1/3 sm:w-1/2' alt='swap-coin' /> */}
              </div>
            </div>
          </div>
        </section>
        <section className='mx-auto px-4 dark:bg-slate-900/50 bg-white pb-8 pt-4'>
          <h2 className="w-full mb-6 text-3xl sm:text-5xl font-bold leading-tight text-center text-mainColor">
            Mobile App
          </h2>
          <div className='flex items-center justify-center gap-4'>
            <div className=''>
              <p className='text-xl md:text-3xl font-extrabold text-mainColor'>Trade Anytime, Anywhere</p>
              <p className='dark:text-slate-300 text-slate-600 font-medium text-sm sm:text-base my-2'>{`Open new positions instantly, whether it's on VarSwap App or Web.`}</p>
              <div className='flex gap-4 items-center'>
                <div className='border border-solid border-slate-200 rounded-xl bg-slate-50 shadow-sm p-1'>
                  <ImageBG
                    src={'/images/features/VarSwap_qrcode.svg'}
                    alt="qr"
                    width={150}
                    height={150}
                    className="lg:h-[150px] lg:w-[150px] w-[100px] h-[100px]"
                  />
                </div>
                <div className='font-medium'>
                  <p className='dark:text-slate-300 text-slate-500 text-sm m-0'>Scan Now to Dowload</p>
                  <p className='dark:text-white text-slate-900 font-semibold'>IOS & Android</p>
                </div>
              </div>
              <div className='flex gap-2 mt-4 items-center'>
                <div className='border border-solid border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 rounded-xl shadow-sm p-2 w-24 h-24 lg:w-28 lg:h-28 font-medium flex flex-col gap-2 justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 text-slate-800 dark:text-white' viewBox="0 0 16 16"><defs><path id="biApple0" d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258s.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854s-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116c-.508.139-1.653.589-1.968.607c-.316.018-1.256-.522-2.267-.665c-.647-.125-1.333.131-1.824.328c-.49.196-1.422.754-2.074 2.237c-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472c.357.013 1.061.154 1.782.539c.571.197 1.111.115 1.652-.105c.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"></path></defs><g fill="currentColor"><use href="#biApple0"></use><use href="#biApple0"></use></g></svg>
                  <p className='dark:text-white text-slate-900 text-xs lg:text-sm'>App Store</p>
                </div>
                <div className='border border-solid border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 rounded-xl shadow-sm p-2 w-24 h-24 lg:w-28 lg:h-28 font-medium flex flex-col gap-2 justify-center items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 text-[#95C045]' viewBox="0 0 24 24"><path fill="currentColor" d="M1 18q.225-2.675 1.638-4.925T6.4 9.5L4.55 6.3q-.15-.225-.075-.475T4.8 5.45q.2-.125.45-.05t.4.3L7.5 8.9Q9.65 8 12 8t4.5.9l1.85-3.2q.15-.225.4-.3t.45.05q.25.125.325.375t-.075.475L17.6 9.5q2.35 1.325 3.762 3.575T23 18zm6-2.75q.525 0 .888-.363T8.25 14q0-.525-.363-.888T7 12.75q-.525 0-.888.363T5.75 14q0 .525.363.888T7 15.25m10 0q.525 0 .888-.363T18.25 14q0-.525-.363-.888T17 12.75q-.525 0-.888.363T15.75 14q0 .525.363.888t.887.362"></path></svg>
                  <p className='dark:text-white text-slate-900 text-xs lg:text-sm'>Android APK</p>
                </div>
                <div className='border border-solid border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 rounded-xl shadow-sm p-2 w-24 h-24 lg:w-28 lg:h-28 font-medium flex flex-col gap-2 justify-center items-center'>
                  <ImageBG
                    src={'/images/features/googleplay.png'}
                    alt={'chplay'}
                    width={28}
                    height={28}
                  />
                  <p className='dark:text-white text-slate-900 text-xs lg:text-sm'>Google Play</p>
                </div>
              </div>
            </div>
            <div className='md:block hidden'>
              <ImageBG
                src={'/images/features/mobile-app-group.png'}
                alt="img-dl"
                className='w-[350px] h-[280px] lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px]'
                width={686}
                height={400}
              />
            </div>
          </div>
        </section>
        <section className="dark:bg-slate-900/50 bg-white rounded-b-xl pt-10">
          <div className="container mx-auto flex flex-wrap pt-4 pb-12">
            <h2 className="w-full mb-6 text-3xl sm:text-5xl font-bold leading-tight text-center text-mainColor">
              Trade to earn more benefits
            </h2>
            <div className='grid lg:grid-cols-3 p-4 gap-4'>
              <div className="w-full p-6 bg-gradient-custom dark:bg-gradient-custom-dark rounded-3xl shadow-md">
                <div className='flex justify-between items-center'>
                  <p className="text-xl sm:text-3xl font-semibold px-6 text-mainColor">
                    Buy crypto
                  </p>
                  <p className='w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-mainColor flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 sm:w-10 sm:h-10 text-white' viewBox="0 0 36 36"><path fill="currentColor" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m7.65 21.59c-1 3-3.61 3.84-5.9 4v2a1.25 1.25 0 0 1-2.5 0v-2A11.47 11.47 0 0 1 11 25a1.25 1.25 0 1 1 1.71-1.83a9.1 9.1 0 0 0 4.55 1.94v-6.28a9.6 9.6 0 0 1-3.73-1.41a4.8 4.8 0 0 1-1.91-5.84c.59-1.51 2.42-3.23 5.64-3.51V6.25a1.25 1.25 0 0 1 2.5 0v1.86a9.67 9.67 0 0 1 4.9 2A1.25 1.25 0 0 1 23 11.95a7.14 7.14 0 0 0-3.24-1.31v6.13c.6.13 1.24.27 1.91.48a5.85 5.85 0 0 1 3.69 2.82a4.64 4.64 0 0 1 .29 3.52" ></path><path fill="currentColor" d="M20.92 19.64q-.6-.18-1.17-.3v5.76c2-.2 3.07-.9 3.53-2.3a2.15 2.15 0 0 0-.15-1.58a3.5 3.5 0 0 0-2.21-1.58" ></path><path fill="currentColor" d="M13.94 12.48a2.31 2.31 0 0 0 1 2.87a6.5 6.5 0 0 0 2.32.92v-5.72c-2.1.25-3.07 1.29-3.32 1.93" ></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
                  </p>
                </div>
                <p className="text-sm sm:text-base px-6 mb-5 mt-3 lg:min-h-[90px] font-medium dark:text-slate-300 text-slate-600">
                  Buy crypto with your credit card or bank account at the best rates.
                </p>
                <Link href="/swap" className="text-base text-blue-500 px-6 mb-5 mt-3 font-semibold">
                  Buy Now
                </Link>
              </div>
              <div className="w-full p-6 bg-gradient-custom dark:bg-gradient-custom-dark rounded-3xl shadow-md">
                <div className='flex justify-between items-center'>
                  <p className="text-xl sm:text-3xl font-semibold px-6 text-mainColor">
                    Earn
                  </p>
                  <p className='w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-mainColor flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-7 h-7 sm:w-9 sm:h-9 text-white' viewBox="0 0 24 24"><path d="M5 12H4v8a2 2 0 0 0 2 2h5V12H5zm13 0h-5v10h5a2 2 0 0 0 2-2v-8h-2zm.791-5A4.92 4.92 0 0 0 19 5.5C19 3.57 17.43 2 15.5 2c-1.622 0-2.705 1.482-3.404 3.085C11.407 3.57 10.269 2 8.5 2C6.57 2 5 3.57 5 5.5c0 .596.079 1.089.209 1.5H2v4h9V9h2v2h9V7h-3.209zM7 5.5C7 4.673 7.673 4 8.5 4c.888 0 1.714 1.525 2.198 3H8c-.374 0-1 0-1-1.5zM15.5 4c.827 0 1.5.673 1.5 1.5C17 7 16.374 7 16 7h-2.477c.51-1.576 1.251-3 1.977-3z" fill="currentColor"></path></svg>
                  </p>
                </div>
                <p className="text-sm sm:text-base px-6 mb-5 mt-3 lg:min-h-[90px] font-medium dark:text-slate-300 text-slate-600">
                  Provide liquidity to pools on Varswap and earn fees on swaps.
                </p>
                <a href="/pools" className="text-base text-blue-500 px-6 mb-5 font-semibold mt-auto">
                  Provide liquidity
                </a>
              </div>
              <div className="w-full p-6 bg-gradient-custom dark:bg-gradient-custom-dark rounded-3xl shadow-md">
                <div className='flex justify-between items-center'>
                  <p className="text-xl sm:text-3xl font-semibold px-6 text-mainColor">
                    Staking
                  </p>
                  <p className='w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-mainColor flex justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6 sm:w-9 sm:h-9 text-white' viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="M8 6c3.314 0 6-.895 6-2s-2.686-2-6-2s-6 .895-6 2s2.686 2 6 2m7.5 3a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13"></path><path d="M15.5 19c.105 0 .202-.05.397-.148l1.564-.796c.693-.352 1.039-.527 1.039-.806v-3.5m-3 5.25c-.105 0-.202-.05-.397-.148l-1.564-.796c-.693-.352-1.039-.527-1.039-.806v-3.5m3 5.25v-3.5m3-1.75c0-.279-.346-.454-1.039-.806l-1.564-.796c-.195-.098-.292-.148-.397-.148s-.202.05-.397.148l-1.564.796c-.693.351-1.039.527-1.039.806m6 0c0 .279-.346.454-1.039.806l-1.564.796c-.195.098-.292.148-.397.148m-3-1.75c0 .279.346.454 1.039.806l1.564.796c.195.098.292.148.397.148M2 4v8.043c0 .704 1.178 1.59 4.13 1.957M2.107 8.548C3.312 9.61 5.46 10.06 7.754 10.06m6.234-5.939v2.015"></path></g></svg>
                  </p>
                </div>
                <p className="text-sm sm:text-base px-6 mb-5 mt-3 lg:min-h-[90px]">
                  Stake token to gain access to receive platform fees, and more benefits..
                </p>
                <a href="/farms" target="_blank" rel="noopener noreferrer" className="text-base text-blue-500 px-6 mb-5 mt-3 font-semibold">
                  Stake now
                </a>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>

  )
}

export default HomepageContainer