/* ==========================================================================
   MAP CONTAINER
   ========================================================================== */

import React, { useEffect } from 'react';
import L from 'leaflet';

import '../../assets/styles/components/dashboard/map.scss';

/**
 * Map component
 */
export default function Map() {

  useEffect(() => {
    // Render map
    L.map('map', {
      center: [-28.3686385, 25.3002873],
      zoom: 6,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ],
      zoomControl: false
    });
  }, []);
  return <section className='dashboard__map'>
    <div id="map"></div>
  </section>
}

