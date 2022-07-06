import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { render } from '../../../../app';
import { AdminTable } from '../../Table';
import { store } from '../../../../store/admin/Indicator';
import Admin, { pageNames } from '../../index';
import { AddButton } from '../../../../components/Elements/Button'
import { IconTextField } from '../../../../components/Elements/Input'
import { fetchingData } from "../../../../Requests";

import './style.scss';

const Columns = [
  { field: 'id', headerName: 'id', hide: true, width: 30 },
  { field: 'name', headerName: 'Indicator Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'group', headerName: 'Category', flex: 1 }
]

/**
 * Indicator List App
 */
export default function IndicatorList() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState(null);

  /** Fetch list of indicator */
  const fetchData = (url) => {
    fetchingData(url, {}, {}, (data) => {
      setData(data)
    })
  }

  // Show modal when url changed
  useEffect(() => {
    fetchData(urls.api.list)
  }, [])

  /** Return add Button and place it on right Header */
  const addButtonClick = () => {
    console.log('Add')
  }

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
    })
  }

  /** Render **/
  return (
    <Admin
      className='Indicator'
      pageName={pageNames.IndicatorsList}
      rightHeader={
        <AddButton
          variant="secondary"
          onClick={addButtonClick}
          text="Add New Project"
        />
      }>

      <div className='AdminBaseInput Indicator-Search'>
        <IconTextField
          placeholder='Search Indicator'
          iconStart={<SearchIcon/>}
          onChange={searchOnChange}
        />
      </div>

      <div className='AdminList'>
        <AdminTable rows={rows} columns={Columns}/>
      </div>
    </Admin>
  );
}

render(IndicatorList, store)