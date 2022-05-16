/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

import React, { useEffect, useState } from 'react';
import L from 'leaflet';

import '../../assets/styles/components/dashboard/map.scss';
import { useSelector } from "react-redux";

/**
 * Map component
 */
export default function Map() {
  const { selectedBasemap } = useSelector(state => state.map);
  const [map, setMap] = useState(null);
  const [basemapLayer, setBasemapLayer] = useState(null);

  useEffect(() => {
    // Render map
    const map = L.map('map', {
      center: [-28.3686385, 25.3002873],
      zoom: 6,
      layers: [],
      zoomControl: false
    });
    setMap(map);
  }, []);


  /** BASEMAP CHANGED */
  useEffect(() => {
    if (map) {
      try {
        map.removeLayer(basemapLayer)
      } catch (e) {

      }
      let layer = null;
      if (selectedBasemap.type === 'WMS') {
        selectedBasemap.parameters['transparent'] = true;
        selectedBasemap.parameters['zIndex'] = 1;
        layer = L.tileLayer.wms(selectedBasemap.url, selectedBasemap.parameters);
      } else {
        layer = L.tileLayer(selectedBasemap.url, selectedBasemap.parameters);
      }
      layer.addTo(map);
      setBasemapLayer(layer);
    }
  }, [selectedBasemap]);

  return <section className='dashboard__map'>
    <div id="map"></div>
  </section>
}

