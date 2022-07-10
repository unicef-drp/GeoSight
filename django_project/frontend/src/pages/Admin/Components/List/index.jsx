import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import Admin from '../../index';
import { AdminTable } from '../../Table';
import { AddButton } from '../../../../components/Elements/Button'
import { IconTextField } from '../../../../components/Elements/Input'
import { fetchingData } from "../../../../Requests";

import './style.scss';


/**
 * Admin List App
 * @param {list} columns Columns setup.
 * @param {String} pageName Page Name.
 * @param {String} listUrl Url for list row.
 * @param {String} editUrl Url for edit row.
 * @param {String} detailUrl Url for detail of row.
 * @param {String} redirectUrl Url for redirecting after action done.
 */
export default function AdminList(
  { columns, pageName, listUrl, editUrl, detailUrl, redirectUrl }
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
        <a href={urls.api.create}>
          <AddButton
            variant="secondary"
            text={"Add New " + pageName}
          />
        </a>
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
          rows={rows} columns={columns} editUrl={editUrl}
          detailUrl={detailUrl} redirectUrl={redirectUrl}/>
      </div>
    </Admin>
  );
}