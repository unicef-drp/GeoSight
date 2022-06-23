/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React from 'react';
import { useSelector } from "react-redux";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Edit from "../edit";

export default function ReferenceLayerSection() {
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  return (
    <Accordion
      expanded={true}
      className='reference-dataset'
    >
      <AccordionSummary>
        <div className='MuiAccordionSummary-title'>Reference Dataset</div>
        {
          editMode ? <Edit/> : ''
        }
      </AccordionSummary>
      <AccordionDetails>
        {
          referenceLayer.data && Object.keys(referenceLayer.data).length > 0 ?
            <div>
              {referenceLayer.data.name ?
                <div><b>Name :</b> {referenceLayer.data.name}</div> : ''}
              {referenceLayer.data.description ?
                <div><b>Description :</b> {referenceLayer.data.description}
                </div> : ''}
              {referenceLayer.data.source ?
                <div><b>Source :</b> {referenceLayer.data.source}</div> : ''}
            </div>
            :
            (
              referenceLayer.identifier ? <div>Loading</div> :
                <div>Please select a reference dataset.</div>
            )
        }
      </AccordionDetails>
    </Accordion>
  )
}
