import { CloseButton, Input, Menu, } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FixedSizeList as List } from "react-window";
import ImageBG from '../Image/ImageBG';

type ITEM_FD = {
  title: string;
  key: string;
  icon?: string;

}
type FILTER_DROPDOWN_PROPS = {
  options?: ITEM_FD[];
  selected: string;
  onSelected: (value: string) => void;
  type?: 'normal' | 'coin'
}

const FilterDropdown = ({ options, selected, onSelected, type = 'normal' }: FILTER_DROPDOWN_PROPS) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [valueSelected, setValueSelected] = useState<ITEM_FD>();
  const [optionsCoin, setOptionsCoin] = useState([
    {
      title: 'All',
      key: 'all'
    }
  ])
  const [searchCoin, setSearchCoin] = useState('')

  useEffect(() => {
    if (type === 'coin') {
      getFilterCoin()
    }
  }, [options, searchCoin, type])

  const getFilterCoin = () => {
    if (!!options && options?.length > 0) {
      if (!searchCoin) {
        setOptionsCoin(options);
      } else {
        const coin_find = options?.filter((v: ITEM_FD) => v.key?.includes(searchCoin?.toUpperCase()));
        setOptionsCoin(coin_find);
      }
    }
  }

  useEffect(() => {
    if (selected) {
      const filter = options?.find((i: ITEM_FD) => i.key === selected);
      setValueSelected(filter);
    } else[
      setValueSelected(options?.[0])
    ]
  }, [selected])

  const onClicKItem = (item: ITEM_FD) => {
    setValueSelected(item)
    onSelected(item?.key)
  }

  const Row = ({ data, style, index }: any) => {
    const token_detail = data?.[index] || {}
    return (
      <div style={style} >
        <div onClick={() => onClicKItem(token_detail)} className='flex gap-2 items-center p-1.5 px-2 rounded-md  dark:hover:bg-slate-700  hover:bg-slate-100 cursor-pointer' >
          {token_detail?.title !== 'All' ? <ImageBG
            alt="logo-token"
            width={23}
            height={23}
            src={token_detail?.icon}
            className="dark:border-slate-700 border-transparent border-solid border rounded-full"
          /> : null}
          <p className={`text-xs font-semibold m-0 ${token_detail?.title === 'All' ? 'ml-1 !text-base dark:text-white text-slate-800 ' : ''}`}>{token_detail?.title}</p>
        </div>
      </div >
    );
  }

  return (
    <Menu
      offset={5}
      trigger="hover"
      loop={false}
      withinPortal={false}
      trapFocus={false}
      menuItemTabIndex={0}
      onChange={(opened: boolean) => setOpenDropdown(opened)}
    >
      < Menu.Target >
        <div className={`w-fit p-2 border border-solid dark:border-slate-800 border-slate-100 
        flex justify-between items-center gap-4 rounded-xl cursor-pointer dark:bg-slate-800 bg-white shadow-sm`}>
          <p className='m-0 font-semibold dark:text-slate-400 text-slate-500 text-sm'>Type</p>
          <div className='flex gap-2 items-center justify-end min-w-[120px]'>
            <div className='flex gap-2 items-center'>
              {type === 'coin' && valueSelected?.icon ? <ImageBG
                alt="logo-token"
                width={20}
                height={20}
                src={valueSelected?.icon || ''}
                className="dark:border-slate-700 border-transparent border-solid border rounded-full"
              /> : null}
              <p className='m-0 dark:text-white text-slate-800 font-semibold text-sm'>{valueSelected?.title}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 dark:text-slate-400 text-slate-500 transition-all duration-150 ${openDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24"><path fill="currentColor" d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"></path></svg>
          </div>
        </div>
      </Menu.Target >
      <Menu.Dropdown
        className="border rounded-lg bg-white p-0 dark:bg-slate-800 dark:border-slate-900 shadow-sm"
        w={185}
      >
        {type === 'coin' ? <>
          <div className='pb-2'>
            <Input
              size={'xs'}
              leftSection={<svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 dark:text-slate-500' viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path></svg>}
              variant="filled"
              radius="md"
              placeholder="Search token ..."
              className='mx-auto mt-2 mb-1'
              classNames={{
                input: `dark:bg-slate-700 dark:placeholder-slate-500`,
                wrapper: `w-[90%] mb-2`
              }}
              value={searchCoin}
              onChange={(e: any) => setSearchCoin(e?.target?.value)}
              rightSectionPointerEvents={'all'}
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setSearchCoin('')}
                  style={{ display: searchCoin ? undefined : 'none' }}
                  size="sm"
                  className="dark:hover:bg-slate-800 "
                />
              }
            />
            <List
              className="dark:bg-slate-800 rounded-b-lg overflow-hidden scrollbar "
              height={250}
              itemCount={optionsCoin?.length}
              itemSize={35}
              width={182}
              itemData={optionsCoin}
            >
              {(props: any) => <Row key={props?.index} data={props?.data} index={props?.index} style={props?.style} />}
            </List>
          </div>
        </> :
          <>
            {options?.map((op: ITEM_FD) => {
              return (
                <Menu.Item key={op?.key}
                  onClick={() => onClicKItem(op)}
                  className={`font-semibold rounded-lg dark:hover:bg-slate-700 hover:bg-slate-100 ${valueSelected?.key === op?.key ? 'text-mainColor' : ''}`}
                >
                  {op?.title}
                </Menu.Item>
              )
            })}
          </>
        }
      </Menu.Dropdown >
    </Menu >
  )
}

export default FilterDropdown