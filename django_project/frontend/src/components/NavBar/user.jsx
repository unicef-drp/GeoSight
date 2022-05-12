import React, { Fragment, useState } from 'react';

import Dropdown from "react-bootstrap/Dropdown"
import LoginModal from '../Login'


export default function User() {
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

  // Render
  if (username) {
    return (
      <Dropdown>
        <Dropdown.Toggle>
          {username}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {
            is_staff ?
              <Dropdown.Item href={adminUrl}>
                Admin
              </Dropdown.Item> :
              ''
          }
          <Dropdown.Item href={logoutUrl}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
      ;
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
          modalIsOpen={modalIsOpen} modalClosed={closeSignIn}
        />
      </Fragment>
    );
  }
}
