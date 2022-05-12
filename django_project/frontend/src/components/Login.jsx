import React from 'react';
import T from 'prop-types';

import { Button, FormControl, Input, InputLabel } from '@mui/material'
import Modal, { ModalContent, ModalHeader } from './Modal'
// Styles
import '../assets/styles/component/login.scss';

function LoginModal({ open, onClosed }) {
  const authUrl = `${urls.login}?next=${window.location.pathname}` // eslint-disable-line no-undef
  const csrftoken = csrfmiddlewaretoken; // eslint-disable-line no-undef

  return (
    <Modal
      open={open}
      onClosed={onClosed}
      className='modal--login'
    >
      <ModalHeader>
        Sign In
      </ModalHeader>
      <ModalContent>
        <form action={authUrl} method='POST'>
          <FormControl>
            <InputLabel>Username</InputLabel>
            <Input type="text" name="username" placeholder="Enter username"
                   required="true"/>
          </FormControl>
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input type="password" name="password" placeholder="Password"
                   required="true"/>
          </FormControl>
          <Button variant="primary" type="submit"
                  className="modal--login--submit">
            Sign In
          </Button>
          <Input
            type="hidden" name="csrfmiddlewaretoken"
            value={csrftoken}/>
        </form>
      </ModalContent>
    </Modal>
  )
}

LoginModal.propTypes = {
  open: T.bool,
  onClosed: T.func
};

export default LoginModal;