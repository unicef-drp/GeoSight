import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import App, { render } from '../../../../app';
import { pageNames } from '../../index';
import { store } from '../../../../store/Dashboard';
import Actions from "../../../../redux/actions/dashboard";
import SideNavigation from "../../Components/SideNavigation";

// Dashboar Form
import SummaryDashboardForm from './Summary'
import BasemapsForm from './Basemaps'
import IndicatorsForm from './Indicators'
import ContextLayerForm from './ContextLayer'

import '../../../Dashboard/style.scss';
import './style.scss';

/**
 * Dashboard Preview Section
 */
export function DashboardPreview() {
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
    <div className='dashboard'>
      {Object.keys(data).length > 0 ?
        <Fragment>
          {/*<LeftPanel/>*/}
          {/*<Map/>*/}
          {/*<RightPanel/>*/}
          {/*<SaveDashboard/>*/}
        </Fragment> :
        <div></div>
      }
    </div>
  )
}

/**
 * Dashboard Form Section
 */
export function DashboardForm() {
  const [currentPage, setCurrentPage] = useState('Summary');
  const { data } = useSelector(state => state.dashboard);

  const changePage = (page) => {
    setCurrentPage(page)
  }
  return (
    <div className='Admin'>
      <SideNavigation pageName={pageNames.Dashboard}/>
      <div className='AdminContent'>
        <div className='AdminContentHeader'>
          <div className='AdminContentHeader-Left'>
            <b className='light'
               dangerouslySetInnerHTML={{ __html: contentTitle }}></b>
          </div>
          <div className='AdminContentHeader-Right'>
          </div>
        </div>

        {/* DASHBOARD FORM */}
        <div className='DashboardFormWrapper'>
          <div className={'DashboardForm ' + currentPage}>
            <div className='DashboardFormHeader'>
              <div
                className={currentPage === 'Summary' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Summary')}
              >
                Summary
              </div>
              <div
                className={currentPage === 'Indicators' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Indicators')}
              >
                Indicators
              </div>
              <div
                className={currentPage === 'Context Layers' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Context Layers')}
              >
                Context Layers
              </div>
              <div
                className={currentPage === 'Basemaps' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Basemaps')}
              >
                Basemaps
              </div>
              <div
                className={currentPage === 'Filters' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Filters')}
              >
                Filters
              </div>
              <div
                className={currentPage === 'Widgets' ? 'active' : 'MuiButtonLike'}
                onClick={() => changePage('Widgets')}
              >
                Widgets
              </div>
            </div>

            {/* FORM CONTENT */}
            <div className='DashboardFormContent'>
              {Object.keys(data).length > 0 ?
                <Fragment>
                  <SummaryDashboardForm/>
                  <BasemapsForm/>
                  <IndicatorsForm/>
                  <ContextLayerForm/>
                </Fragment> :
                <div className='DashboardFormLoading'>Loading</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Form App
 */
export default function DashboardFormApp() {
  return (
    <App>
      {/* ADMIN SECTION */}
      <DashboardForm/>
      {/* DASHBOARD SECTION */}
      <DashboardPreview/>
    </App>
  )
}

render(DashboardFormApp, store)