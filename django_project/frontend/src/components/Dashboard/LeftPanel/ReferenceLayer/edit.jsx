/* ==========================================================================
   REFERENCE LAYER editor
   ========================================================================== */

import React, { Fragment } from 'react';
import { useSelector } from "react-redux";
import Actions from '../../../../redux/actions'
import EditSection from "../edit";

/**
 * Render each row on edit modal.
 * @param {object} layer Layer data that will be rendered.
 */
export function EditRow({ layer }) {
  return <Fragment>
    <div className='text title'>
      <div><b>Name :</b> {layer.name}</div>
      <div><b>Description :</b> {layer.description}</div>
      <div><b>Source :</b> {layer.source}</div>
    </div>
  </Fragment>
}

/**
 * Reference Layer Editor Section Handler
 */
export default function ReferenceLayerEditSection() {
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  return <EditSection
    title='Select Reference Layer'
    description='Must select one Reference Layer for the dashboard.'
    required={true}
    className='modal__reference_layer__setting'
    currentLayers={[referenceLayer]}
    urlAPI={urls.referenceLayersListAPI}
    actionAddLayer={Actions.ReferenceLayer.change}
    actionRemoveLayer={Actions.ReferenceLayer.change}>
    <EditRow/>
  </EditSection>
}
