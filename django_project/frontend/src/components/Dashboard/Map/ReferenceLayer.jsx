/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { featurePopupContent } from '../../../utils/main'
import Actions from '../../../redux/actions'


/**
 * ReferenceLayer selector.
 * @param {list} indicatorData Indicator that will be used.
 */
export default function ReferenceLayer({ indicatorData }) {
  const [level, setLevel] = useState(null);
  const {
    referenceLayer,
    extent,
    indicators
  } = useSelector(state => state.dashboard.data);

  const data = referenceLayer ? referenceLayer.data : null;
  const dispatch = useDispatch();

  // When Reference Layer data ready
  useEffect(() => {
    if (referenceLayer && referenceLayer.levels) {
      setLevel(referenceLayer.levels[0])
    }
  }, [referenceLayer]);

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
    if (level) {
      dispatch(
        Actions.ReferenceLayer.fetch(dispatch, level.url)
      )
    }
  }, [level]);

  // When reference geojson ready
  // Change color based on indicator if provided
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {

      // Filter features for geojson with the geometryCodes
      const geojson = {
        ...data,
        features: data.features.filter(feature => {
          return !geometryCodes || geometryCodes.includes(feature.properties.identifier)
        })
      }

      // Colouring by geometry name
      const indicatorsByGeom = {}
      if (indicatorData) {
        indicatorData.forEach(function (data) {
          indicatorsByGeom[data.geometry_code] = data;
        })
      }

      if (geojson.features) {
        const onEachFeature = (feature, layer) => {
          const properties = indicatorsByGeom[feature.properties.identifier]
            ? indicatorsByGeom[feature.properties.identifier] : feature.properties
          layer.bindPopup(
            featurePopupContent('Reference Layer', properties)
          );
        }
        const layer = L.geoJson(geojson, {
          style: function (feature) {
            let color = '#000000';
            let weight = 0.5;
            let fillOpacity = 0;
            const indicatorData = indicatorsByGeom[
              feature.properties.identifier];
            let fillColor = indicatorData ? indicatorData.color : null;
            if (fillColor) {
              fillOpacity = 0.7;
            }
            return {
              color: color,
              weight: weight,
              opacity: 1,
              fillColor: fillColor,
              fillOpacity: fillOpacity
            }
          },
          onEachFeature: onEachFeature
        });
        dispatch(
          Actions.Map.change_reference_layer(layer)
        )

        // Init extent from reference layer
        if (!extent[0] && !extent[1] && !extent[2] && !extent[3]) {
          const bounds = layer.getBounds();
          const newExtent = [
            bounds._southWest.lng, bounds._southWest.lat,
            bounds._northEast.lng, bounds._northEast.lat
          ]
          dispatch(Actions.Extent.changeDefault(newExtent))
        }
      }
    }
  }, [data, indicatorData, geometryCodes]);

  return (<Fragment></Fragment>)
}
