import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "../../../../../store/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function IndicatorsForm() {
  const dispatch = useDispatch();
  const { indicators } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Indicators'}
    data={indicators}
    listUrl={urls.api.indicatorListAPI}
    addLayerAction={(layer) => {
      dispatch(Actions.Indicators.add(layer))
    }}
    removeLayerAction={(layer) => {
      dispatch(Actions.Indicators.remove(layer))
    }}
    changeLayerAction={(layer) => {
      dispatch(Actions.Indicators.update(layer))
    }}
    rearrangeLayersAction={(payload) => {
      dispatch(Actions.Indicators.rearrange(payload))
    }}
  />
}