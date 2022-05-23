/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import { Checkbox } from "@mui/material";

import Actions from '../../../../redux/actions'
import Modal, { ModalContent, ModalHeader } from "../../../Modal";
import { fetchingData } from '../../../../redux/reducers_api'

export default function BasemapsEditSection() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [allBasemaps, setAllBasemaps] = useState(null);
  const { basemapsLayers } = useSelector(state => state.dashboard.data);

  /** Get All Reference Layers */
  useEffect(() => {
    if (!allBasemaps) {
      fetchingData(urls.basemapListAPI, {}, (response, error) => {
        setAllBasemaps(response)
      })
    }
  }, [allBasemaps]);

  // Modal open
  const onOpen = () => {
    setOpen(true);
  };

  // Modal close
  const onClosed = () => {
    setOpen(false);
  };

  // Update basemap list
  const change = (checked, idx) => {
    if (allBasemaps[idx]) {
      if (checked) {
        dispatch(
          Actions.Basemaps.add(allBasemaps[idx])
        )
      } else {
        if (basemapsLayers.length > 1) {
          dispatch(
            Actions.Basemaps.remove(allBasemaps[idx])
          )
        }
      }
    }
  };

  // Get current basemaps that already added
  let ids = [];
  if (basemapsLayers) {
    ids = basemapsLayers.map(function (row) {
      return row.id
    })
  }

  return (
    <Fragment>
      <div className='setting__button'>
        <Tooltip title="Edit Basemap List">
          <SettingsIcon onClick={() => {
            onOpen()
          }}/>
        </Tooltip>

        <Modal
          open={open}
          onClosed={onClosed}
          className='modal__basemap__setting'
        >
          <ModalHeader>
            Select Basemap List
            <div className='setting__helper'>
              Select one or more basemaps and select on the map to make it as
              default
            </div>
          </ModalHeader>
          <ModalContent>
            {
              allBasemaps ?
                allBasemaps.map(
                  (layer, idx) => (
                    <div className='dashboard__left_side__row'
                         key={idx}>
                      <Checkbox
                        checked={ids.includes(layer.id)}
                        onChange={(event) => {
                          change(event.target.checked, idx)
                        }}/>
                      <div className='text title'>
                        <div><b>Name :</b> {layer.name}</div>
                        <div><b>Url :</b> {layer.url}</div>
                      </div>
                      <div>
                        <img src={layer.icon}/>
                      </div>
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
