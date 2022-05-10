import React, { Component } from 'react';
import c from 'classnames';
import T from 'prop-types';

import NavBar from '../components/NavBar';

// STYLES
import '../assets/styles/views/_global.scss';
import '../assets/styles/views/_base.scss';

class BaseApp extends Component {
  render() {

    const { className, children } = this.props;

    return (
      <div className={c('page', className)}>
        <NavBar/>
        <main>
          {children}
        </main>
      </div>
    );
  }
}

BaseApp.propTypes = {
  className: T.string,
  children: T.node
};

export default BaseApp;
