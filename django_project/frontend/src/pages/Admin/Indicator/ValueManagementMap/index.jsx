import React from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import Admin, { pageNames } from '../../index';
import Map from './Map'
import './style.scss';

/**
 * ValueManagementMap Form App
 */
export default function ValueManagementMap() {

  return (
    <Admin
      className='Indicator'
      pageName={pageNames.Indicators}>

      <div className='ManagementMap'>
        <Map/>
      </div>
    </Admin>
  );
}

render(ValueManagementMap, store)