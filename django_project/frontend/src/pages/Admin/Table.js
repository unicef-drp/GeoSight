import React from 'react';
import $ from 'jquery';
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";


/**
 * Admin Table
 * @param {Array} rows List of data.
 * @param {Array} columns Columns for the table.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @param {String} redirectUrl Url for redirecting after action done.
 */
export function AdminTable(
  { rows, columns, editUrl, detailUrl, redirectUrl }
) {
  /** Add column  */
  columns = columns.concat([
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => {
        return [
          <GridActionsCellItem
            icon={
              <a
                href={editUrl.replace('/0', `/${params.id}`)}>
                <EditIcon/>
              </a>
            }
            label="Edit"
          />,
          <GridActionsCellItem
            className='AdminTableDelete'
            icon={<DeleteIcon/>}
            label="Delete"
            onClick={
              () => {
                const api = detailUrl.replace('/0', `/${params.id}`);
                if (confirm(`Are you sure you want to delete : ${params.row.name}?`)) {
                  $.ajax({
                    url: api,
                    method: 'DELETE',
                    success: function () {
                      window.location = redirectUrl;
                    },
                    beforeSend: beforeAjaxSend
                  });
                  return false;
                }
              }
            }
          />,
        ]
      },
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
    return <div className='AdminTable-Loading'>Loading</div>
  }
}