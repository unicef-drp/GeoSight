import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Actions } from "../../../../../store/dashboard";
import ListForm from '../ListForm'

/**
 * Basemaps dashboard
 */
export default function BasemapsForm() {
  const dispatch = useDispatch()
  const { basemapsLayers } = useSelector(state => state.dashboard.data);
  return <ListForm
    pageName={'Basemaps'}
    data={basemapsLayers}
    listUrl={urls.api.basemapListAPI}
    addLayerAction={(layer) => {
      dispatch(Actions.Basemaps.add(layer))
    }}
    removeLayerAction={(layer) => {
      dispatch(Actions.Basemaps.remove(layer))
    }}
    changeLayerAction={(layer) => {
      dispatch(Actions.Basemaps.update(layer))
    }}
    rearrangeLayersAction={(payload) => {
      dispatch(Actions.Basemaps.rearrange(payload))
    }}
  />
}