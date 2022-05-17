/* ==========================================================================
   LOGIN COMPONENT
   ========================================================================== */

import React from 'react';

import { Button, FormControl, Input, InputLabel } from '@mui/material'
import Modal, { ModalContent, ModalHeader } from '../Modal'

import './style.scss';

/**
 * Login for modal
 * @param {bool} open Initial state if modal is open or not
 * @param {function} onClosed Function when modal closed
 */
export default function LoginModal({ open, onClosed }) {
  const authUrl = `${urls.login}?next=${window.location.pathname}` // eslint-disable-line no-undef
  const csrftoken = csrfmiddlewaretoken; // eslint-disable-line no-undef

  return (
    <Modal
      open={open}
      onClosed={onClosed}
      className='modal__login'
    >
      <ModalHeader>
        Sign In
      </ModalHeader>
      <ModalContent>
        <form action={authUrl} method='POST'>
          <FormControl>
            <InputLabel>Username</InputLabel>
            <Input type="text" name="username" placeholder="Enter username"
                   required={true}/>
          </FormControl>
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input type="password" name="password" placeholder="Password"
                   required={true}/>
          </FormControl>
          <Button variant="primary" type="submit"
                  className="modal__login__submit">
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
