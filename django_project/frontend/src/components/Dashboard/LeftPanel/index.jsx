/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Basemaps from './Basemaps'
import ContextLayers from './ContextLayers'

import './style.scss';

/**
 * Left panel
 * @param {object} data Data of dashboard
 */
export default function LeftPanel({ data }) {
  const [state, setState] = useState(LEFT);

  const onLeft = () => {
    setState(LEFT);
  };
  const onRight = () => {
    setState(RIGHT);
  };
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const className = `dashboard__panel dashboard__left_side ${state}`
  const basemapsLayers = data ? data.basemapsLayers : undefined;
  const contextLayers = data ? data.contextLayers : undefined;
  const referenceLayer = data ? data.referenceLayer : undefined

  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className='dashboard__content-wrapper'>
        <Accordion
          expanded={true}
          className='reference-dataset'
        >
          <AccordionSummary>
            <div>
              Reference Dataset
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {
              referenceLayer !== undefined ?
                <div>
                  <div><b>Name :</b> {referenceLayer.name}</div>
                  <div><b>Description :</b> {referenceLayer.description}</div>
                  <div><b>Source :</b> {referenceLayer.source}</div>
                </div>
                : <div>Loading</div>
            }
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={true}
        >
          <AccordionSummary>
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
        <Basemaps data={basemapsLayers}/>
      </div>
    </section>
  )
}
