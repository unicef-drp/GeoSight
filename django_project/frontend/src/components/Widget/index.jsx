/* ==========================================================================
   WIDGET
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";

import SummaryWidget from "./SummaryWidget"
import SummaryGroupWidget from "./SummaryGroupWidget"
import { cleanLayerData } from "../../utils/indicators"

import './style.scss';

export const DEFINITION = {
  "WidgetType": {
    "SUMMARY_WIDGET": "SummaryWidget",
    "SUMMARY_GROUP_WIDGET": "SummaryGroupWidget"
  },
  "WidgetOperation": {
    "SUM": "Sum"
  }
}

/**
 * Base widget that handler widget rendering.
 * @param {int} idx Index of widget
 * @param {string} data Data of widget
 */
export function Widget({ idx, data }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  const indicatorsData = useSelector(state => state.indicatorsData);
  const filteredGeometries = useSelector(state => state.filteredGeometries);
  const [showInfo, setShowInfo] = useState(false);
  const {
    name, description, type,
    layer_id, layer_used, property
  } = data


  const layer = indicators.filter((layer) => {
    return layer.id === layer_id;
  })[0]

  let indicatorData = null
  if (layer) {
    indicatorData = indicatorsData[layer_id] ? indicatorsData[layer_id] : {}
    indicatorData = Object.assign({}, indicatorData)
    if (indicatorData.fetched && indicatorData.data) {
      indicatorData.data = indicatorData.data.filter(indicator => {
        return filteredGeometries.includes(indicator.geometry_code)
      })
    }
  }

  const showInfoHandler = () => {
    setShowInfo(!showInfo)
  };

  /**
   * Render widget by type
   * **/
  function renderWidgetByType() {
    // get layers by layer used
    let layers = null
    switch (layer_used) {
      case definition.WidgetLayerUsed.INDICATOR:
        layers = indicators
        break;
    }

    // render widget by the type
    switch (type) {
      case DEFINITION.WidgetType.SUMMARY_WIDGET:
        return <SummaryWidget
          idx={idx}
          data={
            cleanLayerData(
              layer_id, layer_used, indicatorData, property
            )
          }
          widgetData={data}
        />;
      case DEFINITION.WidgetType.SUMMARY_GROUP_WIDGET:
        return <SummaryGroupWidget
          idx={idx}
          data={
            cleanLayerData(
              layer_id, layer_used, indicatorData, property
            )
          }
          widgetData={data}
        />;
      default:
        throw new Error("Widget type does not recognized.");
    }
  }

  // Render widget based on the type and raise error
  const renderWidget = () => {
    try {
      return renderWidgetByType()
    } catch (error) {
      return <div className='widget__error'>{'' + error}</div>
    }
  }

  return (
    <div className='widget'>
      <InfoIcon className="info__button" onClick={() => {
        showInfoHandler()
      }}/>
      <div className='widget__fill'>
        {renderWidget()}
      </div>
      {
        showInfo ?
          <div className='widget__info'>
            <div className='widget__info__title'><b
              className='light'>{name}</b></div>
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
    {
      widgets ?
        widgets.map(
          (widget, idx) => {
            return widget.visible_by_default ?
              <Widget key={idx} data={widget} idx={idx}/> : ''
          }
        ) : <div className='dashboard__right_side__loading'>Loading</div>
    }
  </Fragment>
}