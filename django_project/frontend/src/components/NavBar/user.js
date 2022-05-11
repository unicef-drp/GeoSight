import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Dropdown from "react-bootstrap/Dropdown"
import T from 'prop-types';
import LoginModal from '../Login'

class User extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeSignIn = this.closeSignIn.bind(this)
    this.openSignIn = this.openSignIn.bind(this)
  }

  render() {
    const { modalIsOpen } = this.state;
    const { username, is_staff } = this.props.user;
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
            onClick={this.openSignIn}
          >
            Sign In
          </div>
          <LoginModal
            modalIsOpen={modalIsOpen} modalClosed={this.closeSignIn}
          />
        </Fragment>
      );
    }
  }

  openSignIn() {
    this.setState({
      modalIsOpen: true
    })
  }

  closeSignIn() {
    this.setState({
      modalIsOpen: false
    })
  }
}

User.propTypes = {
  user: T.object
};

function mapStateToProps(state, props) {
  return {
    user: state.user
  };
}

function dispatcher(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  dispatcher
)(User);

