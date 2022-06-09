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

import FilterEditSection from './edit'
import Actions from '../../../../redux/actions'
import { returnInGroup } from '../../../../utils/filters'

import './style.scss';

/**
 * Render input of filter.
 * @param {object} filterId ID of filter.
 * @param {object} filter Filter data.
 */
export function FilterInput({ filterId, filter }) {
  const dispatch = useDispatch();
  const change = (checked) => {
    dispatch(Actions.Filters.changeState(filterId, checked));
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
    {editMode ? <FilterEditSection
      filterId={filterId}
      filterData={filter}/> : ''}
  </div>
}

/**
 * Filters Accordion.
 * @param {bool} expanded Is the accordion expanded.
 * @param {function} handleChange Function when the accordion show.
 */
export default function FiltersAccordion({ expanded, handleChange }) {
  const { filters } = useSelector(state => state.dashboard.data);
  let filtersInGroup = returnInGroup(filters);

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
        {editMode ? <FilterEditSection/> : ''}
      </AccordionSummary>
      <AccordionDetails>
        {
          filters !== undefined ?
            Object.keys(filtersInGroup).map(
              (groupName, idx) => (
                <div key={groupName} className='dashboard__filter'>
                  {
                    filtersInGroup[groupName].length === 1 ? (
                      <FilterInput
                        key={0}
                        groupId={groupName} filterId={0}
                        filter={filtersInGroup[groupName][0]}/>
                    ) : (

                      <Fragment>
                        <div
                          className='dashboard__filter__name'>{groupName}</div>
                        <div className='dashboard__filter__content'>
                          {
                            filtersInGroup[groupName].map(
                              (filter) => (
                                <FilterInput
                                  key={filter.id}
                                  filterId={filter.id}
                                  filter={filter}/>
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