/* ==========================================================================
   WIDGET
   ========================================================================== */

import React, { useState } from 'react';
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import SummaryWidget from "./Types/SummaryWidget"
import SummaryGroupWidget from "./Types/SummaryGroupWidget"

import './style.scss';

/**
 * Base widget that handler widget rendering
 * @param {string} data Data of widget
 */
export default function Widget({ data }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  const [showInfo, setShowInfo] = useState(false);
  const {
    name, description, unit, type,
    layer_id, layer_used, property, property_2, operation
  } = data

  const showInfoHandler = () => {
    setShowInfo(!showInfo)
  };

  /**
   * Return data from leaflet layer
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
      case definition.PluginType.SUMMARY_WIDGET:
        return <SummaryWidget
          name={name} unit={unit} data={getData()} operation={operation}
        />;
      case definition.PluginType.SUMMARY_GROUP_WIDGET:
        return <SummaryGroupWidget
          name={name} unit={unit} data={getData()} operation={operation}
        />;
      default:
        return <div className='widget__error'>Widget Not Found</div>;
    }
  }

  return (
    <div className='widget'>
      <InfoIcon onClick={() => {
        showInfoHandler()
      }}/>
      <div className='widget__fill'>
        {renderWidget()}
      </div>
      {
        showInfo ?
          <div className='widget__info'>
            <div className='widget__info__title'>{name}</div>
            <div className='widget__info__content'>{description}</div>
          </div> : ''
      }
    </div>
  )
}