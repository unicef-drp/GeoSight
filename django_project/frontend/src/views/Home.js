import React, { Component } from 'react'
import { createRoot } from 'react-dom/client';

import BaseApp from './_BaseApp';

// STYLES
import '../assets/styles/views/home.scss';

export default class App extends Component {
  render() {
    return (
      <BaseApp className='page__home'>
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
      </BaseApp>
    );
  }
}
const root = createRoot(document.getElementById('app'));
root.render(<App/>)