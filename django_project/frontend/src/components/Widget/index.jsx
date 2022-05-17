/* ==========================================================================
   RIGHT SIDE CONTAINER
   ========================================================================== */

import React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import './style.scss';

/**
 * Base widget that handler widget rendering
 * @param {string} title Title of widget
 * @param {string} description Description of widget
 * @param {bool} showTitle Show title on the top of widget
 * @param {React.Component} children React component to be rendered
 */
export default function Widget({ title, description, showTitle, children }) {
  return (
    <div className='widget'>
      <div className='title'>
        <div>{title}</div>
        <div><InfoIcon/></div>
      </div>
    </div>
  )
}
