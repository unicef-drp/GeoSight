/* ==========================================================================
   MAP CONFIG CONTAINER
   ========================================================================== */

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import L from 'leaflet';
import Draw from 'leaflet-draw';

import { Actions } from "../../../../../store/dashboard";

/**
 * Map component.
 */
export default function MapConfig() {
  const prevState = useRef();
  const dispatcher = useDispatch();
  const { extent } = useSelector(state => state.dashboard.data);
  const [map, setMap] = useState(null);
  const [editableLayers, setEditableLayers] = useState(null);
  const [extentValue, setExtentValue] = useState('');
  const [extentError, setExtentError] = useState('');

  useEffect(() => {
    if (!map) {
      const newMap = L.map('MapConfig', {
        center: [0, 0],
        zoom: 6,
        zoomControl: false,
        maxZoom: maxZoom
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);

      // ---------------------------------------------------------
      // FOR EDITABLE LAYERS
      var editableGroups = new L.FeatureGroup();
      newMap.addLayer(editableGroups);

      var drawPluginOptions = {
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#red',
            },
            shapeOptions: {
              color: 'blue'
            }
          },
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: editableGroups,
          remove: false
        }
      };
      var drawControl = new L.Control.Draw(drawPluginOptions)
      newMap.addControl(drawControl)

      newMap.on('draw:created', function (e) {
        editableGroups.clearLayers()
        editableGroups.addLayer(e.layer)

        const bounds = e.layer.getBounds()
        const newExtent = [
          bounds._southWest.lng, bounds._southWest.lat,
          bounds._northEast.lng, bounds._northEast.lat
        ]
        dispatcher(Actions.Extent.changeDefault(newExtent))
      });

      // ---------------------------------------------------------
      setEditableLayers(editableGroups);
      setMap(newMap);
    }

    if (map && extent) {
      if (JSON.stringify(extent) !== JSON.stringify(prevState.extent)) {
        editableLayers.clearLayers()
        editableLayers.addLayer(
          L.polygon([
            [extent[1], extent[0]],
            [extent[1], extent[2]],
            [extent[3], extent[2]],
            [extent[3], extent[0]],
          ], { color: 'blue' })
        );
        prevState.extent = extent
        const bounds = editableLayers.getBounds()
        map.fitBounds(bounds);

        // set value
        setExtentValue(JSON.stringify([
          [extent[1], extent[0]],
          [extent[1], extent[2]],
          [extent[3], extent[2]],
          [extent[3], extent[0]],
        ]))
      }
    }
  }, [map, extent]);

  return <div>
    <div className='helptext'>
      Put specific extent boundary or draw on the map below
    </div>
    <br/>
    <textarea
      value={extentValue} rows="4"
      onChange={(event) => {
        setExtentValue(event.target.value)
        if (!event.target.value) {
          setExtentError('This empty')
        } else {
          try {
            const layer = L.polygon(JSON.parse(event.target.value), { color: 'blue' })
            const bounds = layer.getBounds()
            if (!bounds._southWest.lng) {
              setExtentError('This empty')
            } else {
              const newExtent = [
                bounds._southWest.lng, bounds._southWest.lat,
                bounds._northEast.lng, bounds._northEast.lat
              ]
              dispatcher(Actions.Extent.changeDefault(newExtent))
            }
          } catch (err) {
            const error = err.toString()
            if (error.includes('JSON')) {
              setExtentError('Value is not recognized. Please use [[x1,y1],[x1,y2],[x2,y1],[x2,y2]]')
            } else {
              setExtentError(error)
            }
          }
        }
      }}/>
    {extentError ? <div className='error'>{extentError}</div> : ''}
    <br/>
    <div id="MapConfig"></div>
  </div>
}

