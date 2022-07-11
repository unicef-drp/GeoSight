import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';
import AdminList, { COLUMNS, COLUMNS_ACTION } from "../../Components/List";

import './style.scss';

/**
 * Indicator List App
 */
export default function DashboardList() {
  const pageName = pageNames.Dashboard
  const columns = COLUMNS(pageName, urls.admin.dashboardList);
  columns[2] = { field: 'modified_at', headerName: 'Last Modified', flex: 1 }
  columns[4] = {
    field: 'actions',
    type: 'actions',
    width: 120,
    getActions: (params) => {
      const actions = [].concat(COLUMNS_ACTION(params, urls.admin.dashboardList));
      actions.unshift(
        <GridActionsCellItem
          icon={
            <Tooltip title={`Project Map`}>
              <a
                href={urls.api.map.replace('/0', `/${params.id}`)}>
                <MapIcon/>
              </a>
            </Tooltip>
          }
          label="Management Form"
        />)
      return actions
    },
  }
  return <AdminList
    columns={columns}
    pageName={pageName}
    listUrl={urls.api.list}
  />
}

render(DashboardList, store)