/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React from 'react';
import { useSelector } from "react-redux";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";

export default function ReferenceLayerSection() {
  const { referenceLayer } = useSelector(state => state.dashboard.data)
  const referenceLayerData = useSelector(state => state.referenceLayerData)
  const data = referenceLayerData[referenceLayer.identifier]

  return (
    <Accordion
      expanded={true}
      className='reference-dataset'
    >
      <AccordionSummary>
        <div className='MuiAccordionSummary-title'>Reference Dataset</div>
      </AccordionSummary>
      <AccordionDetails>
        {
          data && data.fetched ?
            data.error ?
              <div className='error'>
                {data.error.toString()}
              </div> :
              <div>
                {data.data.name ?
                  <div><b>Name :</b> {data.data.name}</div> : ''}
                {data.data.description ?
                  <div><b>Description :</b> {data.data.description}
                  </div> : ''}
                {data.data.source ?
                  <div><b>Source :</b> {data.data.source}</div> : ''}
              </div>
            :
            <div>Loading</div>
        }
      </AccordionDetails>
    </Accordion>
  )
}
