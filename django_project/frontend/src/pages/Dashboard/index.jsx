import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App, { render } from '../../app';

import Actions from '../../redux/actions/actions'

import LeftPanel from '../../components/Dashboard/LeftPanel'
import Map from "../../components/Dashboard/Map";
import RightPanel from '../../components/Dashboard/RightPanel'

import './style.scss';

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  return (
    <App className='dashboard'>
      <LeftPanel />
      <Map/>
      <RightPanel/>
    </App>
  );
}

render(Dashboard)