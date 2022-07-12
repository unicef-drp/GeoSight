import React from 'react';
import { useSelector } from "react-redux";
import Actions from "../../../../../redux/actions/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function BasemapsForm() {
  const { basemapsLayers } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Basemaps'}
    data={basemapsLayers}
    listUrl={urls.api.basemapListAPI}
    addLayerAction={Actions.Basemaps.add}
    removeLayerAction={Actions.Basemaps.remove}
    changeLayerAction={Actions.Basemaps.change}
  />
}