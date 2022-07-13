import React from 'react';
import { store } from '../../store/admin';
import { render } from '../../app';
import BasicPage from '../Basic'
import './style.scss';

/**
 * Home Page App
 */
export default function Home() {
  const dashboardsData = dashboards;
  return (
    <BasicPage className='Home'>
      <div className='PageContent-Title'>
        <div className='PageContent-TitleText'>Select Project</div>
      </div>
      {
        dashboardsData.length > 0 ? (
          <div className='PageContent-Content'>
            {dashboardsData.map((dashboard, idx) => {
              return (
                <div key={idx} className='DashboardCard'>
                  <div className='DashboardCard-Wrapper'>
                    <a href={dashboard.url}>
                      <img src={dashboard.icon}/>
                      <div className='DashboardCard-Name'>
                        <div className='DashboardCard-NameText'>
                          {dashboard.name}
                        </div>
                      </div>
                      <div className='DashboardCard-Description'>
                        {dashboard.description}
                      </div>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : <div>No Project Found</div>
      }
    </BasicPage>
  )
}

render(Home, store)