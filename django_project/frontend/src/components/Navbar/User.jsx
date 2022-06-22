/* ==========================================================================
   USER NAVBAR
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import LoginModal from '../Login'

/**
 * User dropdown.
 **/
export default function User() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Signin Modal Functions.
   **/
  const { username, is_staff } = user;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const logoutUrl = urls.logout; // eslint-disable-line no-undef
  const adminUrl = urls.admin; // eslint-disable-line no-undef
  const backupsUrl = urls.backups; // eslint-disable-line no-undef
  const indicatorsUrl = urls.indicators; // eslint-disable-line no-undef
  const openSignIn = () => {
    setModalIsOpen(true);
  };
  const closeSignIn = () => {
    setModalIsOpen(false);
  };

  if (username) {
    return (
      <div>
        <Button onClick={handleClick}>
          <div>{username} <ArrowDropDownIcon/></div>
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
            is_staff ? (
              <MenuItem>
                <a href={adminUrl}>Admin</a>
              </MenuItem>
            ) : ''
          }
          {
            is_staff ? (
              <MenuItem>
                <a href={backupsUrl}>Backups</a>
              </MenuItem>
            ) : ''
          }
          {
            is_staff ? (
              <MenuItem>
                <a href={indicatorsUrl}>Indicators</a>
              </MenuItem>
            ) : ''
          }
          <MenuItem>
            <a href={logoutUrl}>Logout</a>
          </MenuItem>
        </Menu>
      </div>
    )
  } else {
    return (
      <Fragment>
        <Button onClick={openSignIn}>
          SIGNIN
        </Button>
        <LoginModal
          open={modalIsOpen}
          onClosed={closeSignIn}
        />
      </Fragment>
    );
  }
}