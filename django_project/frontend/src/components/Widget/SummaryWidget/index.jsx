/* ==========================================================================
   GENERAL WIDGET FOR SHOWING SUMMARY OF DATA PER GROUP
   ========================================================================== */

import React, { Fragment } from 'react';
import { numberWithCommas } from '../../../utils/main'
import { DEFINITION } from "../index"

/**
 * General widget to show summary of data.
 * @param {int} idx Index of widget
 * @param {list} data List of data {value, date}
 * @param {object} widgetData Widget Data
 */
export default function SummaryWidget(
  { idx, data, widgetData }
) {
  const {
    name, unit, operation
  } = widgetData

  /**
   * Return value of widget
   * @returns {JSX.Element}
   */
  function getValue() {
    if (data !== null) {
      switch (operation) {
        case DEFINITION.WidgetOperation.SUM:
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
    <Fragment>
      <div className='widget__sw'>
        <div className='widget__sw__title'>{getValue()}</div>
        <div>{name}</div>
      </div>
    </Fragment>
  )
}
