/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";
import Actions from '../../../redux/actions/actions'
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from "@mui/material/Accordion";

import ReferenceLayer from '../Map/ReferenceLayer'

/**
 * Indicators selector
 */
export function Indicators() {
  const dispatch = useDispatch();
  const indicators = useSelector(state => state.indicators);
  const referenceLayer = useSelector(state => state.referenceLayer.data);
  const [currentIndicator, setCurrentIndicator] = useState(null);

  const change = (checked, id) => {
    if (checked) {
      setCurrentIndicator(id);
    } else {
      setCurrentIndicator(null);
    }
  };

  // Get indicator data
  useEffect(() => {
    if (indicators && referenceLayer && Object.keys(referenceLayer).length > 0) {
      indicators.forEach(function (indicator, idx) {
        if (!indicator.data) {
          Actions.Indicators.fetch(dispatch, idx, indicator.url, referenceLayer)
        }
      })
    }
  }, [indicators, referenceLayer]);

  // Get selected indicator data
  let selectedIndicatorData = null;
  if (indicators && indicators[currentIndicator]) {
    selectedIndicatorData = indicators[currentIndicator].data;
  }

  return (
    <Fragment>
      {
        indicators !== undefined ?
          indicators.map(
            (layer, idx) => (
              <div className='dashboard__left_side__row'
                   key={idx}>
                <Checkbox
                  checked={currentIndicator === idx}
                  onChange={() => {
                    change(event.target.checked, idx)
                  }}/>
                <div className='text title'>
                  <div>{layer.name}</div>
                </div>
              </div>
            )
          )
          : <div>Loading</div>
      }
      <ReferenceLayer indicatorData={selectedIndicatorData}/>
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
        <div>
          Indicators
          {
            indicators ?
              <span>&nbsp;({indicators.length}) </span> :
              <i>&nbsp;(Loading)</i>
          }
        </div>
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