/* ==========================================================================
   Value input for filters
   ========================================================================== */
import React, { Fragment, useEffect, useState } from "react";
import { Input, } from "@mui/material";
import Slider from '@mui/material/Slider';
import {
  MultipleSelectWithSearch,
  SelectWithSearch
} from "../../../Input/SelectWithSearch";

export default function FilterValueInput(
  { operator, value, indicator, onChange }
) {
  const [initValue, setInitValue] = useState(value);

  let min = null
  let max = null
  if (indicator?.data) {
    const data = indicator.data.filter(row => {
      return row !== undefined
    }).map(row => {
      return parseFloat(row)
    })
    min = Math.min(...data)
    max = Math.max(...data)
    if (isNaN(min)) {
      min = null
    }
    if (isNaN(max)) {
      max = null
    }
  }
  useEffect(() => {
    setInitValue(value)
    if (min && max && (initValue === undefined || initValue === '')) {
      setInitValue(0)
    }
  }, [value]);

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
          (
            ['<', '<=', '>', '>='].includes(operator) && (min === null || max === null) ?
              <Input
                className='FilterInput'
                type="text"
                placeholder="Value"
                value={value}
                onChange={(event) => {
                  onChange(event.target.value);
                }}/> : (
                <div className='MuiInputSliderWithInput'>
                  <div className='MuiInputSlider'>
                    <Slider
                      value={initValue}
                      step={1}
                      min={min}
                      max={max}
                      onChange={(event) => {
                        setInitValue(event.target.value);
                      }}
                      track={['>', '>='].includes(operator) ? "inverted" : ""}
                      onChangeCommitted={(e) => onChange(initValue)}
                    />
                  </div>
                  <Input
                    value={initValue}
                    size="small"
                    onChange={(event) => {
                      onChange(event.target.value);
                    }}
                    inputProps={{
                      min: min,
                      max: max,
                      type: 'number',
                    }}
                  />
                </div>
              )
          )
      )
  }
  </Fragment>
}