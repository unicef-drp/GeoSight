import React, { useState } from "react";

import Tooltip from '@mui/material/Tooltip';
import './style.scss';

/** More action
 * @param {String} text Text to be copied
 */
export default function CopyToClipboard({ text }) {
  const [open, setOpen] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setOpen(true)
    setTimeout(function () {
      setOpen(false)
    }, 1000);
  }
  return (
    <Tooltip
      placement="right"
      PopperProps={{
        disablePortal: true,
      }}
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title="Copied"
    >
      <span className='CopyToClipboard' onClick={() => copy()}>
        {text}
      </span>
    </Tooltip>
  )
}