import React, { Fragment, useState } from "react";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";

import './style.scss';

/** More action
 * @param {JSX.Element} moreIcon Start icon on the input.
 * @param {React.Component} children React component to be rendered
 */
export default function MoreAction({ moreIcon, children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <div onClick={handleClick} className='MoreActionIcon'>
        {moreIcon}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        TransitionComponent={Fade}
      >
        {
          children ? (
            React.Children.map(children, child => {
              if (child) {
                return (
                  <MenuItem className='MoreActionItem'>{
                    React.cloneElement(child)
                  }</MenuItem>
                )
              } else {
                return ''
              }
            })
          ) : ''
        }
      </Menu>
    </Fragment>
  )
}