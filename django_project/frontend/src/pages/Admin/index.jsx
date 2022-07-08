import React from 'react';
import App from '../../app';

import SideNavigation from './SideNavigation'
import './style.scss';

export const pageNames = {
  Indicators: 'indicator'
}
/**
 * Base Admin App
 * @param {string} pageName Current page name.
 * @param {JSX.Element} rightHeader Right header component.
 * @param {React.Component} children React component to be rendered
 */
export default function Admin({ pageName, rightHeader, children }) {
  return (
    <App className='Admin'>
      <SideNavigation pageName={pageName}/>
      <div className='AdminContent'>
        <div className='AdminContentHeader'>
          <div className='AdminContentHeader-Left'>
            <b className='light'
               dangerouslySetInnerHTML={{ __html: contentTitle }}></b>
          </div>
          <div className='AdminContentHeader-Right'>
            {rightHeader ? rightHeader : ''}
          </div>
        </div>
        {children}
      </div>
    </App>
  );
}
