import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "../../../../../store/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function ContextLayerForm() {
  const dispatch = useDispatch()
  const { contextLayers } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Context Layers'}
    data={contextLayers}
    listUrl={urls.api.contextLayerListAPI}
    addLayerAction={(layer) => {
      dispatch(Actions.ContextLayers.add(layer))
    }}
    removeLayerAction={(layer) => {
      dispatch(Actions.ContextLayers.remove(layer))
    }}
    changeLayerAction={(layer) => {
      dispatch(Actions.ContextLayers.update(layer))
    }}
    rearrangeLayersAction={(payload) => {
      dispatch(Actions.ContextLayers.rearrange(payload))
    }}
  />
}