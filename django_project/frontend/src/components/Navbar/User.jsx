/* ==========================================================================
   USER NAVBAR
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Fade from '@mui/material/Fade';

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
  const { username, full_name, is_staff } = user;
  const logoutUrl = urls.logout; // eslint-disable-line no-undef
  const loginUrl = urls.login; // eslint-disable-line no-undef
  const backupsUrl = urls.backups; // eslint-disable-line no-undef

  // Admin URLS
  const adminUrl = urls.admin.djangoAdmin; // eslint-disable-line no-undef
  const dashboardUrl = urls.admin.dashboardList; // eslint-disable-line no-undef

  if (username) {
    return (
      <div>
        <button onClick={handleClick}>
          <AccountCircleIcon/>
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
            is_staff ? (
              <MenuItem>
                <a href={dashboardUrl}>Admin</a>
              </MenuItem>
            ) : ''
          }
          {
            is_staff ? (
              <MenuItem>
                <a href={adminUrl}>Django Admin</a>
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
          <MenuItem>
            <a href={logoutUrl}>Logout</a>
          </MenuItem>
        </Menu>
      </div>
    )
  } else {
    return (
      <Fragment>
        <a href={loginUrl}>
          <button>
            SIGNIN
          </button>
        </a>
      </Fragment>
    );
  }
}