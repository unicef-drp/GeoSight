import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';
import AdminList, { COLUMNS } from "../../Components/List";

import './style.scss';

/**
 * Indicator List App
 */
export default function IndicatorList() {
  return <AdminList
    columns={COLUMNS(urls.admin.indicatorList)}
    pageName={pageNames.Indicators}
    listUrl={urls.api.list}
  />
}

render(IndicatorList, store)