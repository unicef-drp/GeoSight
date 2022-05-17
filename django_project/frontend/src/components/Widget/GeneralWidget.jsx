/* ==========================================================================
   GENERAL WIDGET FOR SHOWING SUMMARY OF DATA
   ========================================================================== */

import React from 'react';

/**
 * General widget to show summary of data
 * @param {string} title Title of widget
 * @param {string} unit Unit of data
 * @param {number} value Value of data
 */
export default function GeneralWidget({ unit, title, value }) {
  return (
    <div className='widget__gw'>
      <div className='widget__gw__title'>{value} {unit}</div>
      <div>{title}</div>
    </div>
  )
}
