import React, { Component } from 'react'

import App, { render } from '../App';

// STYLES
import '../assets/styles/views/home.scss';

export default class Home extends Component {
  render() {
    return (
      <App className='page__home'>
        <article>
          <header>
            <div>
              <div>
                <h1>Test</h1>
              </div>
            </div>
          </header>
          <div>
            <div>
              Test
            </div>
          </div>
        </article>
      </App>
    );
  }
}
render(Home)