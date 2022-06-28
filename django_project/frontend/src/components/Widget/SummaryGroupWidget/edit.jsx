/* ==========================================================================
   SUMMARY WIDGET EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { FormControl, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/**
 * Edit section for widget.
 * @param {int} idx Index of widget
 * @param {object} data Widget Data.
 * @param {object} selectedData selectedData Data.
 * @param {function} setAdditionalData selectedData Data.
 */
export default function SummaryGroupWidgetEditSection(
  { idx, data, selectedData, setAdditionalData }
) {
  const [property2, setProperty2] = useState(data.property_2 ? data.property_2 : '');

  // When state change, call setAdditionalData
  useEffect(() => {
    setAdditionalData({
      property_2: property2
    })
  }, [property2])

  return (
    <Fragment>
      <FormControl>
        <InputLabel>Grouping value</InputLabel>
        <Select
          onChange={(event) => {
            setProperty2(event.target.value)
          }}
          value={property2}
        >
          {
            Object.keys(selectedData).map((key, index) => (
              <MenuItem
                key={index}
                value={key}>{key}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Fragment>
  )
}
