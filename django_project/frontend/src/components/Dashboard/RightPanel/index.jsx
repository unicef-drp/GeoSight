/* ==========================================================================
   RIGHT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import { useSelector } from "react-redux";

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Widget from '../../Widget'

import './style.scss';

export default function RightPanel() {
  const [state, setState] = useState(RIGHT);
  const { widgets } = useSelector(state => state.dashboard.data);

  const onLeft = () => {
    setState(LEFT);
  };
  const onRight = () => {
    setState(RIGHT);
  };

  const className = `dashboard__panel dashboard__right_side ${state}`
  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className='dashboard__content-wrapper'>
        <div className='dashboard__content'>
          {
            widgets ?
              widgets.map(
                widget => (
                  <Widget key={widget.id} data={widget}/>
                )
              ) : <div className='dashboard__right_side__loading'>Loading</div>
          }
        </div>
      </div>
    </section>
  )
}
