/* ==========================================================================
   LINKS NAVBAR
   ========================================================================== */

import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Links() {
  /**
   * Link dropdown
   * **/
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
    <Button onClick={handleClick}>
      <div>LINKS <ArrowDropDownIcon/></div>
    </Button>
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
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