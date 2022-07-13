import React from 'react';

import { AddButton } from '../../components/Elements/Button'
import Admin from './index';
import List from './Components/List'

import './style.scss';


/**
 * Admin List App
 * @param {list} columns Columns setup.
 * @param {String} pageName Page Name.
 * @param {String} listUrl Url for list row.
 * @param {React.Component} children React component to be rendered
 */
export default function AdminList(
  {
    columns, pageName,
    listUrl, rightHeader = null
  }
) {

  /** Render **/
  return (
    <Admin
      className='Indicator'
      pageName={pageName}
      rightHeader={
        rightHeader ? rightHeader : (
          <a href={urls.api.create}>
            <AddButton
              variant="secondary"
              text={"Add New " + pageName}
            />
          </a>
        )
      }>
      <List columns={columns} pageName={pageName} listUrl={listUrl}/>
    </Admin>
  );
}