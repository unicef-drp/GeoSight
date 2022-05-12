import React from 'react';
import i18n from "i18next";
import User from './User'

// Style
import '../../assets/styles/components/navbar.scss';


export default function NavBar() {
  const { icon, site_title } = preferences;
  return (
    <header className='page__header'>
      <ul className='page__header-menu'>
        <li className='page__header-logo'>
          <a
            href='/'
            title={i18n.t('Homepage')}
            className='page__header-link'
          >
            <img src={icon} alt="Logo"/>
          </a>
        </li>
        <li className='page__header-title'>
          <a
            href='/'
            title={i18n.t('Homepage')}
            className='page__header-link'
          >
            {site_title}
          </a>
        </li>
        <li>
          <User/>
        </li>
      </ul>
    </header>
  )
}

