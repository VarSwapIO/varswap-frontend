import React from 'react'

export interface SELECT_TAB_OPTION {
  title: string;
  value: string;
  id: string;
}

interface SELECT_TAB_PROP {
  options: SELECT_TAB_OPTION[];
  selected: string;
  onChange: (value: string) => void
}

const SelectTab = ({ options, selected, onChange }: SELECT_TAB_PROP) => {

  return (
    <div className='flex flex-wrap gap-x-4 gap-y-3 md:gap-5 items-center px-2'>
      {options?.map((tab: SELECT_TAB_OPTION) => {
        const selected_check = tab.value === selected
        return (
          <div key={tab.id} className="relative group">
            <p className={`m-0 text-sm md:text-base font-semibold cursor-pointer dark:text-slate-400 text-slate-500 ${selected_check ? 'dark:text-white text-slate-900' : 'dark:group-hover:text-white group-hover:text-slate-900'}`} onClick={() => onChange(tab.value)}>
              {tab.title}
            </p>
            <p className={`w-[0px] h-[3px] !bg-mainColor absolute inset-x-0 top-1 md:top-2 mx-auto 
            transition-all duration-200 ${selected_check ? 'w-[19px]' : 'w-[0px]'}`}></p>
          </div>
        )
      })}
    </div>
  )
}

export default SelectTab
