import React, { useEffect, useState } from 'react';
import $ from "jquery";
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';

import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Admin from '../../index';
import { AdminTable } from '../Table';
import { AddButton } from '../../../../components/Elements/Button'
import { IconTextField } from '../../../../components/Elements/Input'
import { fetchingData } from "../../../../Requests";

import './style.scss';


/**
 *
 * DEFAULT COLUMNS ACTIONS
 * @param {dict} params Params for action.
 * @param {String} redirectUrl Url for redirecting after action done.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @returns {list}
 */
export function COLUMNS_ACTION(params, redirectUrl, editUrl = null, detailUrl = null) {
  editUrl = editUrl ? editUrl : urls.api.edit;
  detailUrl = detailUrl ? detailUrl : urls.api.detail;
  return [
    <GridActionsCellItem
      icon={
        <Tooltip title={`Edit ${params.row.name}`}>
          <a
            href={editUrl.replace('/0', `/${params.id}`)}>
            <EditIcon/>
          </a>
        </Tooltip>
      }
      label="Edit"
    />,
    <GridActionsCellItem
      className='AdminTableDelete'
      icon={
        <Tooltip title={`Delete ${params.row.name}`}>
          <DeleteIcon/>
        </Tooltip>
      }
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
}

/**
 *
 * DEFAULT COLUMNS
 * @param {String} redirectUrl Url for redirecting after action done.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @returns {list}
 */
export function COLUMNS(redirectUrl, editUrl = null, detailUrl = null) {
  editUrl = editUrl ? editUrl : urls.api.edit;
  detailUrl = detailUrl ? detailUrl : urls.api.detail;
  return [
    { field: 'id', headerName: 'id', hide: true, width: 30 },
    { field: 'name', headerName: 'Indicator Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'group', headerName: 'Category', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => {
        return COLUMNS_ACTION(params, redirectUrl, editUrl, detailUrl)
      },
    }
  ]
}

/**
 * Admin List App
 * @param {list} columns Columns setup.
 * @param {String} pageName Page Name.
 * @param {String} listUrl Url for list row.
 * @param {React.Component} children React component to be rendered
 */
export default function AdminList(
  {
    columns, pageName,
    listUrl, rightHeader = null
  }
) {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState(null);

  /** Fetch list of data */
  const fetchData = (url) => {
    fetchingData(url, {}, {}, (data) => {
      setData(data)
    })
  }

  // Show modal when url changed
  useEffect(() => {
    fetchData(listUrl)
  }, [])

  /** Search on change */
  const searchOnChange = (evt) => {
    setSearch(evt.target.value.toLowerCase())
  }

  /** Filter by search input */
  let rows = data;
  if (search) {
    rows = rows.filter(row => {
      return row.name.toLowerCase().includes(search)
        || row.group.toLowerCase().includes(search)
        || row.description.toLowerCase().includes(search)
    })
  }

  /** Render **/
  return (
    <Admin
      className='Indicator'
      pageName={pageName}
      rightHeader={
        rightHeader ? rightHeader : (
          <a href={urls.api.create}>
            <AddButton
              variant="secondary"
              text={"Add New " + pageName}
            />
          </a>
        )
      }>

      <div className='AdminBaseInput Indicator-Search'>
        <IconTextField
          placeholder={"Search " + pageName}
          iconStart={<SearchIcon/>}
          onChange={searchOnChange}
        />
      </div>

      <div className='AdminList'>
        <AdminTable
          rows={rows} columns={columns}/>
      </div>
    </Admin>
  );
}