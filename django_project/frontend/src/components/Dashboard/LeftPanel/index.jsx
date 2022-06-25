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
    defaultBasemapLayer
  } = useSelector(state => state.dashboard.data);
  const [state, setState] = useState(LEFT);
  const [tab, setTab] = useState('DATASET');

  const onLeft = () => {
    setState(LEFT);
  };
  const onRight = () => {
    setState(RIGHT);
  };
  const [expanded, setExpanded] = useState('indicators');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(panel);
  };

  const className = `dashboard__panel dashboard__left_side ${state} ${expanded ? 'expanded' : ''} `
  const classNameWrapper = `dashboard__content-wrapper ${tab}`
  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className={classNameWrapper}>
        <div className='dashboard__content-wrapper__navbar'>
          <div onClick={() => setTab('DATASET')}
               className={tab === 'DATASET' ? 'active' : ''}>
            DATASET
          </div>
          <div onClick={() => setTab('FILTER')}
               className={tab === 'FILTER' ? 'active' : ''}>
            FILTER
          </div>
        </div>
        <div className='dashboard__content-wrapper__inner dataset-wrapper'>
          <ReferenceLayerSection/>
          <IndicatorsAccordion
            expanded={expanded === 'indicators'}
            handleChange={handleChange}
          />
          <ContextLayersAccordion
            expanded={expanded === 'contextLayers'}
            handleChange={handleChange}
          />
        </div>
        <div className='dashboard__content-wrapper__inner filter-wrapper'>
          <FiltersAccordion/>
        </div>
      </div>
      <div className='dashboard__left_side__basemaps'>
        <Basemaps
          data={basemapsLayers}
          defaultBasemapLayer={defaultBasemapLayer}/>
      </div>
    </section>
  )
}
