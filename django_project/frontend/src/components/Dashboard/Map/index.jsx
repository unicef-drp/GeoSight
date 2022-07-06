/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import L from 'leaflet';

import './style.scss';
import Actions from '../../../redux/actions/dashboard'

/**
 * Map component.
 */
export default function Map() {
  const {
    basemapLayer,
    referenceLayer,
    contextLayers
  } = useSelector(state => state.map);

  const dispatcher = useDispatch();
  const { extent } = useSelector(state => state.dashboard.data);
  const [map, setMap] = useState(null);
  const [basemapLayerGroup, setBasemapLayerGroup] = useState(null);
  const [referenceLayerGroup, setReferenceLayerGroup] = useState(null);
  const [contextLayerGroup, setContextLayerGroup] = useState(null);

  // Pane identifier
  const basemapPane = 'basemapPane';
  const referenceLayerPane = 'referenceLayerPane';
  const contextLayerPane = 'contextLayerPane';

  useEffect(() => {
    if (!map && basemapLayer) {
      const basemapLayerGroup = L.layerGroup([]);
      const referenceLayerGroup = L.layerGroup([]);
      const contextLayerGroup = L.layerGroup([]);
      setBasemapLayerGroup(basemapLayerGroup);
      setReferenceLayerGroup(referenceLayerGroup);
      setContextLayerGroup(contextLayerGroup);

      const newMap = L.map('map', {
        center: [0, 0],
        zoom: 6,
        layers: [basemapLayerGroup, contextLayerGroup, referenceLayerGroup],
        zoomControl: false,
        maxZoom: maxZoom
      });
      newMap.createPane(basemapPane);
      newMap.createPane(referenceLayerPane);
      newMap.createPane(contextLayerPane);
      setMap(newMap);
    }
  }, [basemapLayer]);

  /** EXTENT CHANGED */
  useEffect(() => {
    if (map && extent) {
      map.fitBounds([
        [extent[1], extent[0]],
        [extent[3], extent[2]]
      ])

      if (editMode) {
        // Init moveend
        // Change extend default when the map moved
        map.on("moveend", function () {
          const bounds = map.getBounds();
          const newExtent = [
            bounds._southWest.lng, bounds._southWest.lat,
            bounds._northEast.lng, bounds._northEast.lat
          ]
          dispatcher(Actions.Extent.changeDefault(newExtent))
        });
      }
    }
  }, [map]);

  /** BASEMAP CHANGED */
  useEffect(() => {
    if (basemapLayerGroup && basemapLayer) {
      basemapLayerGroup.eachLayer(function (layer) {
        basemapLayerGroup.removeLayer(layer);
      });
      basemapLayer.options.pane = basemapPane;
      basemapLayerGroup.addLayer(basemapLayer);
    }
  }, [basemapLayerGroup, basemapLayer]);

  /** CONTEXT LAYERS CHANGED */
  useEffect(() => {
    if (contextLayerGroup && contextLayers) {
      const ids = []
      const idsKeep = []
      for (const [key, contextLayer] of Object.entries(contextLayers)) {
        if (contextLayer.layer) {
          ids.push(contextLayer.layer._leaflet_id);
        }
      }
      contextLayerGroup.eachLayer(function (layer) {
        if (!ids.includes(layer._leaflet_id)) {
          contextLayerGroup.removeLayer(layer);
        } else {
          idsKeep.push(layer._leaflet_id)
        }
      });
      for (const [key, contextLayer] of Object.entries(contextLayers)) {
        if (contextLayer.layer && !idsKeep.includes(contextLayer.layer._leaflet_id)) {
          const layer = contextLayer.layer;
          layer.options.pane = contextLayerPane;
          contextLayerGroup.addLayer(contextLayer.layer);
        }
      }
    }
  }, [contextLayerGroup, contextLayers]);

  /** REFERENCE LAYER CHANGED */
  useEffect(() => {
    if (referenceLayerGroup && referenceLayer) {
      referenceLayerGroup.eachLayer(function (layer) {
        referenceLayerGroup.removeLayer(layer);
      });
      referenceLayer.options.pane = referenceLayerPane;
      referenceLayerGroup.addLayer(referenceLayer);
    }
  }, [referenceLayerGroup, referenceLayer]);

  return <section className='dashboard__map'>
    <div id="map"></div>
  </section>
}

