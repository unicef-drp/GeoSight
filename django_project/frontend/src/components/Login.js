import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import T from 'prop-types';


export default class LoginModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: props.modalIsOpen
    };
    this.closeSignIn = this.closeSignIn.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (prevState.modalIsOpen !== this.props.modalIsOpen) {
      this.setState({
        modalIsOpen: this.props.modalIsOpen
      })
    }
  }

  render() {
    const { modalIsOpen } = this.state;
    const authUrl = '/auth/login/?next=' + window.location.pathname
    return <Modal show={modalIsOpen} onHide={this.closeSignIn}>
      <Modal.Header closeButton>
        <Modal.Title>Sign In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form action={authUrl} method='POST'>
          <Form.Control
            type="hidden" name="csrfmiddlewaretoken"
            value={csrfmiddlewaretoken}/>
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
  }

  closeSignIn() {
    this.setState({
      modalIsOpen: false
    })
    this.props.modalClosed()
  }
}

LoginModal.propTypes = {
  modalIsOpen: T.bool,
  modalClosed: T.func
};