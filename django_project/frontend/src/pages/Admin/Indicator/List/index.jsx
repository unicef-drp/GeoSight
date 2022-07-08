import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin/Indicator';
import { pageNames } from '../../index';

import './style.scss';
import AdminList from "../../List";


const columns = [
  { field: 'id', headerName: 'id', hide: true, width: 30 },
  { field: 'name', headerName: 'Indicator Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'group', headerName: 'Category', flex: 1 }
]

/**
 * Indicator List App
 */
export default function IndicatorList() {
  return <AdminList
    columns={columns} pageName={pageNames.Indicators}
    editUrl={urls.api.edit}
    detailUrl={urls.api.detail}
    redirectUrl={urls.admin.indicatorList}
  />
}

render(IndicatorList, store)