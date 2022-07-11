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

import Actions from '../../../../redux/actions/dashboard'
import ReferenceLayer from '../../Map/ReferenceLayer'
import { layerInGroup } from "../../../../utils/layers";

/**
 * Indicators selector.
 */
export function Indicators() {
  const dispatch = useDispatch();
  const { indicators } = useSelector(state => state.dashboard.data);
  const indicatorsEnabled = indicators.filter(indicator => {
    return indicator.visible_by_default
  })
  const indicatorData = useSelector(state => state.indicatorData);
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
  const LayerRow = ({ groupNumber, groupName, group }) => {
    if (!groupName) {
      return <div></div>
    }
    const className = groupNumber > 1 ? 'LayerGroup' : 'LayerGroup Empty'

    return <div className={className}>
      <div className='LayerGroupName'><b
        className='light'>{groupName}</b></div>
      <div className='LayerGroupList'>
        {
          group.layers.map(layer => (
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
        Object.keys(groups.groups).map(
          groupName => (
            <LayerRow
              groupNumber={Object.keys(groups.groups).length}
              key={groupName} groupName={groupName}
              group={groups.groups[groupName]}/>
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