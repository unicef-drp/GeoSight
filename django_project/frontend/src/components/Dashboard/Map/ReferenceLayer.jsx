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
 * @param {list} indicatorData Indicator that will be used.
 */
export default function ReferenceLayer({ indicatorData }) {
  const dispatch = useDispatch();
  const {
    referenceLayer,
    extent,
    indicators
  } = useSelector(state => state.dashboard.data);

  // Filter geometry_code based on indicators layer
  let geometryCodes = null
  if (indicators && indicators.length) {
    geometryCodes = []
    indicators.forEach(indicatorData => {
      if (indicatorData.data) {
        try {
          indicatorData.data.forEach(indicator => {
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
      //
      // Colouring by geometry name
      const indicatorsByGeom = {}
      if (indicatorData) {
        indicatorData.forEach(function (data) {
          indicatorsByGeom[data.geometry_code] = data;
        })
      }
      const options = {
        style: function (feature, layer, test) {
          let color = '#000000';
          let weight = 0.5;
          let fillOpacity = 0;
          const indicatorData = indicatorsByGeom[feature.properties.code];
          let fillColor = indicatorData ? indicatorData.color : null;
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

      const layer = vectorTileLayer(georepoUrl + referenceLayer.data.vector_tiles, options);
      layer.bindPopup(function (feature) {
        const properties = indicatorsByGeom[feature.properties.code]
          ? indicatorsByGeom[feature.properties.code] : feature.properties
        return featurePopupContent('Reference Layer', properties)
      });
      dispatch(
        Actions.Map.change_reference_layer(layer)
      )
    }
  }, [referenceLayer, indicatorData]);

  return (<Fragment></Fragment>)
}
