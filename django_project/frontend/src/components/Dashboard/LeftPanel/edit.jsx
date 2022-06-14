/* ==========================================================================
   LEFT PANEL EDITOR
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import Modal from "../../Modal";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import BasemapsEditSection from './Basemaps/edit'
import ReferenceLayerEditSection from './ReferenceLayer/edit'
import IndicatorsEditSection from './Indicators/edit'
import ContextLayersEditSection from './ContextLayers/edit'

/**
 * Edit section for the panel.
 */
export default function Edit() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState('reference-layer');
  const handleChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Fragment>
      <div
        className='setting__button'
        onClick={(event) => {
          event.stopPropagation();
        }}>
        <Tooltip title='Edit dashboard'>
          <SettingsIcon onClick={() => {
            setOpen(true)
          }}/>
        </Tooltip>
        <Modal
          className='dashboard__editor'
          open={open}
          onClosed={
            () => {
              setOpen(false)
            }
          }
        >
          <div className='dashboard__content-wrapper'>
            <ReferenceLayerEditSection
              expanded={expanded === 'reference-layer'}
              handleChange={
                (event, isExpanded) => {
                  handleChange('reference-layer', isExpanded)
                }
              }/>
            <BasemapsEditSection
              expanded={expanded === 'basemaps'}
              handleChange={
                (event, isExpanded) => {
                  handleChange('basemaps', isExpanded)
                }
              }/>
            <IndicatorsEditSection
              expanded={expanded === 'indicators'}
              handleChange={
                (event, isExpanded) => {
                  handleChange('indicators', isExpanded)
                }
              }/>
            <ContextLayersEditSection
              expanded={expanded === 'context-layers'}
              handleChange={
                (event, isExpanded) => {
                  handleChange('context-layers', isExpanded)
                }
              }/>
          </div>
        </Modal>
      </div>
    </Fragment>
  )
}
