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

import { Actions } from '../../../../store/dashboard'
import { layerInGroup } from "../../../../utils/layers";
import ReferenceLayer from '../../Map/ReferenceLayer'

/**
 * Indicators selector.
 */
export function Indicators() {
  const dispatch = useDispatch();
  const { indicators } = useSelector(state => state.dashboard.data);
  const indicatorsData = useSelector(state => state.indicatorsData);
  const indicatorsEnabled = indicators.filter(indicator => {
    return indicator.visible_by_default
  })
  const [currentIndicator, setCurrentIndicator] = useState(
    indicatorsEnabled[0] ? indicatorsEnabled[0].id : 0
  );

  const change = (checked, id) => {
    if (checked) {
      setCurrentIndicator(id);
    } else {
      setCurrentIndicator(null);
    }
  };

  /**
   * Fetch indicator data
   */
  useEffect(() => {
    if (indicators) {
      indicators.map(indicator => {
        const { id } = indicator
        if (!indicatorsData[id]?.data) {
          dispatch(Actions.IndicatorsData.fetch(dispatch, id, indicator.url));
        }
      })
    }
  }, [indicators]);

  // Get selected indicator data
  let selectedIndicator = null;
  if (indicators) {
    selectedIndicator = indicators.filter(indicator => {
      return indicator.id === currentIndicator
    })[0]
  }


  /**
   * Context Layer Row.
   * @param {str} groupNumber Group number.
   * @param {str} groupName Group name.
   * @param {dict} group Group data.
   */
  const LayerRow = ({ groupName, group }) => {
    return <div className={'LayerGroup ' + (groupName ? '' : 'Empty')}>
      <div className='LayerGroupName'><b
        className='light'>{groupName}</b></div>
      <div className='LayerGroupList'>
        {
          group.map(layer => (
              <div className='dashboard__left_side__row'
                   key={layer.id}>
                <Radio
                  checked={currentIndicator === layer.id}
                  onChange={() => {
                    change(event.target.checked, layer.id)
                  }}/>
                <div className='text title'>
                  <div>{layer.name}</div>
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  }

  const groups = layerInGroup(indicators)
  return (
    <Fragment>
      {
        Object.keys(groups).map(
          groupName => (
            <LayerRow
              key={groupName} groupName={groupName}
              group={groups[groupName]}/>
          )
        )
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
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange('indicators')}
    >

      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        Indicators
      </AccordionSummary>
      <AccordionDetails>
        <Indicators/>
      </AccordionDetails>
    </Accordion>
  )
}