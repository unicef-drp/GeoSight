/* ==========================================================================
   LINKS NAVBAR
   ========================================================================== */

import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Fade from '@mui/material/Fade';

/**
 * Link dropdown.
 * **/
export default function Links() {
  const navbarLinks = links;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (!navbarLinks) {
    return ''
  }
  return <div>
    <button onClick={handleClick}>
      <div>LINKS <ArrowDropDownIcon/></div>
    </button>
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
        navbarLinks.map(
          link => (
            <MenuItem key={link.id}>
              <a href={link.url}>{link.name}</a>
            </MenuItem>
          )
        )
      }
    </Menu>
  </div>
}