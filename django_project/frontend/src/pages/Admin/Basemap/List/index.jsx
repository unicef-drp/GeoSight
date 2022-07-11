import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';
import AdminList, { COLUMNS } from "../../Components/List";

import './style.scss';

/**
 * Indicator List App
 */
export default function BasemapList() {
  const pageName = pageNames.Basemaps
  return <AdminList
    columns={COLUMNS(pageName, urls.admin.basemapList)}
    pageName={pageName}
    listUrl={urls.api.list}
  />
}

render(BasemapList, store)