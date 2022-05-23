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

export default function IndicatorsEditSection() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false);
  const [allIndicators, setAllIndicators] = useState(null);
  const { indicators } = useSelector(state => state.dashboard.data);

  /** Get All Reference Layers */
  useEffect(() => {
    if (!allIndicators) {
      fetchingData(urls.indicatorListAPI, {}, (response, error) => {
        setAllIndicators(response)
      })
    }
  }, [indicators]);

  // Modal open
  const onOpen = (event) => {
    setOpen(true);
  };

  // Modal close
  const onClosed = () => {
    setOpen(false);
  };

  // Update basemap list
  const change = (checked, idx) => {
    if (allIndicators[idx]) {
      if (checked) {
        dispatch(
          Actions.Indicators.add(allIndicators[idx])
        )
      } else {
        if (indicators.length > 1) {
          dispatch(
            Actions.Indicators.remove(allIndicators[idx])
          )
        }
      }
    }
  };

  // Get current basemaps that already added
  let ids = [];
  if (indicators) {
    ids = indicators.map(function (row) {
      return row.id
    })
  }

  return (
    <Fragment>
      <div onClick={(event) => {
        event.stopPropagation();
      }}>
        <Tooltip title="Edit Indicators List">
          <SettingsIcon onClick={(event) => {
            onOpen();
          }}/>
        </Tooltip>

        <Modal
          open={open}
          onClosed={onClosed}
          className='modal__basemap__setting'
        >
          <ModalHeader>
            Select Indicators List
            <div className='setting__helper'>
              Must select one or more indicators for the dashboard.
            </div>
          </ModalHeader>
          <ModalContent>
            {
              allIndicators ?
                allIndicators.map(
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
                        <div><b>Source :</b> {layer.source}</div>
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
