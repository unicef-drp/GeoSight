import React, { Fragment, useState } from 'react';
import { useSelector } from "react-redux";

import Dropdown from "react-bootstrap/Dropdown"
import LoginModal from '../Login'


export default function User() {
  const { username, is_staff } = useSelector(state => state.user);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
              <Dropdown.Item href="/admin/">
                Admin
              </Dropdown.Item> :
              ''
          }
          <Dropdown.Item href="/auth/logout/?next=/">Logout</Dropdown.Item>
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
