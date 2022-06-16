import React, { useState } from "react";
import {
  OPERATOR,
  returnDataToExpression,
  returnSqlToDict
} from "../../../../utils/queryExtraction";
import Modal, { ModalContent, ModalHeader } from "../../../Modal";
import { Button, FormControl, Input, InputLabel } from "@mui/material";
import { SelectPlaceholder } from "../../../Input";

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
  const [name, setName] = useState(data.name)

  const sqlValue = returnSqlToDict(data.query)
  const initField = sqlValue.field
  const initOperator = sqlValue.operator
  const initValue = sqlValue.value

  const [field, setField] = useState(initField ? initField : '')
  const [operator, setOperator] = useState(initOperator ? initOperator : '')
  const [value, setValue] = useState(initValue ? initValue : '')

  const onSave = () => {
    if (field && operator) {
      update({
        ...data,
        name: name,
        query: returnDataToExpression(field, operator, value)
      })
    }
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
        {data.query ? "Update" : "Create"} filter
      </ModalHeader>
      <ModalContent>
        <FormControl>
          <InputLabel>Name</InputLabel>
          <Input
            type="text" placeholder="Filter Name" value={name}
            onChange={(value) => {
              setName(value.target.value)
            }}/>
        </FormControl>
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
          </div>
        </div>
        <Button
          variant="primary"
          className='save__button'
          disabled={!field || !name || !operator}
          onClick={onSave}>
          {data.query ? "Update" : "Create"}
        </Button>
      </ModalContent>
    </Modal>
  </div>
}
