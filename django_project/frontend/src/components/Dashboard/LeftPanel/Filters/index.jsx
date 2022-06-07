/* ==========================================================================
   Filters SELECTOR
   ========================================================================== */

import React, { Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from "@mui/icons-material/Info";

import Actions from '../../../../redux/actions'
import './style.scss';

/**
 * Render input of filter.
 * @param {object} groupId ID of filter belong to.
 * @param {object} filterId ID of filter.
 * @param {object} filter Filter data.
 */
export function FilterInput({ groupId, filterId, filter }) {
  const dispatch = useDispatch();
  const change = (checked) => {
    dispatch(Actions.Filters.changeState(groupId, filterId, checked));
    dispatch(Actions.Indicators.filter());
  };

  return <div className='dashboard__left_side__row'>
    <Checkbox
      onChange={() => {
        change(event.target.checked)
      }}/>
    <div className='text title'>
      <div>{filter.name}</div>
    </div>
    <div className='info__button'>
      <Tooltip title={filter.query}>
        <InfoIcon/>
      </Tooltip>
    </div>
  </div>
}

/**
 * Filters Accordion.
 * @param {bool} expanded Is the accordion expanded.
 * @param {function} handleChange Function when the accordion show.
 */
export default function FiltersAccordion({ expanded, handleChange }) {
  const { filters } = useSelector(state => state.dashboard.data);
  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange('filters')}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        Filters
        {
          filters !== undefined ?
            <span>&nbsp;({filters.length}) </span> :
            <i>&nbsp;(Loading)</i>
        }
      </AccordionSummary>
      <AccordionDetails>
        {
          filters !== undefined ?
            filters.map(
              (filter, groupId) => (
                <div key={groupId} className='dashboard__filter'>
                  {
                    filter.options.length === 1 ? (
                      <FilterInput
                        key={0}
                        groupId={groupId} filterId={0}
                        filter={filter.options[0]}/>
                    ) : (

                      <Fragment>
                        <div
                          className='dashboard__filter__name'>{filter.title}</div>
                        <div className='dashboard__filter__content'>
                          {
                            filter.options.map(
                              (option, filterId) => (
                                <FilterInput
                                  key={filterId}
                                  groupId={groupId} filterId={filterId}
                                  filter={option}/>
                              )
                            )
                          }
                        </div>
                      </Fragment>
                    )
                  }
                </div>
              )
            )
            : <div>Loading</div>
        }
      </AccordionDetails>
    </Accordion>
  )
}