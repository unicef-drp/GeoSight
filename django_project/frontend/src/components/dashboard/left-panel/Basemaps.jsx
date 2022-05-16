/* ==========================================================================
   BASEMAPS SELECTOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Actions from '../../../redux/actions/actions'

/**
 * Basemaps selector
 * @param {list} data Basemap list
 */
export default function Basemaps({ data }) {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(0);
  const onSelected = (id) => {
    setSelected(id);
  };

  // Onload, check the default one
  useEffect(() => {
    if (data) {
      const enableByDefaults = data.filter((basemap) => {
        return basemap.enable_by_default;
      })
      onSelected(enableByDefaults[0]?.id);
    }
  }, [data])

  // Just when selected changed
  useEffect(() => {
    if (data) {
      let selectedBasemap = data.filter((basemap) => {
        return basemap.id === selected;
      })
      const selectedBasemapData = selectedBasemap[0] ? selectedBasemap[0] : null;
      dispatch(
        Actions.Map.change_basemap(selectedBasemapData)
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
                <div className='basemap__box-inner'>
                  <div className='basemap__box-content'>
                    <img src={layer.icon}/>
                    <span>{layer.name}</span>
                  </div>
                </div>
              </div>
            )
          )
          : <div>Loading</div>
      }
    </Fragment>
  )
}
