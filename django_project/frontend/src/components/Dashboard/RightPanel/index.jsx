/* ==========================================================================
   RIGHT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';

import LeftRightToggleButton, { LEFT, RIGHT } from '../../ToggleButton'
import Widget, { GeneralWidget } from '../../Widget'

import './style.scss';

export default function RightPanel() {
  const [state, setState] = useState(RIGHT);

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
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
          <Widget title='Test' description='This is description'>
            <GeneralWidget title='Test' unit='person' value={1}/>
          </Widget>
        </div>
      </div>
    </section>
  )
}
