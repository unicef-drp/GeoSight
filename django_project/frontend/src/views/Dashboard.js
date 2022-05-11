import React, { Component } from 'react';

import App from '../App';
import Map from "../components/Dashboard/Map";

// STYLES
import '../assets/styles/views/dashboard.scss';

export default class Dashboard extends Component {
  render() {
    return (
      <App className='page__dashboard'>
        <section className='page__dashboard__left_side'>
          <div className='page__dashboard__content'>Left side</div>
        </section>
        <section className='page__dashboard__map'>
          <Map/>
        </section>
        <section className='page__dashboard__right_side'>
          <div className='page__dashboard__content'>Right side</div>
        </section>
      </App>
    );
  }
}