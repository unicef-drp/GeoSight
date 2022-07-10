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
  return <AdminList
    columns={COLUMNS(urls.admin.contextLayerList)}
    pageName={pageNames.ContextLayer}
    listUrl={urls.api.list}
  />
}

render(ContextLayerList, store)