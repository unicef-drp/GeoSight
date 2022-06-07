import React, { Fragment, useEffect } from 'react';
import App, { render } from '../../app';
import alasql from 'alasql';
import { useDispatch, useSelector } from 'react-redux';

import Actions from '../../redux/actions'
import LeftPanel from '../../components/Dashboard/LeftPanel'
import Map from '../../components/Dashboard/Map'
import RightPanel from '../../components/Dashboard/RightPanel'
import SaveDashboard from '../../components/Dashboard/Save'

import './style.scss';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  var test = [{ R: 1, b: 10 }, { a: 2, b: 20, c: 3 }, { a: 1, b: 30 }];
  var test2 = [{ a: 1, b: 12 }, { a: 2, b: 20 }, { a: 1, b: 33 }];
  var res = alasql('SELECT * FROM ? test LEFT JOIN ? test2 ON test.R = test2.a', [test, test2]);

  return (
    <App className='dashboard'>
      {Object.keys(data).length > 0 ?
        <Fragment>
          <LeftPanel/>
          <Map/>
          <RightPanel/>
          {editMode ? <SaveDashboard/> : ''}
        </Fragment> :
        <div></div>
      }
    </App>
  );
}

render(Dashboard)