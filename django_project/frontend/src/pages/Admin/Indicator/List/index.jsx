import React from 'react';
import Tooltip from "@mui/material/Tooltip";
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import MapIcon from '@mui/icons-material/Map';
import PublishIcon from '@mui/icons-material/Publish';
import { GridActionsCellItem } from "@mui/x-data-grid";

import {
  AddButton,
  ThemeButton
} from "../../../../components/Elements/Button";
import AdminList, { COLUMNS, COLUMNS_ACTION } from "../../Components/List";
import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import { pageNames } from '../../index';

import './style.scss';

/**
 * Indicator List App
 */
export default function IndicatorList() {
  const pageName = pageNames.Indicators
  const columns = COLUMNS(pageName, urls.admin.indicatorList);

  columns[4] = {
    field: 'actions',
    type: 'actions',
    width: 160,
    getActions: (params) => {
      const actions = [].concat(COLUMNS_ACTION(params, urls.admin.indicatorList));
      actions.unshift(
        <GridActionsCellItem
          icon={
            <Tooltip title={`Management Form`}>
              <a
                href={urls.api.form.replace('/0', `/${params.id}`)}>
                <DynamicFormIcon/>
              </a>
            </Tooltip>
          }
          label="Management Form"
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={`Management Map`}>
              <a
                href={urls.api.map.replace('/0', `/${params.id}`)}>
                <MapIcon/>
              </a>
            </Tooltip>
          }
          label="Edit"
        />)
      return actions
    },
  }
  return <AdminList
    columns={columns}
    pageName={pageName}
    listUrl={urls.api.list}
    rightHeader={
      <div>
        <a href={urls.api.ingestor}>
          <ThemeButton
            variant="secondary"
          >
            <PublishIcon/>Meta Ingestor
          </ThemeButton>
        </a>
        <a href={urls.api.create}>
          <AddButton
            variant="secondary"
            text={"Add New Indicator"}
          />
        </a>
      </div>
    }
  />
}

render(IndicatorList, store)