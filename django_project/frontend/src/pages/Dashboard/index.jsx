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
  const {
    indicators,
    referenceLayer
  } = useSelector(state => state.dashboard.data);

  const indicatorsData = useSelector(state => state.indicators);
  const referenceLayerData = useSelector(state => state.referenceLayer);

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  // Set indicators data
  useEffect(() => {
    if (indicators) {
      dispatch(
        Actions.Indicators.initData(indicators)
      )
    }
  }, [indicators]);

  // Set ReferenceLayer data
  useEffect(() => {
    if (referenceLayer) {
      dispatch(
        Actions.ReferenceLayer.initData(referenceLayer)
      )
    }
  }, [referenceLayer]);

  return (
    <App className='dashboard'>
      {indicatorsData && referenceLayerData ?
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