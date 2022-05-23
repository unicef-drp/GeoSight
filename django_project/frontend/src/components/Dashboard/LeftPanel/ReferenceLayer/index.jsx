/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React from 'react';
import { useSelector } from "react-redux";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";

import ReferenceLayerEditSection from "./edit";

export default function ReferenceLayerSection() {
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  return (
    <Accordion
      expanded={true}
      className='reference-dataset'
    >
      <AccordionSummary>
        Reference Dataset
        {editMode ? <ReferenceLayerEditSection/> : ''}
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
  )
}
