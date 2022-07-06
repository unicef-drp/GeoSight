import React from 'react';
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";


/**
 * Admin Table
 * @param {Array} data List of data.
 * @param {Array} columns Columns for the table.
 */
export function AdminTable({ rows, columns }) {
  /** Add column  */
  columns = columns.concat([
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon/>}
          label="Edit"
          onClick={() => console.log('Edit')}
        />,
        <GridActionsCellItem
          className='AdminTableDelete'
          icon={<DeleteIcon/>}
          label="Delete"
          onClick={() => console.log('Delete')}
        />,
      ],
    }
  ])
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
    return <div>Loading</div>
  }
}