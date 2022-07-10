import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';
import AdminList from "../../Components/List";

import './style.scss';

const columns = [
  { field: 'id', headerName: 'id', hide: true, width: 30 },
  { field: 'name', headerName: 'ContextLayer Name', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'group', headerName: 'Category', flex: 1 }
]

/**
 * Indicator List App
 */
export default function ContextLayerList() {
  return <AdminList
    columns={columns}
    pageName={pageNames.ContextLayer}
    listUrl={urls.api.list}
    editUrl={urls.api.edit}
    detailUrl={urls.api.detail}
    redirectUrl={urls.admin.contextLayerList}
  />
}

render(ContextLayerList, store)