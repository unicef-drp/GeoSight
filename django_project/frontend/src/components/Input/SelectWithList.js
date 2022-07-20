import React from 'react';
import Select from "react-select";

/** Main button
 * @param {string} buttonProps Variant of Button.
 * @param {list} list List of data.
 * @param {str} value Value of data.
 */
export function SelectWithList({ list, value, ...props }) {
  let defaultValue = null
  if (props.isMulti) {
    defaultValue = []
  }
  const options = []
  if (list) {
    list.map((row, idx) => {
      const option = {
        value: row.value !== undefined ? row.value : row,
        label: row.name !== undefined ? row.name : row
      }
      if (!props.isMulti) {
        if ((value !== undefined && value === option.value) || (props.required && idx === 0)) {
          defaultValue = option
        }
      } else {
        if ((value !== undefined && value.includes(option.value)) || (props.required && idx === 0)) {
          defaultValue.push(option)
        }
      }
      options.push(option)
    })
  }

  return (
    <Select
      options={options} value={defaultValue} {...props}/>
  )
}