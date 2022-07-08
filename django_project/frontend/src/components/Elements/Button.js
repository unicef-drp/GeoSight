import React from 'react';
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from '@mui/icons-material/Save';

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

/** Add button
 * @param {string} text Text of button.
 * @param {string} buttonProps Variant of Button.
 */
export function AddButton({ text, ...props }) {
  return (
    <ThemeButton {...props}>
      <AddCircleIcon/> &nbsp;&nbsp;{text}
    </ThemeButton>
  )
}
/** Save button
 * @param {string} text Text of button.
 * @param {string} buttonProps Variant of Button.
 */
export function SaveButton({ text, ...props }) {
  return (
    <ThemeButton {...props}>
      <SaveIcon/> &nbsp;&nbsp;{text}
    </ThemeButton>
  )
}