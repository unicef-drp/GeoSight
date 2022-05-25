/* ==========================================================================
   WIDGET SELECTION MEMBER
   ========================================================================== */

import React from 'react';
import { useDispatch } from "react-redux";
import Actions from "../../redux/actions"

/**
 * Widget Selection Member.
 * @param {string} title Title of editor.
 * @param {string} description Description of editor.
 * @param {function} onClick When element clicked
 * @param {object} defaultData Default Data to be added.
 * @param {React.Component} children React component to be rendered
 */
export default function WidgetSelectionMember(
  {
    title, description, onClick,
    defaultData, children
  }
) {
  const dispatcher = useDispatch();
  const clicked = () => {
    onClick();
    dispatcher(Actions.Widget.add(defaultData));
  }
  return <div className="widget__selection__member" onClick={clicked}>
    <div><b className='light'>{title}</b></div>
    <div className="setting__helper">{description}</div>
  </div>
}