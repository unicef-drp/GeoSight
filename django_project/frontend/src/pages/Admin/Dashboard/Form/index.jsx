import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import Popover from '@mui/material/Popover';
import MapIcon from '@mui/icons-material/Map';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

import App, { render } from '../../../../app';
import { pageNames } from '../../index';
import { store } from '../../../../store/dashboard';
import { Actions } from "../../../../store/dashboard";
import SideNavigation from "../../Components/SideNavigation";
import {
  SaveButton,
  ThemeButton
} from "../../../../components/Elements/Button";

// Dashboard Form
import SummaryDashboardForm from './Summary'
import BasemapsForm from './Basemaps'
import IndicatorsForm from './Indicators'
import ContextLayerForm from './ContextLayer'
import FiltersForm from './Filters'
import WidgetForm from './Widgets'

// Dashboard Preview
import LeftPanel from '../../../../components/Dashboard/LeftPanel'
import Map from '../../../../components/Dashboard/Map'
import RightPanel from '../../../../components/Dashboard/RightPanel'
import '../../../Dashboard/style.scss';
import './style.scss';
import { postData } from "../../../../Requests";

/**
 * Dashboard Preview Section
 */
export function DashboardPreview({ showing, onForm }) {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(
      Actions.Dashboard.fetch(dispatch)
    )
  }, []);

  return (
    <div className='dashboard'>
      <div className='BackToForm'>
        <ThemeButton
          variant="secondary"
          onClick={onForm}
        >
          <ViewHeadlineIcon/>Back to Form
        </ThemeButton>
      </div>
      {Object.keys(data).length > 0 ?
        <Fragment>
          <LeftPanel/>
          {showing ? <Map/> : ''}
          <RightPanel/>
        </Fragment> :
        <div></div>
      }
    </div>
  )
}

/**
 * Dashboard Save Form
 */
export function DashboardSaveForm() {
  const {
    id,
    referenceLayer,
    indicators,
    basemapsLayers,
    contextLayers,
    widgets,
    extent
  } = useSelector(state => state.dashboard.data);
  const filtersData = useSelector(state => state.filtersData);

  const [anchorEl, setAnchorEl] = useState(null);
  const [info, setInfo] = useState(null);
  const [submitted, setSubmitted] = useState(filtersData == null);

  // save the filters query
  useEffect(() => {
    setSubmitted(filtersData == null)
  }, [filtersData]);

  /** On save **/
  const onSave = (event) => {
    setSubmitted(true)
    const target = event.currentTarget
    const errors = [];
    const name = $('#SummaryName').val();
    const description = $('#SummaryDescription').val();
    const icon = $('#SummaryIcon')[0].files[0];
    const category = $('#SummaryCategory').val();

    if (!name) {
      errors.push('Name is empty, please fill it.')
    }
    if (Object.keys(referenceLayer).length === 0 || !referenceLayer.identifier) {
      errors.push('Need to select Reference Dataset in Summary.')
    }
    if (indicators.length === 0) {
      errors.push('Indicators is empty, please select one or more indicator.')
    }
    if (basemapsLayers.length === 0) {
      errors.push('Basemap is empty, please select one or more basemap.')
    }
    if ($('.widget__error').length > 0) {
      errors.push('There is widget that error, please check it in review mode.')
    }

    // Submit dashboard
    if (errors.length === 0) {
      const dashboardData = {
        'referenceLayer': referenceLayer.identifier,
        'indicators': indicators.map(function (model) {
          return {
            id: model.id,
            order: model.order,
            visible_by_default: model.visible_by_default,
            group: model.group,
          }
        }),
        'basemapsLayers': basemapsLayers.map(function (model) {
          return {
            id: model.id,
            order: model.order,
            visible_by_default: model.visible_by_default,
            group: model.group,
          }
        }),
        'contextLayers': contextLayers.map(function (model) {
          return {
            id: model.id,
            order: model.order,
            visible_by_default: model.visible_by_default,
            group: model.group,
          }
        }),
        'extent': extent,
        'widgets': widgets,
        'filters': filtersData
      }

      // onOpen();
      var data = new FormData()
      data.append('icon', icon)
      data.append('name', name)
      data.append('description', description)
      data.append('group', category)
      data.append('data', JSON.stringify(dashboardData))

      postData(
        document.location.href,
        data,
        function (response, responseError) {
          setSubmitted(false)
          if (responseError) {
            setAnchorEl(target)
            setInfo("<div class='FormError'>" + responseError + "</div>")
          } else {
            setAnchorEl(target)
            if (!id) {
              window.location = response.url
            } else {
              setInfo("<div class='FormOk'>Configuration has been saved!</div>")
            }
          }
        }
      )
    } else {
      setAnchorEl(event.currentTarget)
      setInfo("<div class='FormError'>" + errors.join('<br>') + "</div>")
      setSubmitted(false)
    }
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const buttonID = open ? "Button-Save" : undefined;

  return <Fragment>
    <SaveButton
      id={buttonID} variant="secondary" text='Save' onClick={onSave}
      disabled={submitted}/>
    <Popover
      id={buttonID}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div className='Popover-Submit'
           dangerouslySetInnerHTML={{ __html: info }}>
      </div>
    </Popover>
  </Fragment>
}

/**
 * Dashboard Form Section
 */
export function DashboardForm({ onPreview }) {
  const { data } = useSelector(state => state.dashboard);
  const [currentPage, setCurrentPage] = useState('Summary');

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
            <ThemeButton
              variant="secondary"
              onClick={onPreview}
            >
              <MapIcon/>Preview
            </ThemeButton>
            <DashboardSaveForm/>
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
                  <FiltersForm/>
                  <WidgetForm/>
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
  const [currentMode, setCurrentMode] = useState('FormMode');
  return (
    <App className={currentMode}>
      {/* ADMIN SECTION */}
      <DashboardForm onPreview={() => {
        setCurrentMode('PreviewMode')
      }}/>
      {/* DASHBOARD SECTION */}
      <DashboardPreview showing={currentMode === 'PreviewMode'} onForm={() => {
        setCurrentMode('FormMode')
      }}/>
    </App>
  )
}

render(DashboardFormApp, store)