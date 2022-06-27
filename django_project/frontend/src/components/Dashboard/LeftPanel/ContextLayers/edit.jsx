/* ==========================================================================
   CONTEXT LAYER editor
   ========================================================================== */

import React, { Fragment } from 'react';
import { useSelector } from "react-redux";

import Actions from '../../../../redux/actions'
import EditSection from "../editSection";

/**
 * Render each row on edit modal.
 * @param {object} layer Layer data that will be rendered.
 */
export function EditRow({ layer }) {
  return <Fragment>
    <div className='text title'>
      <div><b className='light'>{layer.name}</b></div>
      {layer.group ? <div>Group : {layer.group}</div> : ''}
      <div>{layer.url}</div>
    </div>
  </Fragment>
}

/**
 * Context Layers Editor Section Handler
 */
export default function ContextLayersEditSection({ expanded, handleChange }) {
  const { contextLayers } = useSelector(state => state.dashboard.data);
  return <EditSection
    expanded={expanded}
    handleChange={handleChange}
    title='Context Layers List'
    description='Select one or more Context Layers for the dashboard.'
    required={false}
    className='modal__context_layers__setting'
    currentLayers={contextLayers}
    urlAPI={urls.contextLayerListAPI}
    actionAddLayer={Actions.ContextLayers.add}
    actionRemoveLayer={Actions.ContextLayers.remove}>
    <EditRow/>
  </EditSection>
}