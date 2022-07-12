import React, { Fragment, useEffect } from 'react';
import App, { render } from '../../app';
import { store } from '../../store/Dashboard';
import { useDispatch, useSelector } from 'react-redux';

import Actions from '../../redux/actions/dashboard'
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

  useEffect(() => {
    dispatch(
      Actions.IndicatorsData.update(data.indicators)
    )
  }, [data]);

  return (
    <App>
      <div className='dashboard'>
        {Object.keys(data).length > 0 ?
          <Fragment>
            <LeftPanel/>
            <Map/>
            <RightPanel/>
          </Fragment> :
          <div></div>
        }
      </div>
    </App>
  );
}

render(Dashboard, store)