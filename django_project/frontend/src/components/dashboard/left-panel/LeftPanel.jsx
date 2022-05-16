/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Basemaps from './Basemaps'

import '../../../assets/styles/components/dashboard/left-panel.scss';

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
  const basemaps = data ? data.basemaps : undefined;
  const contextLayers = data ? data.contextLayers : undefined;
  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className='dashboard__content-wrapper'>
        <Accordion
          expanded={expanded === 'indicators'}
          onChange={handleChange('indicators')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            Indicators
          </AccordionSummary>
          <AccordionDetails>
            {
              data && data.indicators ?
                data.indicators.map(
                  layer => (
                    <div key={layer.id}>
                      {layer.group}/{layer.name}
                    </div>
                  )
                )
                : <div>Loading</div>
            }
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'contextLayers'}
          onChange={handleChange('contextLayers')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            Context Layers {
            contextLayers ? <span>&nbsp;({contextLayers.length}) </span> :
              <i>&nbsp;(Loading)</i>
          }
          </AccordionSummary>
          <AccordionDetails>
            {
              contextLayers ?
                data.contextLayers.map(
                  layer => (
                    <div key={layer.id}>
                      {layer.group}/{layer.name}
                    </div>
                  )
                )
                : <div>Loading</div>
            }
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'basemaps'}
          onChange={handleChange('basemaps')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
          >
            Basemaps
            {
              basemaps ? <span>&nbsp;({basemaps.length}) </span> :
                <i>&nbsp;(Loading)</i>
            }
          </AccordionSummary>
          <AccordionDetails>
            <Basemaps data={basemaps}/>
          </AccordionDetails>
        </Accordion>
      </div>
    </section>
  )
}
