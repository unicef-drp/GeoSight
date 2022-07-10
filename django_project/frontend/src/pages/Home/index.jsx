import React from 'react';
import { AddButton } from "../../components/Elements/Button";
import { store } from '../../store/admin';
import { render } from '../../app';
import BasicPage from '../Basic'
import './style.scss';
import SettingsIcon from "@mui/icons-material/Settings";

/**
 * Home Page App
 */
export default function Home() {
  const dashboardsData = dashboards;
  return (
    <BasicPage className='Home'>
      <div className='PageContent-Title'>
        <div className='PageContent-TitleText'>Select Dashboard</div>
        <a href={urls.api.create}>
          <AddButton
            variant="secondary"
            text={"New Dashboard"}
          />
        </a>
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
                    {dashboard.edit_url ? (
                      <a href={dashboard.edit_url}
                         className='DashboardCard-Edit'>
                        <SettingsIcon/>
                      </a>
                    ) : ''}
                  </div>
                </div>
              )
            })}
          </div>
        ) : <div>No Dashboard Found</div>
      }
    </BasicPage>
  )
}

render(Home, store)