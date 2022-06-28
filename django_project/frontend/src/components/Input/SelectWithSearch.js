/* ==========================================================================
   Select with search
   ========================================================================== */
import React from "react";
import { Checkbox, TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon
  from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

/**
 * Select with placeholder
 * @param value Value of select.
 * @param {dict} options Options for selection.
 * @param {string} className Classname for Select.
 * @param {bool} disabled Is filter disabled or not.
 * @param {function} onChangeFn When the value changed.
 */
export function SelectWithSearch(
  { value, options, className, disabled = false, onChangeFn }
) {
  value = value === 0 ? '' : value
  return <Autocomplete
    className={className}
    value={value}
    options={options}
    disableCloseOnSelect
    getOptionLabel={(option) => option}
    renderInput={(params) => (
      <TextField {...params} placeholder="Select 1 or any"/>
    )}
    onChange={(event, values) => {
      onChangeFn(values ? values : '');
    }}
    disabled={disabled}
  />
}

/**
 * Multiple Select with placeholder
 * @param value Value of select.
 * @param {dict} options Options for selection.
 * @param {str} className Classname for Select.
 * @param {bool} disabled Is filter disabled or not.
 * @param {function} onChangeFn When the value changed.
 */
export function MultipleSelectWithSearch(
  { value, options, className, disabled = false, onChangeFn }
) {
  return <Autocomplete
    className={className}
    value={value}
    options={options}
    disableCloseOnSelect
    getOptionLabel={(option) => option}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option}
      </li>
    )}
    renderInput={(params) => (
      <TextField {...params} placeholder="Select 1 or any"/>
    )}
    onChange={(event, values) => {
      onChangeFn(values);
    }}
    disabled={disabled}
    multiple
  />
}