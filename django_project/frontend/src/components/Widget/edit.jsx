/* ==========================================================================
   SUMMARY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import { DEFINITION } from "../Widget/index"
import Actions from "../../redux/actions/dashboard"
import Modal, { ModalContent, ModalHeader } from "../Modal";
import { cleanLayerData } from "../../utils/indicatorData"

/**
 * Edit section for widget.
 * @param {int} idx Index of widget
 * @param {object} data Widget Data.
 * @param {React.Component} children React component to be rendered
 */
export default function EditSection({ idx, data, children }) {
  const dispatch = useDispatch()
  const { indicators } = useSelector(state => state.dashboard.data);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(data.name ? data.name : '');
  const [description, setDescription] = useState(data.description ? data.description : '');
  const [layerID, setLayerID] = useState(data.layer_id ? data.layer_id : '');
  const [layerType, setLayerType] = useState(data.layer_used ? data.layer_used : definition.WidgetLayerUsed.INDICATOR);
  const [operation, setOperation] = useState(data.operation ? data.operation : DEFINITION.WidgetOperation.SUM);
  const [unit, setUnit] = useState(data.unit ? data.unit : '');
  const [property, setProperty] = useState(data.property ? data.property : '');
  const [additionalData, setAdditionalData] = useState({});

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
      ...additionalData,
      ...{
        name: name,
        description: description,
        layer_id: layerID,
        layer_used: layerType,
        operation: operation,
        unit: unit,
        property: property,
      }
    }
    dispatch(Actions.Widget.update(idx, newData));
    onClosed();
  }

  const indicatorList = indicators.map(function (indicator) {
    return [indicator.id, indicator.name]
  })

  // Delete widget
  const deleteWidget = () => {
    dispatch(Actions.Widget.remove(idx));
  }

  let selectedData = {};
  try {
    if (layerID && layerType) {
      selectedData = cleanLayerData(layerID, layerType, indicators, null, true)[0]
      if (!selectedData) {
        selectedData = {}
      }
    }
  } catch (error) {
  }


  return (
    <Fragment>
      <RemoveCircleIcon
        className="remove__button"
        onClick={deleteWidget}/>

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
          className='modal__widget__editor MuiFormControl-Form'
        >
          <ModalHeader onClosed={onClosed}>
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
              <InputLabel>Unit</InputLabel>
              <Input type="text"
                     placeholder="Unit"
                     onChange={(event) => {
                       setUnit(event.target.value)
                     }}
                     value={unit}
              />
            </FormControl>
            <FormControl>
              <InputLabel>Layer Type</InputLabel>
              <Select
                onChange={(event) => {
                  setLayerType(event.target.value)
                }}
                value={layerType}
              >
                {
                  Object.keys(definition.WidgetLayerUsed).map((key, index) => (
                    <MenuItem
                      key={index}
                      value={definition.WidgetLayerUsed[key]}>{definition.WidgetLayerUsed[key]}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Source Layer</InputLabel>
              <Select
                onChange={(event) => {
                  setLayerID(event.target.value)
                }}
                value={layerID}
              >
                {
                  indicatorList.map(function (indicator, index) {
                    return <MenuItem key={index}
                                     value={indicator[0]}>{indicator[1]}
                    </MenuItem>
                  })
                }
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Operation</InputLabel>
              <Select
                onChange={(event) => {
                  setOperation(event.target.value)
                }}
                value={operation}
              >
                {
                  Object.keys(DEFINITION.WidgetOperation).map((key, index) => (
                    <MenuItem
                      key={index}
                      value={DEFINITION.WidgetOperation[key]}>{DEFINITION.WidgetOperation[key]}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Source Value</InputLabel>
              <Select
                onChange={(event) => {
                  setProperty(event.target.value)
                }}
                value={property}
              >
                {
                  Object.keys(selectedData).map((key, index) => (
                    <MenuItem
                      key={index}
                      value={key}>{key}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            {
              React.Children.map(children, child => {
                return React.cloneElement(child, {
                  idx,
                  data,
                  selectedData,
                  setAdditionalData
                })
              })
            }
            <Button
              variant="primary"
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
