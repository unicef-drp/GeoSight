/* ==========================================================================
   Value input for filters
   ========================================================================== */
import React, { Fragment } from "react";
import { Input, } from "@mui/material";
import {
  MultipleSelectWithSearch,
  SelectWithSearch
} from "../../../Input/SelectWithSearch";

export default function FilterValueInput(
  { operator, value, indicator, onChange }
) {
  return <Fragment>{
    operator === 'IN' ?
      (
        indicator ? <MultipleSelectWithSearch
          value={value} onChangeFn={onChange}
          options={indicator.data} className='FilterInput'/> : ''
      ) :
      (
        operator === '=' && indicator && isNaN(indicator.data[0]) ?
          <SelectWithSearch
            value={value} onChangeFn={onChange}
            options={indicator.data} className='FilterInput'/> :
          <Input
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