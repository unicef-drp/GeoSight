import React from 'react';
import { useSelector } from "react-redux";
import Actions from "../../../../../redux/actions/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function IndicatorsForm() {
  const { indicators } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Indicators'}
    data={indicators}
    listUrl={urls.api.indicatorListAPI}
    addLayerAction={Actions.Indicators.add}
    removeLayerAction={Actions.Indicators.remove}
    changeLayerAction={Actions.Indicators.update}
  />
}