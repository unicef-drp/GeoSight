import React, { Component } from 'react';
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import c from 'classnames';
import NavBar from '../components/Navbar';

import './mui.scss';
import './global.scss';
import './app.scss';
import './form.scss';


/**
 * Base App
 * @param {string} className Class name for modal
 * @param {React.Component} children React component to be rendered
 */
export default function App({ className, children }) {
  return (
    <div className={c('page', className)}>
      <NavBar/>
      <main>
        {children}
      </main>
    </div>
  );
}

/** --------------------------------
 * RENDER APP
 * --------------------------------
 */
export function render(App, store) {
  const root = createRoot(document.getElementById('app'));
  root.render(
    <Provider store={store}>
      <App/>
    </Provider>
  )
}
