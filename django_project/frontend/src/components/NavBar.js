import React from 'react';
import i18n from "i18next";

// STYLES
import '../assets/styles/component/navbar.scss';

export default class NavBar extends React.PureComponent {
  render() {
    return (
      <header className='page__header'>
        <ul className='page__header-menu'>
          <li>
            <a
              href='/'
              title={i18n.t('Homepage')}
              className='page__header-link'
            >
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href='/'
              title={i18n.t('Homepage')}
              className='page__header-link'
            >
              <span>Home</span>
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
