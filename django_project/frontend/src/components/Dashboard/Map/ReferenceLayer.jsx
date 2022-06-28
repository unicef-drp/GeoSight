/* ==========================================================================
   REFERENCE LAYER
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import $ from 'jquery';
import vectorTileLayer from 'leaflet-vector-tile-layer';

import Actions from '../../../redux/actions'
import { featurePopupContent } from '../../../utils/main'
import Modal, { ModalContent, ModalHeader } from "../../Modal";
import { fetchingData } from "../../../Requests";
import { returnWhere } from "../../../utils/queryExtraction";

/**
 * Show details of indicator in Modal
 * @param {str} group Group of indicator
 * @param {str} url Url of details
 * @param {Function} onClose Modal onclose
 */
export function IndicatorDetailsModal({ group, feature, onClose }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = (url) => {
    fetchingData(url, {}, {}, (data) => {
      if (url === feature.url) {
        setData(data)
      }
    })
  }

  // Show modal when url changed
  useEffect(() => {
    setData(null)
    if (feature?.url) {
      setOpen(true)
      fetchData(feature.url)
    } else {
      setOpen(false)
    }
  }, [feature])

  let columns = [];
  let rows = [];
  if (data?.details && feature?.name && feature?.name.includes('Program Coverage')) {
    columns = [
      { field: 'id', headerName: 'id', hide: true },
      { field: 'title', headerName: 'Title', width: 200 },
      { field: 'status', headerName: 'Status', width: 70 },
      { field: 'sections', headerName: 'Sections', width: 130 },
      {
        field: 'reference_number',
        headerName: 'Reference Number',
        width: 200
      },
      { field: 'partner_name', headerName: 'Partner Name', width: 200 },
      { field: 'start_date', headerName: 'Start Date', width: 130 },
      { field: 'end_date', headerName: 'End Date', width: 130 },
      { field: 'budget_total', headerName: 'Budget Total', width: 130 }
    ]
    rows = data.details.map((row, idx) => {
      row.id = idx
      return row
    })
  }

  return <Modal
    className='MuiBox-Large'
    open={open}
    onClosed={() => {
      setOpen(false)
      onClose()
    }
    }
  >
    <ModalHeader onClosed={() => {
      setOpen(false)
      onClose()
    }
    }>
      List Data of {feature?.name} in {feature?.geometry_name}
    </ModalHeader>
    <ModalContent>
      {
        !data ? <i>Loading</i> :
          rows.length === 0 ? 'Empty' :
            <div style={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </div>
      }
    </ModalContent>
  </Modal>
}

/**
 * ReferenceLayer selector.
 * @param {list} currentIndicator Indicator that will be used.
 */
export default function ReferenceLayer({ currentIndicator }) {
  const dispatch = useDispatch();
  const { referenceLayer } = useSelector(state => state.dashboard.data);
  const indicatorData = useSelector(state => state.indicatorData);
  const filtersData = useSelector(state => state.filtersData);
  const [clickedFeature, setClickedFeature] = useState(null);

  const where = returnWhere(filtersData)

  // Filter geometry_code based on indicators layer
  let geometryCodes = null;
  let levels = [];
  if (indicatorData && indicatorData.length) {
    geometryCodes = []
    indicatorData.forEach(indicator => {
      if (indicator.reporting_level) {
        levels.push(indicator.reporting_level.toLowerCase())
      }
      if (indicator.data) {
        try {
          indicator.data.forEach(indicator => {
            geometryCodes.push(indicator.geometry_code)
          })
        } catch (err) {
        }
      }
    })
  }

  // When level changed
  useEffect(() => {
    if (!referenceLayer.data) {
      dispatch(
        Actions.ReferenceLayer.fetch(dispatch, referenceLayer.detail_url)
      )
    }
  }, [referenceLayer]);

  useEffect(() => {
    if (referenceLayer?.data?.vector_tiles) {

      // Save indicator data per geom
      // This is needed for popup and rendering
      const indicatorsByGeom = {}
      if (currentIndicator) {
        currentIndicator.forEach(function (data) {
          indicatorsByGeom[data.geometry_code] = data;
        })
      }

      const options = {
        maxDetailZoom: 8,
        filter: function (feature) {
          return levels.includes(feature.properties.type.toLowerCase())
            && (!where || !geometryCodes || geometryCodes.includes(feature.properties.code))
        },
        style: function (feature, layer, test) {
          dispatch(Actions.Geometries.add(
            feature.properties.code, feature.properties
          ));

          const indicatorData = indicatorsByGeom[feature.properties.code];
          let fillColor = indicatorData ? indicatorData.color : null;
          let color = indicatorData ? indicatorData.outline_color : '#000000';
          let weight = 0.5;
          let fillOpacity = 0;
          if (fillColor) {
            fillOpacity = 0.7;
          }
          return {
            color: color,
            weight: weight,
            fillColor: fillColor,
            opacity: 1,
            fillOpacity: fillOpacity
          }
        },
      };

      const layer = vectorTileLayer(
        preferences.georepo_api.domain.replaceAll('/proxy?url=', '') + referenceLayer.data.vector_tiles, options
      );
      layer.bindPopup(function (feature) {
        const properties = indicatorsByGeom[feature.properties.code]
          ? indicatorsByGeom[feature.properties.code] : feature.properties
        return featurePopupContent(properties.name ? properties.name : 'Reference Layer', properties)
      });
      dispatch(
        Actions.Map.change_reference_layer(layer)
      )
      // TODO:
      //  Hacky way to show details button
      layer.on('click', function (event) {
        const $detail = $('.popup-details');
        if ($detail.length !== 0) {
          $detail.removeAttr("disabled");
          $detail.click(function () {
            setClickedFeature({
              'name': $detail.data('name'),
              'url': $detail.data('url'),
              'geometry_name': event.layer.feature.properties.label
            });
          })
        }
      }, this);
    }
  }, [referenceLayer, indicatorData, currentIndicator]);

  return (
    <Fragment>
      <IndicatorDetailsModal feature={clickedFeature} onClose={() => {
        setClickedFeature(null)
      }}/>
    </Fragment>
  )
}
