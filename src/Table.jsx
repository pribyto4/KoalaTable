import React, { useState } from "react";
import { useTable, useFilters, useSortBy, useExpanded } from "react-table";

//následující funkce je logika a UI komponenty Table
export default function Table({ columns: userColumns, data, renderRowSubComponent,parentRowIndex}) {
  // Use the state and functions returned from useTable to build your UI
  //převzato a upraveno z https://github.com/TanStack/react-table/blob/v7/examples/sub-components/src/App.js
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row) //this function needs to be called for each row before getting the row props
            return (
              // Use a React.Fragment here so the table markup is still valid
              <React.Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {               
                row.isExpanded ? (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ row,parentRowIndex })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
      <br />
      {
      //rows.length - prý je to omezené na 20 řádků
      }
    </>
  )
}