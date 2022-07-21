/* ==========================================================================
   MAP CONFIG CONTAINER
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import $ from 'jquery';
import L from 'leaflet';

import { SelectWithList } from "../../../../components/Input/SelectWithList";

/**
 * Map component.
 */
export default function Map() {
  const featureColor = function (feature) {
    return legends['NODATA']['color'];
  };

  const [map, setMap] = useState(null);
  const [layer, setLayer] = useState(null);
  const [references, setReferences] = useState(null)
  const [reference, setReference] = useState(null)
  const [error, setError] = useState(null)

  const fetchData = (level, page) => {
    $.ajax({
      url: preferences.georepo_api.domain + level.url + '?page=' + page,
    }).done(function (data) {
      if (!level.layer) {
        level.layer = {
          type: "FeatureCollection",
          features: []
        }
      }
      level.layer.features = level.layer.features.concat(data.results.features)
      page += 1
      if (page > data.total_page) {
        level.finished = true
      }
      level.page = page
      setReferences([...references])
    });
  }
  useEffect(() => {
    // Init Map
    if (!map) {
      const newMap = L.map('Map', {
        center: [0, 0],
        zoom: 6,
        zoomControl: false,
        maxZoom: maxZoom
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);
      setMap(newMap);

      const geojson = L.geoJSON(
        null, {
          style: function (feature, layer) {
            return {
              color: "#ffffff",
              weight: 1,
              fillColor: featureColor(feature)
            };
          },
          onEachFeature: function (feature, layer) {
            const identifier = feature?.properties?.identifier?.admin;
            const id = identifier;
            if (!identifier) {
              console.log(feature)
            }
            feature.properties['id'] = id;
            feature.properties['url'] = urlValueByGeometry.replace('/0/', '/' + identifier + '/');

            // update bind popup
            layer.bindPopup(
              L.popup({
                closeOnClick: false
              }).setContent(
                identifier ? `
                <div data-id="${id}"
                   class="feature-value-popup">
                  <div class="popup-header"><b>${feature.properties['name']} ${id}</b>
                  </div>
                  <div class="popup-content">
                      <div class="popup-content-form" data-action="${feature.properties['url']}">
                        <input type="hidden" name="csrfmiddlewaretoken" value=${csrfmiddlewaretoken}/>
                        <div class="popup-content-form-title"><b>Add new value</b></div>
                        <input id="feature-value-date" type="date"
                               name="date" placeholder="Date"
                               autocomplete="off">
                        <input id="feature-value-value" type="number"
                               name="value" placeholder="Value"
                               autocomplete="off">
                        <input class="main-button" type="submit"
                               value="Submit">
                      </div>
                      <div class="popup-content-table">
                          <table>
                              <tr>
                                  <th><b>Date</b></th>
                                  <th>Value</th>
                              </tr>
                              <tr class="loading">
                                  <td colspan="2"><i>Loading</i></td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </div>
                ` : '<div>No identifier found</div>'
              )
            ).on("popupopen", () => {
              setTimeout(function () {
                const $popup = $('.popup-content')

                function loadData() {
                  $.ajax({
                    url: urlValueByGeometry.replace('/0/', '/' + id + '/'),
                    dataType: 'json',
                    success: function (data, textStatus, request) {
                      $('.loading').remove()
                      const $table = $popup.find('table');
                      $('.row-value').remove();
                      data.map(row => {
                          $table.append(`<tr class="row-value"><td><b>${row.date}</b></td><td>${row.value}</td></tr>`)
                        }
                      )
                    }
                  });
                }

                loadData()

                const $featureValueDate = $popup.find('#feature-value-date');
                const $featureValueValue = $popup.find('#feature-value-value');
                const $submitButton = $popup.find('.main-button');
                $('.main-button').click(function (event) {
                  const $form = $('.popup-content-form');
                  const url = $form.data('action');
                  const date = $featureValueDate.val();
                  const value = $featureValueValue.val();

                  // POST DATA
                  if (date && value) {
                    $submitButton.attr('disabled', true)
                    $.ajax({
                      url: url,
                      data: {
                        date: date,
                        value: value
                      },
                      dataType: 'json',
                      type: 'POST',
                      success: function (data, textStatus, request) {
                        $('.leaflet-popup-close-button')[0].click();
                        loadData()
                      },
                      error: function (error, textStatus, request) {
                      },
                      beforeSend: beforeAjaxSend
                    });
                  }
                });
              }, 300);
            });

            // on mouse over
            layer.on('mouseover', function () {
              this.setStyle({
                'fillColor': '#0000ff'
              });
            });
            layer.on('mouseout', function () {
              this.setStyle({
                'fillColor': featureColor(feature)
              });
            });
          }
        });
      geojson.addTo(newMap);
      setLayer(geojson)
    }

    // GET PREFERENCES LIST
    $.ajax({
      url: preferences.georepo_api.reference_layer_list
    }).done(function (data) {
      const references = data.map(row => {
        row.value = row.identifier
        return row
      })
      setReference(references[0].value)
      setReferences(references)
    });
  }, [])

  // When reference changed
  useEffect(() => {
    setError('')
    if (reference) {
      const referenceLayer = references.filter(row => {
        return row.identifier === reference
      })[0]
      if (!referenceLayer.data) {
        $.ajax({
          url: preferences.georepo_api.reference_layer_detail.replace('<identifier>', reference)
        }).done(function (data) {
          referenceLayer.data = data.levels;
          setReferences([...references])
        });
      } else {
        // Check levels
        const level = referenceLayer.data.filter(level => {
          return (level.level_name.toLocaleLowerCase() === reportingLevel.toLocaleLowerCase() || '' + level.level === reportingLevel)
        })[0]
        if (!level) {
          setError(`Reference Layer does not have data for ${reportingLevel}`)
        } else {
          if (!level.finished) {
            fetchData(level, !level.page ? 1 : level.page)
          }
          // render
          if (level.layer) {
            layer.clearLayers();
            layer.addData(level.layer);
            map.fitBounds(layer.getBounds());
          }
        }
      }
    }
  }, [reference, references])


  return <Fragment>
    <div id="Map"></div>
    <div className='ReferenceList'>{
      references ? (
        <Fragment>
          <SelectWithList
            list={references}
            value={reference}
            onChange={evt => {
              setReference(evt.value)
            }}
          />
          {error ? <div className='error'>{error}</div> : ''}
        </Fragment>
      ) : (
        <div>References Loading </div>
      )
    }</div>
  </Fragment>
}

