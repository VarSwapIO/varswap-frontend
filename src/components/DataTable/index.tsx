import { Table, useMantineColorScheme } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  SortingState,
  Column,
} from "@tanstack/react-table";
import React, { CSSProperties, FC, useEffect, useMemo, useRef, useState } from "react";
import SkeletonBG from "../SkeletonBG";

type DATATABLE_BG_PROPS = {
  data: { [key: string]: string }[];
  columns: ColumnDef<{ [key: string]: string }, any>[];
  isFetching?: boolean;
  headerAlign?: 'justify-end' | 'justify-start' | 'justify-center'
  skeletonCount?: number;
  skeletonHeight?: number;
  emptyText?: string;
  sticky_first_column?: boolean;
  showIndexRow?: boolean
  onSorting?: (data: SortingState) => void;
  sortDefault?: SortingState
};

const getCommonPinningStyles = (column: Column<any>, sticky_first_column: boolean, is_dark: boolean): CSSProperties => {
  const is_pininng = sticky_first_column && column.getIndex() === 0
  return {
    boxShadow: is_pininng
      ? `-4px 0 4px -4px ${is_dark ? '#334155' : 'lightgray'} inset` : undefined,
    left: `${column.getStart('left') - 1}px`,
    right: undefined,
    opacity: 1,
    position: is_pininng ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: is_pininng ? 100 : 1,
  }
}

const DataTableBG: FC<DATATABLE_BG_PROPS> = ({
  data,
  columns,
  isFetching,
  headerAlign = 'justify-end',
  skeletonCount = 10,
  skeletonHeight = 28,
  emptyText = 'No token found!',
  sticky_first_column = false,
  showIndexRow = false,
  onSorting,
  sortDefault = []
}) => {
  const divRef = useRef<any>()
  const { colorScheme } = useMantineColorScheme()
  const [isPinning, setIsPinning] = useState(false)
  const [sorting, setSorting] = useState<SortingState>(sortDefault)
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const { getHeaderGroups, getRowModel, getAllColumns, getTotalSize } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });
  const skeletons = Array.from({ length: skeletonCount }, (x, i) => i);

  const columnCount = getAllColumns().length;
  const noDataFound =
    !isFetching && (!memoizedData || memoizedData.length === 0);

  useEffect(() => {
    if (!!divRef.current && !!window) {
      const handleResize = () => {
        const width_div_table = divRef.current.offsetWidth;
        const table_width = getTotalSize()
        if (width_div_table < table_width) {
          setIsPinning(true)
        } else {
          setIsPinning(false)
        }
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useShallowEffect(() => {
    onSorting?.(sorting)
  }, [sorting])


  return (
    <div className="relative w-full overflow-x-auto rounded-xl" ref={divRef}>
      <Table className="bg-white dark:bg-slate-900 rounded-xl"
        style={{
          width: (isPinning && sticky_first_column) ? getTotalSize() : '100%'
        }}
      >
        <Table.Thead>
          {getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id} className="dark:border-slate-700" >
              {headerGroup.headers.map((header, index) => (
                <Table.Th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="py-3 pr-0 sm:text-sm text-[11px] font-medium dark:text-white text-slate-600 bg-white dark:bg-slate-900 select-none"
                  onClick={!noDataFound ? header.column.getToggleSortingHandler() : () => { }}
                  style={{ ...getCommonPinningStyles(header.column, sticky_first_column && isPinning, colorScheme === 'dark') }}
                >
                  <div className={`flex gap-0 items-center cursor-pointer ${index === 0 ? '' : index === (headerGroup.headers?.length - 1) ? 'justify-end pr-2' : `${headerAlign}`}`}>
                    {(index === 0 && showIndexRow) ? <p className="mx-2 mr-4">#</p> : null}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {header.column.columnDef.enableSorting?.valueOf() && <>
                      {{
                        asc: <div className="h-[26px] relative w-5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute top-0 text-yellow-500" viewBox="0 0 24 24"><path fill="currentColor" d="M8.71 12.29L11.3 9.7a.996.996 0 0 1 1.41 0l2.59 2.59c.63.63.18 1.71-.71 1.71H9.41c-.89 0-1.33-1.08-.7-1.71"></path></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute bottom-0 " viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71"></path></svg>
                        </div>,
                        desc: <div className="h-[26px] relative w-5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute top-0" viewBox="0 0 24 24"><path fill="currentColor" d="M8.71 12.29L11.3 9.7a.996.996 0 0 1 1.41 0l2.59 2.59c.63.63.18 1.71-.71 1.71H9.41c-.89 0-1.33-1.08-.7-1.71"></path></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute bottom-0 text-yellow-500" viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71"></path></svg>
                        </div>,
                      }[header.column.getIsSorted() as string] ?? <div className="h-[26px] relative w-5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute top-0" viewBox="0 0 24 24"><path fill="currentColor" d="M8.71 12.29L11.3 9.7a.996.996 0 0 1 1.41 0l2.59 2.59c.63.63.18 1.71-.71 1.71H9.41c-.89 0-1.33-1.08-.7-1.71"></path></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute bottom-0" viewBox="0 0 24 24"><path fill="currentColor" d="m8.71 11.71l2.59 2.59c.39.39 1.02.39 1.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H9.41c-.89 0-1.33 1.08-.7 1.71"></path></svg>
                        </div>}
                    </>}
                  </div>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {!isFetching ? (
            getRowModel()?.rows.map((row, index) => (
              <Table.Tr
                key={row.id}
                className="group font-semibold dark:hover:bg-slate-800 hover:bg-slate-100 hover:shadow-md border-[1px] border-solid border-transparent dark:hover:border-slate-800 hover:border-slate-100 cursor-pointer"
              >

                {row.getVisibleCells().map((cell, index_cell) => (
                  <Table.Td
                    key={cell.id}
                    className="bg-white dark:bg-slate-900 group-hover:!bg-transparent"
                    style={{ ...getCommonPinningStyles(cell.column, sticky_first_column && isPinning, colorScheme === 'dark') }}
                  >
                    <div className={`flex gap-2 items-center ${index_cell === 0 ? '' : "justify-end"}`}>
                      {(index_cell === 0 && showIndexRow) ? <span className="ml-2 mr-4">{index + 1}</span> : null}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <>
              {skeletons.map((skeleton) => (
                <Table.Tr key={skeleton} className="">
                  {Array.from({ length: columnCount }, (x, i) => i).map((elm) => (
                    <Table.Td key={elm}>
                      <SkeletonBG width="100%" height={skeletonHeight} />
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </>
          )}
          {noDataFound && (
            <Table.Tr className="text-center dark:text-slate-400 dark:bg-slate-900 w-full">
              <Table.Td colSpan={columnCount} className="h-[200px]">
                {emptyText}
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>

      </Table>

    </div >

  );
};

export default DataTableBG;
