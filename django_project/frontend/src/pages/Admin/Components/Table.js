import React from 'react';
import { DataGrid } from "@mui/x-data-grid";

/**
 * Admin Table
 * @param {Array} rows List of data.
 * @param {Array} columns Columns for the table.
 */
export function AdminTable(
  {
    rows, columns
  }
) {
  if (rows) {
    return (
      <div className='AdminTable'>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
          initialState={{
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          disableSelectionOnClick
        />
      </div>
    )
  } else {
    return <div className='AdminTable-Loading'>Loading</div>
  }
}