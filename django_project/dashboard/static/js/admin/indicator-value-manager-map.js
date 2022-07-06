$(document).ready(function () {

  //create map
  const valueData = {};
  const onEachFeatureTemplate = _.template($('#_on_each_feature').html());
  let map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // geometry
  const featureColor = function (feature) {
    const identifier = feature?.properties?.identifier?.admin ? feature.properties.identifier.admin : feature.properties.identifier;
    let color = legends['NODATA']['color'];
    // if (geometryHasUpdatedValue.includes(identifier)) {
    //   color = legends['LATESTDATAFOUND']['color'];
    // } else if (geometryHasValue.includes(identifier)) {
    //   color = legends['NEEDUPDATE']['color'];
    // }
    return color
  };

  let geometryClicked = null;
  const layer = L.geoJSON(
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
        feature.properties['id'] = id;
        feature.properties['identifier'] = identifier;
        feature.properties['url'] = urlValueByGeometry.replace('/0/', '/' + identifier + '/');

        // update bind popup
        layer.bindPopup(
          L.popup({
            closeOnClick: false
          }).setContent(onEachFeatureTemplate(feature.properties))
        ).on("popupopen", () => {
          setTimeout(function () {
            loadValues(id);
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
        layer.on('click', function () {
          geometryClicked = id;
          loadValues(id);
        });
      }
    });
  layer.addTo(map);

  // fetch data
  function loadValues(geometryID) {
    const $featureValue = $(`#feature-value-${geometryID}`);
    const $featureValueDate = $featureValue.find('#feature-value-date');
    const $featureValueValue = $featureValue.find('#feature-value-value');
    const $submitButton = $featureValue.find('.main-button');
    $featureValueValue.val('');
    const now = new Date();
    $featureValueDate.datepicker(
      {
        setDate: now,
        autoclose: true,
        dateFormat: 'yy-mm-dd'
      }
    );
    $featureValueDate.val((new Date()).toISOString().split('T')[0]);
    if (valueData[geometryID]) {
      if (geometryClicked === geometryID) {
        const $table = $featureValue.find('table');
        $('.row-value').remove();
        $featureValue.find('.loading').remove()
        valueData[geometryID].forEach(function (row) {
          $table.append(`<tr class="row-value"><td><b>${row.date}</b></td><td>${row.value}</td></tr>`)
        });
      }

    } else {
      $.ajax({
        url: urlValueByGeometry.replace('/0/', '/' + geometryID + '/'),
        dataType: 'json',
        success: function (data, textStatus, request) {
          valueData[geometryID] = data;
          loadValues(geometryID);
        }
      });
    }

    // ------------------------------------------------------------------
    // SUBMIT DATA
    // ------------------------------------------------------------------
    $featureValue.find("form").submit(function (event) {
      event.preventDefault();
      $submitButton.attr('disabled', true)
      const $form = $(this);
      const url = $form.attr('action');

      const date = $featureValueDate.val();
      const value = $featureValueValue.val();

      // POST DATA
      if (date && value) {
        $.ajax({
          url: url,
          data: {
            date: date,
            value: value
          },
          dataType: 'json',
          type: 'POST',
          success: function (data, textStatus, request) {
            valueData[geometryID] = null;
            $('.leaflet-popup-close-button')[0].click();
            geometryHasValue.push(geometryID);
            loadValues(geometryID);
          },
          error: function (error, textStatus, request) {
          },
          beforeSend: beforeAjaxSend
        });
      }
    });
  }

  // ---------------------------------------------------------------------
  // REFERENCE LAYER
  // ---------------------------------------------------------------------
  const $referenceLayerSelector = $('#reference-layer-selection');
  const referenceLayers = {};
  const $info = $('#reference-layer-selection-wrapper-info');

  function renderGeoms(geoms, finished) {
    if (finished) {
      $info.html(``);
    }
    layer.clearLayers();
    layer.addData(geoms);
    map.fitBounds(layer.getBounds());
  }

  function fetchData(level, referenceLayer, page) {
    $.ajax({
      url: preferences.georepo_api.domain + level.url + '?page=' + page,
    }).done(function (data) {
      referenceLayer.data.features = referenceLayer.data.features.concat(data.results.features)
      renderGeoms(referenceLayer.data, page === data.total_page);
      page += 1
      if (page <= data.total_page) {
        fetchData(level, referenceLayer, page)
      }
    });
  }

  $referenceLayerSelector.change(evt => {
    layer.clearLayers();
    $info.html('<i class="helptext">Loading Reference Data</i>');
    const identifier = evt.target.value;
    const referenceLayer = referenceLayers[identifier];
    if (!referenceLayer.levels) {
      // Fetch reference layer data
      $.ajax({
        url: preferences.georepo_api.reference_layer_detail.replace('<identifier>', identifier)
      }).done(function (data) {
        referenceLayer.levels = data;
        const level = data.levels.filter(level => {
          return (level.level_name.toLocaleLowerCase() === reportingLevel.toLocaleLowerCase() || '' + level.level === reportingLevel)
        })[0]
        if (!level) {
          if (identifier === $referenceLayerSelector.val()) {
            $info.html(`<i class="helptext">Reference Layer does not have data for ${reportingLevel}</i>`);
          }
        } else {
          if (!referenceLayer.data) {
            referenceLayer.data = {
              type: "FeatureCollection",
              features: []
            }
            fetchData(level, referenceLayer, 1)
          } else {
            renderGeoms(referenceLayer.data);
          }
        }
      });
    } else {
      if (referenceLayer.data) {
        renderGeoms(referenceLayer.data);
      } else {
        $info.html(`<i class="helptext">Reference Layer does not have data for ${reportingLevel}</i>`);
      }
    }
  })
  $.ajax({
    url: preferences.georepo_api.reference_layer_list
  }).done(function (data) {
    $referenceLayerSelector.html('');
    data.forEach((referenceLayer, idx) => {
      const identifier = referenceLayer.identifier;
      $referenceLayerSelector.append(`<option value='${identifier}'>${referenceLayer.name}</option>`);
      referenceLayers[identifier] = referenceLayer;
      if (idx === 0) {
        $referenceLayerSelector.val(identifier)
      }
    })
    $referenceLayerSelector.trigger('change')
  });
});