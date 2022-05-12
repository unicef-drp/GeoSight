import React from 'react';
import L from 'leaflet';

class Map extends React.PureComponent {
  componentDidMount() {
    this.map = L.map('map', {
      center: [49.8419, 24.0315],
      zoom: 16,
      layers: [
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }),
      ]
    });
  }

  render() {
    return <div id="map"></div>
  }
}

export default Map;
