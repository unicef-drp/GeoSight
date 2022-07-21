/* ==========================================================================
   Context Layers SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import L from 'leaflet';

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Switch from '@mui/material/Switch';

import { Actions } from '../../../../store/dashboard'
import EsriLeafletLayer from '../../../../utils/esri/leaflet-esri-layer'
import { featurePopupContent } from '../../../../utils/main'
import { layerInGroup } from '../../../../utils/layers'
import { fetchingData } from "../../../../Requests";

import './style.scss'


function ContextLayerInput({ data }) {
  const dispatch = useDispatch();
  const id = data.id;
  const [checked, setChecked] = useState(false);
  const [layer, setLayer] = useState(null);
  const [error, setError] = useState(null);
  const [legend, setLegend] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  /**
   * Initiate layer from the data.
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
        layerData.parameters['maxNativeZoom'] = 19;
        layerData.parameters['maxZoom'] = maxZoom;
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
        fetchingData(layerData.url, layerData.params, {}, (data) => {
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
        })
        break;
      }
      default:
        return null
    }
  }

  // Onload for default checked and the layer
  useEffect(() => {
    if (data.visible_by_default) {
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
      if (layer) {
        dispatch(
          Actions.Map.remove_context_layer(id)
        );
      }
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
        <Switch
          disabled={!layer}
          size="small"
          checked={checked}
          onChange={() => {
            change(event.target.checked)
          }}
        />
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
 * Context Layer Row.
 * @param {str} groupNumber Group number.
 * @param {str} groupName Group name.
 * @param {dict} group Group data.
 */
function LayerRow({ groupName, group }) {
  return <div className={'LayerGroup ' + (groupName ? '' : 'Empty')}>
    <div className='LayerGroupName'><b
      className='light'>{groupName}</b></div>
    <div className='LayerGroupList'>
      {
        group.map(
          layer => (
            <ContextLayerInput key={layer.id} data={layer}/>
          )
        )
      }
    </div>
  </div>
}

/**
 * Context Layer Accordion.
 * @param {bool} expanded Is the accordion expanded.
 * @param {function} handleChange Function when the accordion show.
 */
export default function ContextLayersAccordion({ expanded, handleChange }) {
  const { contextLayers } = useSelector(state => state.dashboard.data);
  const groups = layerInGroup(contextLayers)

  /** Render group and layers
   * @param {str} groupName Name of group.
   * @param {dict} group Data of group.
   */

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange('contextLayers')}
      className='ContextLayersAccordion'
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
        Context Layers
        {
          contextLayers !== undefined ?
            <span></span> :
            <i>&nbsp;(Loading)</i>
        }
      </AccordionSummary>
      <AccordionDetails>
        {
          contextLayers !== undefined ?
            (Object.keys(groups)).map(
              groupName => (
                <LayerRow
                  key={groupName} groupName={groupName}
                  group={groups[groupName]}/>
              )
            )
            : <div>Loading</div>
        }
      </AccordionDetails>
    </Accordion>
  )
}