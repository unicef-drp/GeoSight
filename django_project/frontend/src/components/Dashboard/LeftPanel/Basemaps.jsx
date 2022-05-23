/* ==========================================================================
   BASEMAPS SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import L from 'leaflet';
import Actions from '../../../redux/actions/actions'

/**
 * Basemaps selector
 * @param {list} data Basemap list
 * @param {int} defaultBasemapLayer Default basemap
 */
export default function Basemaps({ data, defaultBasemapLayer }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(defaultBasemapLayer);
  const onSelected = (id) => {
    setSelected(id);
  };

  // Onload, check the default one
  useEffect(() => {
    if (data && !selected) {
      onSelected(data[0]?.id);
    }
  }, [data])

  // Just when selected changed
  useEffect(() => {
    if (data) {
      let selectedBasemap = data.filter((basemap) => {
        return basemap.id === selected;
      })
      const selectedBasemapData = selectedBasemap[0] ? selectedBasemap[0] : null;

      // create the basemap layer
      let layer = null;
      if (selectedBasemapData) {
        if (selectedBasemapData.type === 'WMS') {
          selectedBasemapData.parameters['transparent'] = true;
          selectedBasemapData.parameters['zIndex'] = 1;
          layer = L.tileLayer.wms(selectedBasemapData.url, selectedBasemapData.parameters);
        } else {
          layer = L.tileLayer(selectedBasemapData.url, selectedBasemapData.parameters);
        }
      }
      dispatch(
        Actions.Map.change_basemap(layer)
      )
    }
  }, [selected])

  return (
    <Fragment>
      {
        data !== undefined ?
          data.map(
            layer => (
              <div
                className={layer.id === selected ? 'basemap__box selected' : 'basemap__box'}
                key={layer.id}
                onClick={() => {
                  setSelected(layer.id)
                }}
              >
                <Tooltip title={layer.name} placement='right'>
                  <div className='basemap__box-inner'>
                    <div className='basemap__box-content'>
                      <img src={layer.icon}/>
                      <span>{layer.name}</span>
                    </div>
                  </div>
                </Tooltip>
              </div>
            )
          )
          : <div>Loading</div>
      }
    </Fragment>
  )
}
