/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import { useSelector } from "react-redux";

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Basemaps from './Basemaps'
import ContextLayersAccordion from './ContextLayers'
import IndicatorsAccordion from './Indicators'
import ReferenceLayerSection from './ReferenceLayer'
import FiltersAccordion from './Filters'

import './style.scss';

/**
 * Left panel.
 */
export default function LeftPanel() {
  const {
    basemapsLayers,
    contextLayers,
    defaultBasemapLayer
  } = useSelector(state => state.dashboard.data);
  const [state, setState] = useState(LEFT);

  const onLeft = () => {
    setState(LEFT);
  };
  const onRight = () => {
    setState(RIGHT);
  };
  const [expanded, setExpanded] = useState('indicators');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const className = `dashboard__panel dashboard__left_side ${state} ${expanded ? 'expanded' : ''}`

  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className='dashboard__content-wrapper'>
        <ReferenceLayerSection/>
        <IndicatorsAccordion
          expanded={expanded === 'indicators'}
          handleChange={handleChange}
        />
        <ContextLayersAccordion
          expanded={expanded === 'contextLayers'}
          handleChange={handleChange}
        />
        <FiltersAccordion
          expanded={expanded === 'filters'}
          handleChange={handleChange}
        />
      </div>
      <div className='dashboard__left_side__basemaps'>
        <Basemaps
          data={basemapsLayers}
          defaultBasemapLayer={defaultBasemapLayer}/>
      </div>
    </section>
  )
}
