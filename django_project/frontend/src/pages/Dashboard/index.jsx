import React, { Fragment, useEffect } from 'react';
import App, { render } from '../../app';
import { useDispatch, useSelector } from 'react-redux';

import Actions from '../../redux/actions/actions'
import LeftPanel from '../../components/Dashboard/LeftPanel'
import Map from '../../components/Dashboard/Map'
import RightPanel from '../../components/Dashboard/RightPanel'

import './style.scss';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  return (
    <App className='dashboard'>
      {data ?
        <Fragment>
          <LeftPanel/>
          <Map/>
          <RightPanel/>
        </Fragment> :
        <div></div>
      }
    </App>
  );
}

render(Dashboard)