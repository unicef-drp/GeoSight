import React, { Fragment } from "react";
import {
  Checkbox,
  Input,
  ListItemText,
  OutlinedInput,
  Select
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

export default function FilterValueInput(
  { operator, value, indicator, onChange }
) {
  return <Fragment>{
    operator === 'IN' ?
      <Select
        className='FilterInput'
        multiple
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
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
            value={value}
            onChange={
              (event) => {
                onChange(event.target.value);
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
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}/>
      )
  }
  </Fragment>
}