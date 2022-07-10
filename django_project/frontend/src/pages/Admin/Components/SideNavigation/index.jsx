import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';
import { pageNames } from '../../index'

import './style.scss';

/**
 * Admin side navigation bad
 * @param {string} pageName Page name indicator
 */
export default function SideNavigation({ pageName }) {
  const indicatorList = urls.admin.indicatorList; // eslint-disable-line no-undef
  const basemapList = urls.admin.basemapList; // eslint-disable-line no-undef
  const contextLayerList = urls.admin.contextLayerList; // eslint-disable-line no-undef
  return (
    <div className='SideNavigation'>
      <a href='/' className='SideNavigation-Row'>
        <HomeIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Home</span>
      </a>
      <a href={indicatorList}
         className={'SideNavigation-Row ' + (pageName === pageNames.Indicators ? 'active' : '')}>
        <ListAltIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Indicators</span>
      </a>
      <a href={contextLayerList}
         className={'SideNavigation-Row ' + (pageName === pageNames.ContextLayer ? 'active' : '')}>
        <LayersIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Context Layer</span>
      </a>
      <a href={basemapList}
         className={'SideNavigation-Row ' + (pageName === pageNames.Basemaps ? 'active' : '')}>
        <MapIcon className='SideNavigation-Row-Icon'/>
        <span className='SideNavigation-Row-Name'>Basemaps</span>
      </a>
    </div>
  );
}