/* ==========================================================================
   WIDGET
   ========================================================================== */

import React, { useState } from 'react';
import { useSelector } from "react-redux";
import InfoIcon from "@mui/icons-material/Info";
import SummaryWidget from "./Types/SummaryWidget"

import './style.scss';

/**
 * Base widget that handler widget rendering
 * @param {string} data Data of widget
 */
export default function Widget({ data }) {
  const {
    referenceLayer
  } = useSelector(state => state.map);

  const [showInfo, setShowInfo] = useState(false);
  const {
    name, description, unit, type,
    layer_id, layer_used, property, operation
  } = data

  const showInfoHandler = () => {
    setShowInfo(!showInfo)
  };

  /**
   * Return data from leaflet layer
   */
  function getData() {
    switch (layer_used) {
      case definition.PluginLayerUsed.REFERENCE_LAYER:
        const layer = referenceLayer;
        if (layer) {
          const output = [];
          layer.getLayers().forEach(function (layer) {
            if (layer.feature.properties[property]) {
              output.push({
                'date': layer.feature.properties['date'],
                'value': layer.feature.properties[property],
              })
            }
          })
          return output;
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
      default:
        return <div className='widget__error'>Widget Not Found</div>;
    }
  }

  return (
    <div className='widget'>
      <InfoIcon onClick={() => {
        showInfoHandler()
      }}/>
      <div className='widget__content'>
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