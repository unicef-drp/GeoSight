import React from 'react'

import App, { render } from '../App';

// STYLES
import '../assets/styles/views/home.scss';

function Home() {
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

render(Home)