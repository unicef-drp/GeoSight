/* ==========================================================================
   INDICATORS editor
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
      <div><b className='light'>{layer.group} / {layer.name}</b></div>
      <div>{layer.description}</div>
    </div>
  </Fragment>
}

/**
 * Indicators Editor Section Handler
 * @param {boolean} expanded Expanded.
 * @param {function} handleChange Handle the accordion opened.
 */
export default function IndicatorsEditSection({ expanded, handleChange }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  return <EditSection
    expanded={expanded}
    handleChange={handleChange}
    title='Indicators List'
    description='Must select one or more indicators for the dashboard.'
    required={true}
    className='modal__indicators__setting'
    currentLayers={indicators}
    urlAPI={urls.indicatorListAPI}
    actionAddLayer={Actions.Indicators.add}
    actionRemoveLayer={Actions.Indicators.remove}>
    <EditRow/>
  </EditSection>
}