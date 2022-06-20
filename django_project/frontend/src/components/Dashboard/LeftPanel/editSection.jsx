/* ==========================================================================
   LEFT PANEL EDITOR
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Checkbox } from "@mui/material";
import { fetchingData } from '../../../Requests'
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";

/**
 * Edit section for the panel.
 * @param {boolean} expanded Expanded.
 * @param {function} handleChange Handle the accordion opened.
 * @param {string} title Title of editor.
 * @param {string} description Description of editor.
 * @param {boolean} required Is required.
 * @param {str} className className of modal.
 * @param {list} currentLayers Current Layer in state.
 * @param {string} urlAPI Url returning ALl layers.
 * @param {function} actionAddLayer Action to add Layer.
 * @param {function} actionRemoveLayer Action to remove Layer.
 * @param {React.Component} children React component to be rendered
 */
export default function EditSection(
  {
    expanded, handleChange, title, description, required,
    className, currentLayers, urlAPI,
    actionAddLayer, actionRemoveLayer, children
  }
) {
  const dispatch = useDispatch()
  const [allLayer, setAllLayer] = useState(null);

  useEffect(() => {
    if (!allLayer) {
      fetchingData(urlAPI, {}, {}, (response) => {
        setAllLayer(response)
      })
    }
  }, [allLayer]);

  // Update list of data
  const change = (checked, idx) => {
    if (allLayer && allLayer[idx]) {
      if (checked) {
        dispatch(actionAddLayer(allLayer[idx]))
      } else {
        if (!required || (required && currentLayers.length > 1)) {
          dispatch(actionRemoveLayer(allLayer[idx]))
        }
      }
    }
  };

  // Get current ids from all layer
  let ids = currentLayers ? currentLayers.map(function (row) {
    return row.id
  }) : [];
  const isError = (required && currentLayers.length === 0)
  const accordionError = `${className} ${isError ? 'error' : ''}`

  return (
    <Accordion
      className={accordionError}
      expanded={expanded}
      onChange={handleChange}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        <div><b className='light'>{title}</b></div>
        <div className='setting__helper'>{description}</div>
      </AccordionSummary>
      <AccordionDetails>
        {
          allLayer ?
            allLayer.map(
              (layer, idx) => (
                <div className='dashboard__left_side__row' key={idx}>
                  <Checkbox
                    checked={ids.includes(layer.id)}
                    onChange={(event) => {
                      change(event.target.checked, idx)
                    }}/>
                  {
                    React.Children.map(children, child => {
                      return React.cloneElement(child, { layer })
                    })
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
