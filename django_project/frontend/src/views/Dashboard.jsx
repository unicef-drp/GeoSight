import React from 'react';
import Map from "../components/Dashboard/Map";
import App, { render } from '../App';

// STYLES
import '../assets/styles/views/dashboard.scss';

function Dashboard() {
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

render(Dashboard)