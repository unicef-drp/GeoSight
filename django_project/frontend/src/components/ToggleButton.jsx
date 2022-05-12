/* ==========================================================================
   Toggle Button
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import T from "prop-types";

export const LEFT = 'left';
export const RIGHT = 'right';

function LeftRightToggleButton({ initState, onLeft, onRight }) {
  const [state, setState] = useState(LEFT);

  useEffect(() => {
    setState(initState)
  }, [])

  const change = () => {
    const newState = state === RIGHT ? LEFT : RIGHT;
    setState(newState);
    if (newState === LEFT) {
      onLeft()
    } else if (newState === RIGHT) {
      onRight()
    }
  };

  return (
    <div className="left-right-toggle-button"
         onClick={() => {
           change()
         }}>
      {state === LEFT ?
        <ArrowLeftIcon/>
        :
        <ArrowRight/>
      }
    </div>
  )
}

LeftRightToggleButton.propTypes = {
  initState: T.string,
  onLeft: T.func,
  onRight: T.func
};

export default LeftRightToggleButton;