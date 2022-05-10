import React, { Component } from 'react';
import { createRoot } from "react-dom/client";

import BaseApp from './_BaseApp';
import Map from "../components/Dashboard/Map";

// STYLES
import '../assets/styles/views/dashboard.scss';

export default class App extends Component {
  render() {
    return (
      <BaseApp className='page__dashboard'>
        <section className='page__dashboard__left_side'>
          <div className='page__dashboard__content'>Left side</div>
        </section>
        <section className='page__dashboard__map'>
          <Map/>
        </section>
        <section className='page__dashboard__right_side'>
          <div className='page__dashboard__content'>Right side</div>
        </section>
      </BaseApp>
    );
  }
}

const root = createRoot(document.getElementById('app'));
root.render(<App/>)
