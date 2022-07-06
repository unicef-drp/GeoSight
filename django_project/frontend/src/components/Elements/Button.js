import React from 'react';
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

/** Main button
 * @param {string} buttonProps Variant of Button.
 * @param {React.Component} children React component to be rendered
 */
export function ThemeButton({ children, ...props }) {
  return (
    <Button {...props}>
      {children}
    </Button>
  )
}

/**Add button
 * @param {string} text Text of button.
 * @param {string} buttonProps Variant of Button.
 * @param {function} onClick Button clicked.
 */
export function AddButton({ text, ...props }) {
  return (
    <ThemeButton {...props}>
      <AddCircleIcon/> &nbsp;&nbsp;{text}
    </ThemeButton>
  )
}