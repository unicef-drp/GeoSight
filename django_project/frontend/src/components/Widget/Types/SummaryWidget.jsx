/* ==========================================================================
   GENERAL WIDGET FOR SHOWING SUMMARY OF DATA PER GROUP
   ========================================================================== */

import React from 'react';
import { numberWithCommas } from '../../../utils/main'

/**
 * General widget to show summary of data.
 * @param {string} name Name of widget
 * @param {string} unit Unit of data
 * @param {list} data List of data {value, date}
 * @param {string} operation Operation of data
 */
export default function SummaryWidget(
  { name, unit, data, operation }
) {

  /**
   * Return value of widget
   * @returns {JSX.Element}
   */
  function getValue() {
    if (data !== null) {
      switch (operation) {
        case definition.PluginOperation.SUM:
          let total = 0;
          data.forEach(function (rowData) {
            const rowValue = parseFloat(rowData.value);
            if (!isNaN(rowValue)) {
              total += rowValue;
            }
          })
          return <span>{numberWithCommas(total)} {unit}</span>
        default:
          return <div className='widget__error'>Operation Not Found</div>;
      }
    }
    return <i>Loading</i>
  }

  return (
    <div className='widget__sw'>
      <div className='widget__sw__title'>{getValue()}</div>
      <div>{name}</div>
    </div>
  )
}
