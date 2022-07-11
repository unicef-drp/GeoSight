import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';
import AdminList, { COLUMNS } from "../../Components/List";

import './style.scss';

/**
 * Indicator List App
 */
export default function ContextLayerList() {
  const pageName = pageNames.ContextLayer
  return <AdminList
    columns={COLUMNS(pageName, urls.admin.contextLayerList)}
    pageName={pageName}
    listUrl={urls.api.list}
  />
}

render(ContextLayerList, store)