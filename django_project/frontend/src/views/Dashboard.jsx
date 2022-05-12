import React from 'react';
import Map from "../components/dashboard/Map";
import App, { render } from '../App';
import LeftPanel from '../components/dashboard/LeftPanel'
import RightPanel from '../components/dashboard/RightPanel'

// STYLES
import '../assets/styles/views/dashboard.scss';

function Dashboard() {
  return (
    <App className='dashboard'>
      <LeftPanel/>
      <RightPanel/>
      <Map/>
    </App>
  );
}

render(Dashboard)