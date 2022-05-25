/* ==========================================================================
   WIDGET
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SummaryWidget from "./SummaryWidget"
import SummaryGroupWidget from "./SummaryGroupWidget"
import WidgetSelectionSection from "./WidgetSelection"
import Actions from "../../redux/actions"
import './style.scss';

export const DEFINITION = {
  "PluginType": {
    "SUMMARY_WIDGET": "SummaryWidget",
    "SUMMARY_GROUP_WIDGET": "SummaryGroupWidget"
  },
  "PluginOperation": {
    "SUM": "Sum"
  }
}

/**
 * Base widget that handler widget rendering.
 * @param {int} idx Index of widget
 * @param {string} data Data of widget
 */
export function Widget({ idx, data }) {
  const dispatch = useDispatch()
  const { indicators } = useSelector(state => state.dashboard.data);
  const [showInfo, setShowInfo] = useState(false);
  const {
    name, description, type,
    layer_id, layer_used, property, property_2
  } = data

  const showInfoHandler = () => {
    setShowInfo(!showInfo)
  };

  /**
   * Return data from leaflet layer.
   */
  function getData() {
    switch (layer_used) {
      case definition.PluginLayerUsed.INDICATOR:
        if (indicators) {
          const indicator = indicators.filter((indicator) => {
            return indicator.id === layer_id;
          })

          if (indicator[0] && indicator[0]['data']) {
            const output = [];
            indicator[0]['data'].forEach(function (indicatorData) {
              if (indicatorData[property] !== undefined) {
                output.push({
                  'date': indicatorData['date'],
                  'value': indicatorData[property],
                  'value2': indicatorData[property_2],
                })
              }
            })
            return output;
          }
        }
        return null;
      default:
        return null;
    }
  }

  function renderWidget() {
    switch (type) {
      case DEFINITION.PluginType.SUMMARY_WIDGET:
        return <SummaryWidget
          idx={idx} data={getData()} widgetData={data}
        />;
      case DEFINITION.PluginType.SUMMARY_GROUP_WIDGET:
        return <SummaryGroupWidget
          idx={idx} data={getData()} widgetData={data}
        />;
      default:
        return <div className='widget__error'>Widget Not Found</div>;
    }
  }

  // Delete widget
  const deleteWidget = () => {
    dispatch(Actions.Widget.remove(idx));
  }

  return (
    <div className='widget'>
      {
        editMode ? <RemoveCircleIcon
          className="remove__button"
          onClick={deleteWidget}/> : ''
      }
      <InfoIcon className="info__button" onClick={() => {
        showInfoHandler()
      }}/>
      <div className='widget__fill'>
        {renderWidget()}
      </div>
      {
        showInfo ?
          <div className='widget__info'>
            <div className='widget__info__title'><b>{name}</b></div>
            <div className='widget__info__content'>{description}</div>
          </div> : ''
      }
    </div>
  )
}

/**
 * Widget List rendering
 */
export default function WidgetList() {
  const { widgets } = useSelector(state => state.dashboard.data);
  return <Fragment>
    {editMode ? <WidgetSelectionSection/> : ''}
    {
      widgets ?
        widgets.map(
          (widget, idx) => (
            <Widget key={idx} data={widget} idx={idx}/>
          )
        ) : <div className='dashboard__right_side__loading'>Loading</div>
    }
  </Fragment>
}