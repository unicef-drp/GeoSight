import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App, { render } from '../App';
import LeftPanel from '../components/dashboard/left-panel/LeftPanel'
import Map from "../components/dashboard/Map";
import RightPanel from '../components/dashboard/RightPanel'
import Actions from '../redux/actions/actions'

// STYLES
import '../assets/styles/views/dashboard.scss';

function Dashboard() {
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