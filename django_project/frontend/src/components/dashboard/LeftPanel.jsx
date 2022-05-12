/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import LeftRightToggleButton, { LEFT, RIGHT } from '../ToggleButton'

import '../../assets/styles/components/dashboard/left-panel.scss';

export default function LeftPanel() {
  const [state, setState] = useState(LEFT);


  const onLeft = () => {
    setState(LEFT);
  };
  const onRight = () => {
    setState(RIGHT);
  };
  const className = `dashboard__panel dashboard__left_side ${state}`
  return (
    <section className={className}>
      <LeftRightToggleButton
        initState={state}
        onLeft={onLeft}
        onRight={onRight}/>
      <div className='dashboard__content'>Left side</div>
    </section>
  )
}
