/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import vectorTileLayer from 'leaflet-vector-tile-layer';

import { featurePopupContent } from '../../../utils/main'
import Actions from '../../../redux/actions'


/**
 * ReferenceLayer selector.
 * @param {list} currentIndicator Indicator that will be used.
 */
export default function ReferenceLayer({ currentIndicator }) {
  const dispatch = useDispatch();
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  const indicatorData = useSelector(state => state.indicatorData);

  // Filter geometry_code based on indicators layer
  let geometryCodes = null
  if (indicatorData && indicatorData.length) {
    geometryCodes = []
    indicatorData.forEach(indicator => {
      if (indicator.data) {
        try {
          indicator.data.forEach(indicator => {
            geometryCodes.push(indicator.geometry_code)
          })
        } catch (err) {
        }
      }
    })
  }

  // When level changed
  useEffect(() => {
    if (!referenceLayer.data) {
      dispatch(
        Actions.ReferenceLayer.fetch(dispatch, referenceLayer.detail_url)
      )
    }
  }, [referenceLayer]);

  useEffect(() => {
    if (referenceLayer?.data?.vector_tiles) {

      // Save indicator data per geom
      // This is needed for popup and rendering
      const indicatorsByGeom = {}
      if (currentIndicator) {
        currentIndicator.forEach(function (data) {
          indicatorsByGeom[data.geometry_code] = data;
        })
      }

      const options = {
        maxDetailZoom: 8,
        filter: function (feature) {
          console.log(feature.properties.code)
          return !geometryCodes || geometryCodes.includes(feature.properties.code)
        },
        style: function (feature, layer, test) {
          console.log(feature)
          console.log(layer)
          console.log(test)
          const indicatorData = indicatorsByGeom[feature.properties.code];

          let fillColor = indicatorData ? indicatorData.color : null;
          let color = indicatorData ? indicatorData.outline_color : '#000000';
          let weight = 0.5;
          let fillOpacity = 0;
          if (fillColor) {
            fillOpacity = 0.7;
          }
          return {
            color: color,
            weight: weight,
            fillColor: fillColor,
            opacity: 1,
            fillOpacity: fillOpacity
          }
        },
      };

      const layer = vectorTileLayer(preferences.georepo_api.domain + referenceLayer.data.vector_tiles, options);
      layer.bindPopup(function (feature) {
        const properties = indicatorsByGeom[feature.properties.code]
          ? indicatorsByGeom[feature.properties.code] : feature.properties
        return featurePopupContent('Reference Layer', properties)
      });
      dispatch(
        Actions.Map.change_reference_layer(layer)
      )
    }
  }, [referenceLayer, indicatorData, currentIndicator]);

  return (<Fragment></Fragment>)
}
