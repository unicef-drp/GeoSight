/* ==========================================================================
   WIDGET SELECTION MEMBER
   ========================================================================== */

import React from 'react';

/**
 * Widget Selection Member.
 * @param {string} title Title of editor.
 * @param {string} description Description of editor.
 * @param {function} onClick When element clicked
 */
export default function WidgetSelectionMember(
  {
    title, description, onClick
  }
) {
  return <div className="widget__selection__member" onClick={onClick}>
    <div><b className='light'>{title}</b></div>
    <div className="setting__helper">{description}</div>
  </div>
}