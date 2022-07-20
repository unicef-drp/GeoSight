/* ==========================================================================
   NAVBAR
   ========================================================================== */

import React from 'react';
import $ from 'jquery';
import i18n from "i18next";

import User from './User'
import Links from './Links'

import './style.scss';

/**
 * Navbar.
 * **/
export default function NavBar() {
  const { icon, site_title } = preferences;

  // Set width of logo
  // Not working using css on firefox
  $('.page__header-logo').width($('.page__header-link').width());

  return (
    <header>
      <div className='NavHeader'>
        <ul className='NavHeader Menu'>
          <li className='NavHeaderLogo'>
            <a
              href='/'
              title={i18n.t('Homepage')}
              className='nav-header-link'
            >
              <img src={icon} alt="Logo"/>
            </a>
          </li>
          <li className='NavHeaderTitle'>
            <button type='<button'>
              <a
                href='/'
                title={i18n.t('Homepage')}
                className='NavHeaderLink'
              >
                {site_title}
              </a>
            </button>
          </li>
          <li className='NavHeaderRight First'>
            <Links/>
          </li>
          <li className='NavHeaderRight'>
            <User/>
          </li>
        </ul>
      </div>
    </header>
  )
}

