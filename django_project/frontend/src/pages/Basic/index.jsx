import React from 'react';

import App from '../../app';

import './style.scss';

/**
 * Basic Page App
 */
export default function BasicPage({ className, children }) {
  return (
    <App className={className}>
      <div className='PageContent'>
        {children}
      </div>
    </App>
  )
}