import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';

import { pageNames } from '../index'

import './style.scss';

/**
 * Admin side navigation bad
 * @param {string} pageName Page name indicator
 */
export default function SideNavigation({ pageName }) {
  const indicatorsUrl = urls.admin.indicatorList; // eslint-disable-line no-undef
  return (
    <div className='SideNavigation'>
      <a href='/' className='SideNavigation-Row'>
        <HomeIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Home</span>
      </a>
      <a href={indicatorsUrl}
         className={'SideNavigation-Row ' + (pageName === pageNames.IndicatorsList ? 'active' : '')}>
        <ListAltIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Indicators</span>
      </a>
    </div>
  );
}