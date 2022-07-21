import React, { Fragment, useEffect, useState } from 'react';
import $ from "jquery";
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';

import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AdminTable } from '../Table';
import { IconTextField } from '../../../../components/Elements/Input'
import { fetchingData } from "../../../../Requests";
import MoreAction from "../../../../components/Elements/MoreAction";

import './style.scss';

/**
 *
 * DEFAULT COLUMNS ACTIONS
 * @param {dict} params Params for action.
 * @param {String} redirectUrl Url for redirecting after action done.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @param {React.Component} moreActions More actions before delete
 * @returns {list}
 */
export function COLUMNS_ACTION(
  params, redirectUrl, editUrl = null, detailUrl = null, moreActions = null
) {
  editUrl = editUrl ? editUrl : urls.api.edit;
  detailUrl = detailUrl ? detailUrl : urls.api.detail;

  const actions = []
  if (editUrl) {
    actions.push(
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
      />
    )
  }
  actions.push(
    <GridActionsCellItem
      icon={
        <MoreAction moreIcon={<MoreVertIcon/>}>
          {
            moreActions ? React.Children.map(moreActions, child => {
              return child
            }) : ''
          }
          {
            detailUrl ?
              <div className='error' onClick={
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
              }>
                <DeleteIcon/> Delete
              </div> : ''
          }
        </MoreAction>
      }
      label="More"
    />
  )
  return actions
}

/**
 *
 * DEFAULT COLUMNS
 * @param {String} pageName Page name.
 * @param {String} redirectUrl Url for redirecting after action done.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @returns {list}
 */
export function COLUMNS(pageName, redirectUrl, editUrl = null, detailUrl = null) {
  editUrl = editUrl ? editUrl : urls.api.edit;
  detailUrl = detailUrl ? detailUrl : urls.api.detail;
  return [
    { field: 'id', headerName: 'id', hide: true, width: 30 },
    { field: 'name', headerName: pageName + ' Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
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
 * @param {list} initData Init Data.
 */
export default function List(
  {
    columns, pageName, listUrl, initData
  }
) {
  const [data, setData] = useState(initData);
  const [search, setSearch] = useState(null);

  /** Fetch list of data */
  const fetchData = (url) => {
    if (!data) {
      fetchingData(url, {}, {}, (data) => {
        setData(data)
      })
    }
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
        || row.category.toLowerCase().includes(search)
        || row.description.toLowerCase().includes(search)
    })
  }

  /** Render **/
  return (
    <Fragment>
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
    </Fragment>
  );
}