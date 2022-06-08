/* ==========================================================================
   Select with placeholder
   ========================================================================== */
import React, { useEffect, useState } from 'react';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/**
 * Select with placeholder
 * @param {str} placeholder Placeholder.
 * @param {array} list list of data.
 * @param {str} initValue Value of input.
 * @param {function} onChangeFn When the value changed.
 */
export default function SelectPlaceholder(
  { placeholder, list, initValue, onChangeFn }
) {
  const [value, setValue] = useState(initValue ? initValue : 0);


  // Get indicator data
  useEffect(() => {
    const selectedID = list.filter((data) => {
      return data.id === initValue
    })
    if (selectedID.length === 0) {
      setValue(0);
    } else {
      setValue(initValue);
    }
  }, [initValue, list]);

  return <Select
    onChange={
      event => {
        setValue(event.target.value);
        onChangeFn(event.target.value);
      }
    }
    value={value}
    className={value === 0 ? 'MuiInputBase-empty' : ''}
  >
    <MenuItem
      key={0}
      value={0}
      className='MuiMenuItem-placeholder'
    >{placeholder}
    </MenuItem>
    {
      list.map(data => {
        return <MenuItem
          key={data.id}
          value={data.id}>{data.name}
        </MenuItem>
      })
    }
  </Select>
}