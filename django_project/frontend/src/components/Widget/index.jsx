/* ==========================================================================
   WIDGET
   ========================================================================== */

import React, { useState } from 'react';
import InfoIcon from "@mui/icons-material/Info";
import './style.scss';

/**
 * Base widget that handler widget rendering
 * @param {string} title Title of widget
 * @param {string} description Description of widget
 * @param {boolean} showTitle Show title on the top of widget
 * @param {React.Component} children React component to be rendered
 */
export default function Widget(
  { title, description, children }
) {
  const [showInfo, setShowInfo] = useState(false);

  const showInfoHandler = () => {
    setShowInfo(!showInfo)
  };

  return (
    <div className='widget'>
      <InfoIcon onClick={() => {
        showInfoHandler()
      }}/>
      <div className='widget__content'>
        {children}
      </div>
      {
        showInfo ?
          <div className='widget__info'>
            <div className='widget__info__title'>{title}</div>
            <div className='widget__info__content'>{description}</div>
          </div> : ''
      }
    </div>
  )
}

export { default as GeneralWidget } from './GeneralWidget';