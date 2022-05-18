/* ==========================================================================
   GENERAL WIDGET FOR SHOWING SUMMARY OF DATA
   ========================================================================== */

import React from 'react';
import { numberWithCommas } from '../../../utils/main'

/**
 * General widget to show summary of data
 * @param {string} title Title of widget
 * @param {string} unit Unit of data
 * @param {list} data List of data {value, date}
 * @param {string} operation Operation of data
 */
export default function GeneralWidget(
  { title, unit, data, operation }
) {

  /**
   * Return value of widget
   * @returns {JSX.Element}
   */
  function getValue() {
    if (data !== null) {
      switch (operation) {
        case 'Sum':
          let value = 0;
          data.forEach(function (rowData) {
            value += rowData.value;
          })
          return <span>{numberWithCommas(value)} {unit}</span>
        default:
          return <div className='widget__error'>Operation Not Found</div>;
      }
    }
    return <i>Loading</i>
  }

  return (
    <div className='widget__gw'>
      <div className='widget__gw__title'>{getValue()}</div>
      <div>{title}</div>
    </div>
  )
}
