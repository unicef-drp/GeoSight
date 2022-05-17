/* ==========================================================================
   Toggle Button
   ========================================================================== */

import React, { useEffect, useState } from 'react';

export const LEFT = 'left';
export const RIGHT = 'right';

/**
 * Left-Right toggle button
 * @param {string} initState Initial state of toggle between left or right
 * @param {function} onLeft Function when state is on lft
 * @param {function} onRight Function when state is on right
 */
export default function LeftRightToggleButton(
  { initState, onLeft, onRight }
) {
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
  const className = `left-right-toggle-button ${state}`
  return (
    <div className={className}
         onClick={() => {
           change()
         }}>
      <div></div>
    </div>
  )
}
