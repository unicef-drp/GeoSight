/* ==========================================================================
   Filters SELECTOR
   ========================================================================== */

import React from 'react';
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";

import FilterSection from './Control'

import './style.scss';

/**
 * Filters Accordion.
 */
export default function FiltersAccordion() {
  const { filters } = useSelector(state => state.dashboard.data);

  return (
    <Accordion
      className='FilterAccordion'
      expanded={true}
    >
      <AccordionDetails>
        {
          filters !== undefined ? <FilterSection/>
            : <div>Loading</div>
        }
      </AccordionDetails>
    </Accordion>
  )
}