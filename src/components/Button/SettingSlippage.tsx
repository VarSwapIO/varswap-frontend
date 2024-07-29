import { MAIN_COLOR } from '@/config/asset';
import { Button, Input, Popover } from '@mantine/core';
import { IconPercentage, IconPercentage10, IconPercentage100, IconPresentation } from '@tabler/icons-react';
import React, { Fragment } from 'react';

const SettingSlippage = ({ onChangeSlippageTolerance, value }: { onChangeSlippageTolerance?: (value: any) => void; value?: any; }) => {

  return (
    <div>
      <Popover width={200} position="bottom" shadow="md">
        <Popover.Target>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer dark:text-txtdark-300 text-txt-300 duration-300 transition-all hover:rotate-45">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

        </Popover.Target>
        <Popover.Dropdown w={300} p={0} className=" bg-white dark:bg-slate-800 dark:border-slate-600 z-20 rounded-xl shadow-md px-4 sm:px-0 ">
          <div className="p-4 px-2">
            <p className="font-semibold dark:text-white text-slate-900">Settings</p>
            <div className="flex gap-3 items-center mt-1 font-medium text-sm dark:text-slate-300 text-slate-600">
              {'Slippage Tolerance'}
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg> */}
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                onClick={() => onChangeSlippageTolerance && onChangeSlippageTolerance(0.5)}
                radius={'md'}
                color={MAIN_COLOR}
                variant={'light'}
              >
                Auto
              </Button>
              <Input
                value={value}
                onChange={(e: any) => onChangeSlippageTolerance && onChangeSlippageTolerance(e.target.value)}
                leftSection={<span className='font-semibold'>%</span>}
                variant="filled"
                radius="md"
                placeholder="0.1"
                classNames={{
                  input: `dark:bg-slate-700 dark:placeholder-slate-500 `,
                }}
              />
            </div>
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default SettingSlippage;
