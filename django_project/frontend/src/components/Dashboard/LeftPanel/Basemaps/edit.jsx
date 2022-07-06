/* ==========================================================================
   BASEMAPS editor
   ========================================================================== */

import React, { Fragment } from 'react';
import { useSelector } from "react-redux";

import Actions from '../../../../redux/actions/dashboard'
import EditSection from '../editSection'

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
 * @param {boolean} expanded Expanded.
 * @param {function} handleChange Handle the accordion opened.
 */
export default function BasemapsEditSection({ expanded, handleChange }) {
  const { basemapsLayers } = useSelector(state => state.dashboard.data);
  return <EditSection
    expanded={expanded}
    handleChange={handleChange}
    title='Basemap List'
    description='Must select one or more basemaps and select on the map to make it as default.'
    required={true}
    className='modal__basemap__setting'
    currentLayers={basemapsLayers}
    urlAPI={urls.basemapListAPI}
    actionAddLayer={Actions.Basemaps.add}
    actionRemoveLayer={Actions.Basemaps.remove}>
    <EditRow/>
  </EditSection>
}
