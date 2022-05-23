/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';

import Modal, { ModalContent, ModalHeader } from "../../../Modal";
import { fetchingData } from '../../../../redux/reducers_api'
import Actions from '../../../../redux/actions'

export default function ReferenceLayerEditSection() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [referenceLayers, setReferenceLayers] = useState(null);
  const { referenceLayer } = useSelector(state => state.dashboard.data);


  /** Get All Reference Layers */
  useEffect(() => {
    if (!referenceLayers) {
      fetchingData(urls.referenceLayersListAPI, {}, (response, error) => {
        setReferenceLayers(response)
      })
    }
  }, [referenceLayers]);

  // Modal open
  const onOpen = () => {
    setOpen(true);
  };

  // Modal close
  const onClosed = () => {
    setOpen(false);
  };

  // Change reference layer
  const change = (idx) => {
    if (referenceLayers[idx]) {
      dispatch(
        Actions.ReferenceLayer.change(referenceLayers[idx])
      )
      setOpen(false);
    }
  };

  return (
    <Fragment>
      <Tooltip title="Edit Reference Layer">
        <SettingsIcon onClick={() => {
          onOpen()
        }}/>
      </Tooltip>

      <Modal
        open={open}
        onClosed={onClosed}
        className='modal__reference_layer__setting'
      >
        <ModalHeader>
          Select Reference Layer
        </ModalHeader>
        <ModalContent>
          {
            referenceLayers && referenceLayer ?
              referenceLayers.map(
                (layer, idx) => (
                  <div className='dashboard__left_side__row'
                       key={idx}>
                    <Checkbox
                      checked={layer.identifier === referenceLayer.identifier}
                      onChange={() => {
                        change(idx)
                      }}/>
                    <div className='text title'>
                      <div>
                        <div><b>Name :</b> {layer.name}</div>
                        <div><b>Description :</b> {layer.description}</div>
                        <div><b>Source :</b> {layer.source}</div>
                      </div>
                    </div>
                  </div>
                )
              )
              : <div>Loading</div>
          }
        </ModalContent>
      </Modal>
    </Fragment>
  )
}
