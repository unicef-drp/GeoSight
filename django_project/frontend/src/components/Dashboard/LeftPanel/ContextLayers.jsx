/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import $ from "jquery";
import L from 'leaflet';
import { Checkbox } from '@mui/material'

import Actions from '../../../redux/actions'
import { featurePopupContent } from '../../../utils/main'
import EsriLeafletLayer from '../../../utils/esri/leaflet-esri-layer'

function ContextLayerInput({ data }) {
  const dispatch = useDispatch();
  const id = data.id;
  const [checked, setChecked] = useState(false);
  const [layer, setLayer] = useState(null);
  const [error, setError] = useState(null);
  const [legend, setLegend] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  /**
   * Initiate layer from the data
   */
  const getLayer = function (layerData) {
    const layerType = layerData.layer_type;

    // this is for each feature
    const onEachFeature = (feature, layer) => {
      layer.bindPopup(
        featurePopupContent(layerData.name, feature.properties)
      );
    }
    switch (layerType) {
      case 'Raster Tile': {
        if (layerData.legend) {
          setLegend(`<img src="${layerData.legend}"/>`)
        }
        return L.tileLayer.wms(
          layerData.url, layerData.parameters
        );
      }
      case 'ARCGIS': {
        const options = {
          token: layerData.token
        };
        const argisLayer = new EsriLeafletLayer(
          layerData.name, layerData.url,
          layerData.parameters, options,
          layerData.style, onEachFeature
        );
        argisLayer.load().then(output => {
          if (output.layer) {
            setLayer(output.layer);
            const legend = argisLayer.getLegend();
            setLegend(legend);
          } else {
            setError(output.error);
          }
        });
        break;
      }
      case 'Geojson': {
        $.ajax({
          dataType: "json",
          data: layerData.params,
          url: layerData.url,
          success: function (data) {
            const layer = L.geoJson(data, {
              style: function (feature) {
                switch (feature.geometry.type) {
                  default:
                    return {
                      "color": "#ff7800",
                      "weight": 1,
                      "opacity": 1
                    }
                }
              },
              onEachFeature: onEachFeature,
              pointToLayer: function (feature, latlng) {
                var icon = L.icon({
                  iconSize: [25, 30],
                  iconAnchor: [10, 30],
                  popupAnchor: [2, -31],
                  iconUrl: feature.properties.icon
                });
                return L.marker(
                  latlng, { icon: icon }
                );
              }
            });
            setLayer(layer);
          },
        })
        break;
      }
      default:
        return null
    }
  }

  // Onload for default checked and the layer
  useEffect(() => {
    if (data.enable_by_default) {
      change(true)
    }
    if (!layer) {
      const layer = getLayer(data);
      if (layer) {
        setLayer(layer)
      }
    }
  }, [])

  // When checked changes
  useEffect(() => {
    if (checked) {
      if (layer) {
        dispatch(
          Actions.Map.add_context_layer(id, layer)
        );
      }
    } else {
      dispatch(
        Actions.Map.remove_context_layer(id)
      );
    }
  }, [checked, layer])


  const change = (checked) => {
    setChecked(checked);
    if (!checked) {
      showLegendHandler(false);
    }
  };
  const showLegendHandler = (show) => {
    setShowLegend(show);
  };

  const className = layer ? 'dashboard__left_side__row' : 'dashboard__left_side__row disabled';
  return (
    <Fragment>
      <div className={className} title={error}>
        <Checkbox
          disabled={!layer}
          checked={checked}
          onChange={(event) => {
            change(event.target.checked)
          }}/>
        <div className='text title'>
          <div>{data.name}</div>
          {
            legend && showLegend ?
              <div className='legend'
                   dangerouslySetInnerHTML={{ __html: legend }}></div> : ''
          }

        </div>
        {
          checked && legend ? (
            <Fragment>
              {
                showLegend ?
                  <span className='toggler' onClick={() => {
                    showLegendHandler(false)
                  }}>▴</span> :
                  <span className='toggler' onClick={() => {
                    showLegendHandler(true)
                  }}>▾</span>
              }
            </Fragment>
          ) : ''
        }
      </div>
    </Fragment>
  )
}

/**
 * Context Layer selector
 * @param {list} data ContextLayers list
 */
export default function ContextLayers({ data }) {
  return (
    <Fragment>
      {
        data !== undefined ?
          data.map(
            layer => (
              <ContextLayerInput key={layer.id} data={layer}/>
            )
          )
          : <div>Loading</div>
      }
    </Fragment>
  )
}
