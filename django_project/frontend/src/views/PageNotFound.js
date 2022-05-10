import React from 'react';
import { createRoot } from "react-dom/client";

import BaseApp from './_BaseApp';

export default class App extends React.Component {
  render() {
    return (
      <BaseApp>
        <article>
          <header>
            <div>
              <div>
                <h1>Page not found</h1>
              </div>
            </div>
          </header>
        </article>
      </BaseApp>
    );
  }
}
const root = createRoot(document.getElementById('app'));
root.render(<App/>)
