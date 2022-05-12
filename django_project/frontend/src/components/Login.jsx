import React, { useEffect, useState } from 'react';
import T from 'prop-types';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function LoginModal(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const authUrl = `${urls.login}?next=${window.location.pathname}` // eslint-disable-line no-undef
  const csrftoken = csrfmiddlewaretoken; // eslint-disable-line no-undef

  useEffect(() => {
    setModalIsOpen(props.modalIsOpen);
  }, [props.modalIsOpen])

  const closeSignIn = () => {
    setModalIsOpen(false);
    props.modalClosed();
  };

  return (
    <Modal show={modalIsOpen} onHide={closeSignIn}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form action={authUrl} method='POST'>
          <Form.Control
            type="hidden" name="csrfmiddlewaretoken"
            value={csrftoken}/>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text" name="username"
              placeholder="Enter username"/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password" name="password" placeholder="Password"/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

LoginModal.propTypes = {
  modalIsOpen: T.bool,
  modalClosed: T.func
};

export default LoginModal;