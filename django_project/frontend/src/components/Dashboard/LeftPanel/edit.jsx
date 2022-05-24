/* ==========================================================================
   LEFT PANEL EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Checkbox } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';

import Modal, { ModalContent, ModalHeader } from "../../Modal";
import { fetchingData } from '../../../redux/reducers_api'

/**
 * Edit section for the panel.
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
    title, description, required, className,
    currentLayers, urlAPI,
    actionAddLayer, actionRemoveLayer, children
  }
) {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [allLayer, setAllLayer] = useState(null);

  useEffect(() => {
    if (!allLayer) {
      fetchingData(urlAPI, {}, (response, error) => {
        setAllLayer(response)
      })
    }
  }, [allLayer]);

  // Open modal
  const onOpen = () => {
    setOpen(true);
  };

  // Close modal
  const onClosed = () => {
    setOpen(false);
  };

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

  return (
    <Fragment>
      <div className='setting__button' onClick={(event) => {
        event.stopPropagation();
      }}>
        <Tooltip title={title}>
          <SettingsIcon onClick={() => {
            onOpen()
          }}/>
        </Tooltip>

        <Modal
          open={open}
          onClosed={onClosed}
          className={className}
        >
          <ModalHeader>
            {title}
            <div className='setting__helper'>{description}</div>
          </ModalHeader>
          <ModalContent>
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
          </ModalContent>
        </Modal>
      </div>
    </Fragment>
  )
}
