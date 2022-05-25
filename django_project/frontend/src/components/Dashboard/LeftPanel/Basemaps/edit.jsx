/* ==========================================================================
   BASEMAPS editor
   ========================================================================== */

import React, { Fragment } from 'react';
import { useSelector } from "react-redux";

import Actions from '../../../../redux/actions'
import EditSection from '../edit'

/**
 * Render each row on edit modal.
 * @param {object} layer Layer data that will be rendered.
 */
export function EditRow({ layer }) {
  return <Fragment>
    <div className='icon'>
      <img src={layer.icon}/>
    </div>
    <div className='text title'>
      <div><b className='light'>{layer.name}</b></div>
      <div> {layer.url}</div>
    </div>
  </Fragment>
}

/**
 * Basemap Editor Section Handler
 */
export default function BasemapsEditSection() {
  const { basemapsLayers } = useSelector(state => state.dashboard.data);
  return <EditSection
    title='Edit Basemap List'
    description='Select one or more basemaps and select on the map to make it as default.'
    required={true}
    className='modal__basemap__setting'
    currentLayers={basemapsLayers}
    urlAPI={urls.basemapListAPI}
    actionAddLayer={Actions.Basemaps.add}
    actionRemoveLayer={Actions.Basemaps.remove}>
    <EditRow/>
  </EditSection>
}
