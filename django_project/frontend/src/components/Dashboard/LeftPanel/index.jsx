/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import { useSelector } from "react-redux";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Basemaps from './Basemaps'
import ContextLayers from './ContextLayers'
import IndicatorsAccordion from './Indicators'
import ReferenceLayerSection from './ReferenceLayer'

import './style.scss';

/**
 * Left panel
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
        <Accordion
          expanded={expanded === 'contextLayers'}
          onChange={handleChange('contextLayers')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <div>
              Context Layers
              {
                contextLayers !== undefined ?
                  <span>&nbsp;({contextLayers.length}) </span> :
                  <i>&nbsp;(Loading)</i>
              }
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <ContextLayers data={contextLayers}/>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className='dashboard__left_side__basemaps'>
        <Basemaps data={basemapsLayers}
                  defaultBasemapLayer={defaultBasemapLayer}/>
      </div>
    </section>
  )
}
