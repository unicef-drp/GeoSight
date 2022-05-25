/* ==========================================================================
   SUMMARY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Actions from "../../redux/actions"
import Modal, { ModalContent, ModalHeader } from "../Modal";

/**
 * Edit section for widget.
 * @param {int} idx Index of widget
 * @param {object} data Widget Data.
 */
export default function EditSection({ idx, data }) {
  const dispatch = useDispatch()
  const { indicators } = useSelector(state => state.dashboard.data);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name ? data.name : '');
  const [description, setDescription] = useState(
    data.description ? data.description : ''
  );
  const [layerID, setLayerID] = useState(
    data.layer_id ? data.layer_id : ''
  );


  // Open modal
  const onOpen = () => {
    setOpen(true);
  };

  // Close modal
  const onClosed = () => {
    setOpen(false);
  };

  // Open modal if no name yet
  useEffect(() => {
    if (!data.name) {
      onOpen();
    }
  }, [data]);

  const onApply = () => {
    const newData = {
      ...data,
      ...{
        name: name,
        description: description,
        layer_id: layerID
      }
    }
    dispatch(Actions.Widget.update(idx, newData));
    onClosed();
  }

  const indicatorList = indicators.map(function (indicator) {
    return [indicator.id, indicator.name]
  })
  return (
    <Fragment>
      <div className='setting__button' onClick={(event) => {
        event.stopPropagation();
      }}>
        <Tooltip title='Change widget'>
          <SettingsIcon
            className='widget__button__editor'
            onClick={() => {
              onOpen()
            }}/>
        </Tooltip>

        <Modal
          open={open}
          onClosed={onClosed}
          className='modal__widget__editor'
        >
          <ModalHeader>
            {name ? "Change " + name : "New Widget"}
          </ModalHeader>
          <ModalContent>
            <FormControl>
              <InputLabel>Widget name</InputLabel>
              <Input type="text" placeholder="Widget name"
                     onChange={(event) => {
                       setName(event.target.value)
                     }}
                     value={name}
              />
            </FormControl>
            <FormControl>
              <InputLabel>Widget description</InputLabel>
              <Input type="text"
                     placeholder="Widget description"
                     onChange={(event) => {
                       setDescription(event.target.value)
                     }}
                     value={description}
              />
            </FormControl>
            <FormControl>
              <InputLabel>Widget description</InputLabel>
              <Select
                onChange={(event) => {
                  setLayerID(event.target.value)
                }}
                value={layerID}
              >
                {
                  indicatorList.map(function (indicator) {
                    return <MenuItem
                      value={indicator[0]}>{indicator[1]}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <Button variant="primary"
                    className="modal__widget__editor__apply"
                    onClick={onApply}
            >
              Apply
            </Button>
          </ModalContent>
        </Modal>
      </div>
    </Fragment>
  )
}
