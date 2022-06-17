import React, { useEffect, useState } from "react";
import { OPERATOR } from "../../../../utils/queryExtraction";
import Modal, { ModalContent, ModalHeader } from "../../../Modal";
import {
  Button,
  Checkbox,
  Input,
  ListItemText,
  OutlinedInput,
  Select
} from "@mui/material";
import { SelectPlaceholder } from "../../../Input";
import MenuItem from "@mui/material/MenuItem";

/***
 * Return modal to edit filter
 * @param {boolean} open Open.
 * @param {function} setOpen Function to open/close.
 * @param {dict} data Data of filter.
 * @param {list} fields Fields data
 */
export default function FilterEditorModal(
  { open, setOpen, data, fields, update }
) {
  const [field, setField] = useState(data.field ? data.field : '')
  const [operator, setOperator] = useState(data.operator ? data.operator : '')
  const [value, setValue] = useState(data.value ? data.value : '')
  let currentValue = value;

  useEffect(() => {
    setField(data.field ? data.field : '')
    setOperator(data.operator ? data.operator : '')
    setValue(data.value ? data.value : '')
  }, [data]);

  const onSave = () => {
    let currentValue = value;
    // Setup data
    if (operator === 'IN' && !Array.isArray(value)) {
      currentValue = value ? [value] : []
    } else if (operator !== 'IN' && Array.isArray(value)) {
      currentValue = value[0] ? value[0] : ''
    }
    if (field && operator) {
      update({
        ...data,
        field: field,
        operator: operator,
        value: currentValue
      })
    }
  }
  const indicator = fields.filter((fieldData) => {
    return fieldData.id === field
  })[0]

  // Setup data
  if (operator === 'IN' && !Array.isArray(value)) {
    currentValue = value ? [value] : []
  } else if (operator !== 'IN' && Array.isArray(value)) {
    currentValue = value[0] ? value[0] : ''
  }

  return <div
    onClick={(event) => {
      event.stopPropagation()
    }}>
    <Modal
      className='FilterEditModal'
      open={open}
      onClosed={
        () => {
          setOpen(false)
        }
      }
    >
      <ModalHeader>
        {data.field ? "Update" : "Create"} filter
      </ModalHeader>
      <ModalContent>
        <div className='FilterEditModalQueryWrapper'>
          <div>Select fields, operation and default value for the filter.</div>
          <div className='FilterEditModalQuery'>
            <SelectPlaceholder
              placeholder='Pick the field'
              list={fields}
              initValue={field}
              onChangeFn={(value) => {
                setField(value)
              }}/>
            <SelectPlaceholder
              placeholder='Pick an operation'
              list={
                Object.keys(OPERATOR).map((key, idx) => {
                  return { id: key, name: OPERATOR[key] }
                })
              }
              initValue={operator}
              onChangeFn={(value) => {
                setOperator(value)
              }}/>
            {
              operator === 'IN' ?
                <Select
                  className='FilterInput'
                  multiple
                  value={currentValue}
                  onChange={(event) => {
                    setValue(event.target.value);
                  }
                  }
                  input={<OutlinedInput label="Tag"/>}
                  renderValue={(selected) => selected.length + ' selected'}
                >
                  {indicator ? indicator.data.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={value.indexOf(name) > -1}/>
                      <ListItemText primary={name}/>
                    </MenuItem>
                  )) : ''}
                </Select> :
                (
                  operator === '=' && indicator && isNaN(indicator.data[0]) ?
                    <Select
                      className='FilterInput'
                      value={currentValue}
                      onChange={
                        (event) => {
                          setValue(event.target.value);
                        }
                      }
                    >
                      {indicator ? indicator.data.map((name) => (
                        <MenuItem key={name} value={name}>
                          <ListItemText primary={name}/>
                        </MenuItem>
                      )) : ''}
                    </Select> :
                    <Input
                      key="input1"
                      className='FilterInput'
                      type="text"
                      placeholder="Value"
                      value={currentValue}
                      onChange={(event) => {
                        setValue(event.target.value);
                      }}/>
                )

            }
          </div>
        </div>
        <Button
          variant="primary"
          className='save__button'
          disabled={!field || !operator}
          onClick={onSave}>
          {
            data.field ? "Update" : "Create"
          }
        </Button>
      </ModalContent>
    </Modal>
  </div>
}
