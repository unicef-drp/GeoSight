/* ==========================================================================
   LEFT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import LeftRightToggleButton, { LEFT, RIGHT } from '../ToggleButton'

import '../../assets/styles/components/dashboard/left-panel.scss';

/**
 * Left panel
 * @param {object} data Data of dashboard
 */
export default function LeftPanel({ data }) {
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
      <div className='dashboard__content'>
        {
          data && data.indicators ?
            data.indicators.map(
              indicator => (
                <div key={indicator.id}>
                  {indicator.group}/{indicator.name}
                </div>
              )
            )
            : <div>Loading</div>
        }
      </div>
    </section>
  )
}
