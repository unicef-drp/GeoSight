import React from 'react';
import { useSelector } from "react-redux";
import Actions from "../../../../../redux/actions/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function ContextLayerForm() {
  const { contextLayers } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Context Layers'}
    data={contextLayers}
    listUrl={urls.api.contextLayerListAPI}
    addLayerAction={Actions.ContextLayers.add}
    removeLayerAction={Actions.ContextLayers.remove}
    changeLayerAction={Actions.ContextLayers.change}
  />
}