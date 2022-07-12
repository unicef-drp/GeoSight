/* ==========================================================================
   SUMMARY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { DEFINITION } from "../Widget/index"
import Modal, { ModalContent, ModalHeader } from "../Modal";
import { cleanLayerData } from "../../utils/indicatorData"

/**
 * Edit section for widget.
 * @param {bool} open Is open or close.
 * @param {Function} onCreated Set Parent Open.
 * @param {object} data Widget Data.
 * @param {React.Component} children React component to be rendered
 */
export default function WidgetEditor({ open, onCreated, data, children }) {
  const { indicators } = useSelector(state => state.dashboard.data);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layerID, setLayerID] = useState('');
  const [layerType, setLayerType] = useState('');
  const [operation, setOperation] = useState('');
  const [unit, setUnit] = useState('');
  const [property, setProperty] = useState('');
  const [additionalData, setAdditionalData] = useState({});


  // onSubmitted
  useEffect(() => {
    setName(data.name ? data.name : '')
    setDescription(data.description ? data.description : '')
    setLayerID(data.layer_id ? data.layer_id : '')
    setLayerType(data.layer_used ? data.layer_used : definition.WidgetLayerUsed.INDICATOR)
    setOperation(data.operation ? data.operation : DEFINITION.WidgetOperation.SUM)
    setUnit(data.unit ? data.unit : '')
    setProperty(data.property ? data.property : '')
    setAdditionalData({})
  }, [data])

  // Close modal
  const onClosed = () => {
    onCreated();
  };

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
    onCreated(newData)
  }

  // Format indicator list
  const indicatorList = indicators.map(function (indicator) {
    return [indicator.id, indicator.name]
  })

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
            // disabled={!name || !layerType || !operation || !property}
          >
            Apply
          </Button>
        </ModalContent>
      </Modal>
    </Fragment>
  )
}
