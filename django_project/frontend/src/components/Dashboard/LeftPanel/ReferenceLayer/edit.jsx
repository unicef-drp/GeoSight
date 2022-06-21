/* ==========================================================================
   REFERENCE LAYER editor
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
      <div>{layer.description}</div>
      <div>{layer.source}</div>
    </div>
  </Fragment>
}

/**
 * Reference Layer Editor Section Handler
 * @param {boolean} expanded Expanded.
 * @param {function} handleChange Handle the accordion opened.
 */
export default function ReferenceLayerEditSection({ expanded, handleChange }) {
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  return <EditSection
    expanded={expanded}
    handleChange={handleChange}
    title='Reference Dataset'
    description='Must select one Reference Dataset for the dashboard.'
    required={true}
    className='modal__reference_layer__setting'
    currentLayers={
      referenceLayer && Object.keys(referenceLayer).length > 0 ? [referenceLayer] : []
    }
    urlAPI={preferences.georepo_api.reference_layer_list}
    idKey='identifier'
    actionAddLayer={Actions.ReferenceLayer.change}
    actionRemoveLayer={Actions.ReferenceLayer.change}
    formatResponse={
      function (response) {
        return response.map(ref => {
          ref.detail_url = preferences.georepo_url + '/api/reference-layer/' + ref.identifier
          return ref
        })
      }
    }
  >
    <EditRow/>
  </EditSection>
}
