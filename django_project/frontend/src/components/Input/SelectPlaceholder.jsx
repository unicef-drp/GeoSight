/* ==========================================================================
   Select with placeholder
   ========================================================================== */
import React, { useEffect, useState } from 'react';
import Select from "@mui/material/Select";
import ListSubheader from '@mui/material/ListSubheader';
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
      return (data.id && data.id === initValue) || (data === initValue)
    })
    if (selectedID.length === 0) {
      setValue(0);
    } else {
      setValue(initValue);
    }
  }, [initValue, list]);

  // Make list to a group
  const listInGroup = {}
  const listAndGroup = []
  if (list[0] && list[0].group) {
    list.forEach(data => {
      if (!listInGroup[data.group]) {
        listAndGroup.push(data.group);
        listInGroup[data.group] = [];
      }
      listAndGroup.push(data)
    })
  }

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
      listAndGroup.length > 0 ? (
        listAndGroup.map(data => {
          return data.id ?
            <MenuItem
              key={data.id}
              value={data.id}>
              <div>{data.name}</div>
              {data.subName ?
                <div
                  className='MuiMenuItem-subname'>&nbsp;({data.subName})</div> : ''}
            </MenuItem> :
            <ListSubheader key={data}>{data}</ListSubheader>
        })
      ) : (
        list.map(data => {
          return <MenuItem
            key={data.id ? data.id : data}
            value={data.id ? data.id : data}>
            <div>{data.name ? data.name : data}</div>
            {data.subName ?
              <div
                className='MuiMenuItem-subname'>&nbsp;({data.subName})</div> : ''}
          </MenuItem>
        })
      )
    }
  </Select>
}