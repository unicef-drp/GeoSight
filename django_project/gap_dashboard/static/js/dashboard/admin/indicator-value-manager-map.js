$(document).ready(function () {
    //create map
    const valueData = {};
    const onEachFeatureTemplate = _.template($('#_on_each_feature').html())
    let map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // geometry
    const featureColor = function (feature) {
        let color = legends['NODATA']['color'];
        if (geometryHasUpdatedValue.includes(feature.id)) {
            color = legends['LATESTDATAFOUND']['color'];
        } else if (geometryHasValue.includes(feature.id)) {
            color = legends['NEEDUPDATE']['color'];
        }
        return color
    };
    let geometryClicked = null;
    const layer = L.geoJSON(
        geometry, {
            style: function (feature, layer) {
                return {
                    color: "#ffffff",
                    weight: 1,
                    fillColor: featureColor(feature)
                };
            },
            onEachFeature: function (feature, layer) {
                const id = feature.id;
                feature.properties['id'] = id;
                feature.properties['url'] = urlValueByGeometry.replace('/0/', '/' + id + '/');

                // update bind popup
                layer.bindPopup(
                    L.popup({
                        closeOnClick: false
                    }).setContent(onEachFeatureTemplate(feature.properties))
                ).on("popupopen", () => {
                    setTimeout(function () {
                        loadData(id);
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
                    loadData(id);
                });
            }
        });
    layer.addTo(map);
    map.fitBounds(layer.getBounds());

    // fetch data
    function loadData(geometryID) {
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
                    loadData(geometryID);
                }
            });
        }

        // submit
        $featureValue.find("form").submit(function (event) {
            event.preventDefault();
            $submitButton.attr('disabled', true)
            const $form = $(this);
            const url = $form.attr('action');

            const date = $featureValueDate.val();
            const value = $featureValueValue.val();

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
                        loadData(geometryID);

                        // TODO:
                        //  this is temporary, we need to update the color of the feature on fly
                        //  problem is we need to check the updated data making feature has updated data
                        window.location.reload()
                    },
                    error: function (error, textStatus, request) {
                    },
                    beforeSend: beforeAjaxSend
                });
            }
        });
    }
});