/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from "@mui/material/Accordion";

import Actions from '../../../../redux/actions'
import ReferenceLayer from '../../Map/ReferenceLayer'

/**
 * Indicators selector.
 */
export function Indicators() {
  const dispatch = useDispatch();
  const { indicators } = useSelector(state => state.dashboard.data);
  const indicatorData = useSelector(state => state.indicatorData);
  const [currentIndicator, setCurrentIndicator] = useState(0);

  const change = (checked, id) => {
    if (checked) {
      setCurrentIndicator(id);
    } else {
      setCurrentIndicator(null);
    }
  };

  // Get indicator data
  useEffect(() => {
    if (indicators) {
      indicators.forEach(function (indicator, idx) {
        if (!indicator.data) {
          dispatch(Actions.Indicators.fetch(dispatch, idx, indicator.url));
        }
      })
    }
  }, [indicators]);

  // Get selected indicator data
  let selectedIndicator = null;
  if (indicators && indicatorData[currentIndicator]) {
    selectedIndicator = indicatorData[currentIndicator];
  }

  return (
    <Fragment>
      {
        indicators !== undefined ?
          indicators.map(
            (layer, idx) => (
              <div className='dashboard__left_side__row'
                   key={idx}>
                <Radio
                  checked={currentIndicator === idx}
                  onChange={() => {
                    change(event.target.checked, idx)
                  }}/>
                <div className='text title'>
                  <div>{layer.group} / {layer.name}</div>
                </div>
              </div>
            )
          )
          : <div>Loading</div>
      }
      <ReferenceLayer currentIndicator={selectedIndicator}/>
    </Fragment>
  )
}

/**
 * Indicators selector
 * @param {bool} expanded Is the accordion expanded
 * @param {function} handleChange Function when the accordion show
 */
export default function IndicatorsAccordion({ expanded, handleChange }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange('indicators')}
    >

      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        Indicators
        {
          indicators ?
            <span></span> :
            <i>&nbsp;(Loading)</i>
        }
      </AccordionSummary>
      <AccordionDetails>
        {
          indicators ?
            <Indicators/> : ''
        }
      </AccordionDetails>
    </Accordion>
  )
}