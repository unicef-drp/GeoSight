import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Store
import { store } from './store';
import c from 'classnames';
import T from 'prop-types';

import NavBar from './components/NavBar/Index';

// STYLES
import './assets/styles/views/global.scss';
import './assets/styles/mui.scss';
import './assets/styles/views/base.scss';
import './assets/styles/views/form.scss';
import { createRoot } from "react-dom/client";


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

/** --------------------------------
 * RENDER APP
 * --------------------------------
 */
export function render(App, connectConf) {
  const root = createRoot(document.getElementById('app'));
  root.render(
    <Provider store={store}>
      <App/>
    </Provider>
  )
}