import React, { Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import LoginModal from '../Login'

export default function User() {
  /**
   Menu functions
   **/
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   Signin Modal Functions
   **/
  const { username, is_staff } = user;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const logoutUrl = urls.logout; // eslint-disable-line no-undef
  const adminUrl = urls.admin; // eslint-disable-line no-undef
  const openSignIn = () => {
    setModalIsOpen(true);
  };
  const closeSignIn = () => {
    setModalIsOpen(false);
  };

  if (username) {
    return (
      <div>
        <Button
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {username}
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
            is_staff ?
              <MenuItem>
                <a href={adminUrl}>Admin</a>
              </MenuItem> : ''
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
        <div
          className='sign-in'
          onClick={openSignIn}
        >
          Sign In
        </div>
        <LoginModal
          open={modalIsOpen}
          onClosed={closeSignIn}
        />
      </Fragment>
    );
  }
}