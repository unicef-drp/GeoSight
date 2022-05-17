import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../app';
import { render } from '../../app';

import Actions from '../../redux/actions/actions'

import LeftPanel from '../../components/Dashboard/LeftPanel'
import Map from "../../components/Dashboard/Map";
import RightPanel from '../../components/Dashboard/RightPanel'

import './style.scss';

export default function Dashboard() {
  const { data } = useSelector(state => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  const { selectedBasemap } = useSelector(state => state.map);
  return (
    <App className='dashboard'>
      <LeftPanel data={data}/>
      <Map/>
      <RightPanel/>
    </App>
  );
}

render(Dashboard)