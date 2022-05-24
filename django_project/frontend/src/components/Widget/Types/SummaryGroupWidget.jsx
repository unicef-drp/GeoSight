/* ==========================================================================
   GENERAL WIDGET FOR SHOWING SUMMARY OF DATA
   ========================================================================== */

import React from 'react';

/**
 * General widget to show summary of data.
 * @param {string} name Name of widget
 * @param {string} unit Unit of data
 * @param {list} data List of data {value, date}
 * @param {string} operation Operation of data
 */
export default function SummaryGroupWidget(
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
          let maxValue = 0;
          let byGroup = {}
          data.forEach(function (rowData) {
            const rowValue = parseFloat(rowData.value);
            if (!isNaN(rowValue)) {
              if (!byGroup[rowData.value2]) {
                byGroup[rowData.value2] = {
                  value: 0,
                  perc: 0
                }
              }
              byGroup[rowData.value2].value += parseFloat(rowData.value)
            }
          })

          // We need to check max value for all group
          for (const [key, value] of Object.entries(byGroup)) {
            if (maxValue < value.value) {
              maxValue = value.value
            }
          }

          // Get percentage of values
          for (const [key, value] of Object.entries(byGroup)) {
            value.perc = ((value.value / maxValue) * 80) + 20;
          }

          // Sort group
          var sorted = Object.keys(byGroup).map(function (key) {
            return [key, byGroup[key]];
          });
          sorted.sort(function (first, second) {
            return second[1].value - first[1].value;
          });
          return <table>
            <tbody>
            {
              sorted.map((value, index) => (
                <tr key={index} className='widget__sgw__row'>
                  <td className='widget__sgw__row__name'>{value[0]}</td>
                  <td>
                    <div
                      style={{ width: value[1].perc + '%' }}>{value[1].value}</div>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        default:
          return <div className='widget__error'>Operation Not Found</div>;
      }
    }
    return <i>Loading</i>
  }

  return (
    <div className='widget__sw widget__sgw'>
      <div className='widget__gw__title'>{name}</div>
      <div className='widget__content'>{getValue()}</div>
    </div>
  )
}
