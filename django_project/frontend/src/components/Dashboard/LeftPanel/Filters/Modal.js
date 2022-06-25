import React, { useEffect, useState } from "react";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { OPERATOR } from "../../../../utils/queryExtraction";
import Modal, { ModalContent, ModalHeader } from "../../../Modal";
import { SelectPlaceholder } from "../../../Input";
import FilterValueInput from './ValueInput'

/***
 * Return modal to edit filter
 * @param {boolean} open Open.
 * @param {function} setOpen Function to open/close.
 * @param {dict} data Data of filter.
 * @param {list} fields Fields data
 * @param {function} update Function to update the data.
 */
export default function FilterEditorModal(
  { open, setOpen, data, fields, update }
) {
  /** Update value based on operator **/
  const updateValue = (value) => {
    if (operator === 'IN' && !Array.isArray(value)) {
      return value ? [value] : []
    } else if (operator !== 'IN' && Array.isArray(value)) {
      return value[0] ? value[0] : ''
    }
    return value
  }

  const [field, setField] = useState(data.field ? data.field : '')
  const [operator, setOperator] = useState(data.operator ? data.operator : '')
  const [value, setValue] = useState(data.value ? data.value : '')
  const [name, setName] = useState(data.name ? data.name : '')
  const [description, setDescription] = useState(data.description ? data.description : '')

  let currentValue = updateValue(value);

  useEffect(() => {
    setField(data.field ? data.field : '')
    setOperator(data.operator ? data.operator : '')
    setValue(data.value ? data.value : '')
  }, [data]);

  /** When data saved */
  const onSave = () => {
    let currentValue = updateValue(value);
    if (field && operator) {
      update({
        ...data,
        field: field,
        operator: operator,
        value: currentValue,
        name: name,
        description: description,
      })
    }
  }
  const indicator = fields.filter((fieldData) => {
    return fieldData.id === field
  })[0]

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
      <ModalHeader onClosed={
        () => {
          setOpen(false)
        }
      }>
        {data.field ? "Update" : "Create"} filter
      </ModalHeader>
      <ModalContent>
        <div>
          <FormControl>
            <InputLabel><b>Filter Name*</b></InputLabel>
            <Input
              type="text" placeholder="Filter name" value={name}
              onChange={(event) => {
                setName(event.target.value)
              }}/>
          </FormControl>
          <FormControl>
            <InputLabel>Description</InputLabel>
            <Input
              type="text" placeholder="Filter description" value={description}
              onChange={(event) => {
                setDescription(event.target.value)
              }}/>
          </FormControl>
        </div>
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
            <FilterValueInput
              value={currentValue} operator={operator}
              indicator={indicator} onChange={setValue}/>
          </div>
        </div>
        <Button
          variant="primary"
          className='save__button'
          disabled={!field || !operator || !name}
          onClick={onSave}>
          {
            data.field ? "Update" : "Create"
          }
        </Button>
      </ModalContent>
    </Modal>
  </div>
}
