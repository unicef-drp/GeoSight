/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featurePopupContent } from '../../../utils/main'
import Actions from '../../../redux/actions/actions'

/**
 * Reference Layer
 */
export default function ReferenceLayer() {
  const { data } = useSelector(state => state.referenceLayerJson);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      Actions.ReferenceLayer.fetch(dispatch)
    )
  }, []);

  useEffect(() => {
    if (data.features) {
      const onEachFeature = (feature, layer) => {
        layer.bindPopup(
          featurePopupContent('Reference Layer', feature.properties)
        );
      }
      const layer = L.geoJson(data, {
        style: function (feature) {
          let color = '#ffffff';
          let weight = 0.5;
          return {
            color: color,
            weight: weight,
            opacity: 1,
            fillColor: feature.properties.background_color,
            fillOpacity: 0.7
          }
        },
        onEachFeature: onEachFeature
      });
      dispatch(
        Actions.Map.change_reference_layer(layer)
      )
    }
  }, [data]);

  return '<span></span>'
}
