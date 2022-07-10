import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin/Indicator';
import { pageNames } from '../../index';
import AdminList from "../../List";

import './style.scss';

const columns = [
  { field: 'id', headerName: 'id', hide: true, width: 30 },
  { field: 'name', headerName: 'Basemap Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'group', headerName: 'Category', flex: 1 }
]

/**
 * Indicator List App
 */
export default function BasemapList() {
  return <AdminList
    columns={columns}
    pageName={pageNames.Basemaps}
    listUrl={urls.api.list}
    editUrl={urls.api.edit}
    detailUrl={urls.api.detail}
    redirectUrl={urls.admin.basemapList}
  />
}

render(BasemapList, store)