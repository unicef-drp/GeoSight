$(document).ready(function () {

    //create map
    let map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Indicator Layer
    const onEachFeature = function onEachFeature(feature, layer) {
        layer.bindPopup(_.template(
            $('#_popup-template').html())(feature.properties)
        );
        layer.on('click', function (e) {
            this.openPopup();

            // event for the buttons
            $('.edit-button').click(function () {
                $('.leaflet-popup-content .input').show();
                $('.leaflet-popup-content .value').hide();
                return false;
            });
            $('.cancel-button').click(function () {
                $('.leaflet-popup-content .input').hide();
                $('.leaflet-popup-content .value').show();
                return false;
            });
            $('.save-button').click(function () {
                $(this).closest('form').find('.input').prop('disabled', true);

                const data = {};
                $(this).closest('form').find('input').each(function () {
                    data[$(this).attr('name')] = $(this).val();
                });
                $.ajax({
                    url: urls['geometry-detail-api'].replace('9999', feature.id),
                    data: data,
                    dataType: 'json',
                    type: 'POST',
                    success: function (data, textStatus, request) {
                        window.location.reload()
                    },
                    error: function (error, textStatus, request) {
                    },
                    beforeSend: beforeAjaxSend
                });
                return false;
            })
        });
    };
    const geometry = {};
    const geometryLayer = L.geoJSON(null, {
            style: {
                color: "#ff7800",
                weight: 1,
                fillOpacity: 0
            },
            onEachFeature: onEachFeature
        }
    );
    geometryLayer.addTo(map);

    // LEVELS
    let init = true;
    let identifierSelected = null;
    const $levelSelection = $('#level-selection');
    const date = dateToYYYYMMDD(new Date());
    selectLevel($($levelSelection.find('div')[0]));

    function selectLevel($level) {
        const level = $level.data('level');
        $levelSelection.find('div').removeClass('active');
        $level.addClass('active');

        // save identifier
        const identifier = `${level}-${date}`;
        identifierSelected = identifier;

        // get geojson
        geometryLayer.clearLayers();
        $('#form table .list').html('');
        if (!geometry[identifier]) {
            const urlRequest = url.replace('level', level).replace('date', date)
            $('#form table .list').html('<tr><td><i>Loading</i><td></tr>');
            $.ajax({
                url: urlRequest,
                dataType: 'json',
                success: function (geojson, textStatus, request) {
                    geometry[identifier] = geojson;
                    if (identifierSelected === identifier) {
                        selectLevel($level);
                    }
                }
            });
        } else {
            geometryLayer.addData(geometry[identifier]);
            if (init) {
                map.fitBounds(geometryLayer.getBounds());
            }
            init = false;
            $.each(geometry[identifier].features, function (index, feature) {
                $('#form .list').append(_.template(
                    $('#_row-table-template').html())({
                        id: feature.id,
                        name: feature.properties.name,
                        alias: feature.properties.alias,
                        identifier: feature.properties.identifier,
                        dashboard_link: feature.properties.dashboard_link
                    })
                )
            });
            $('#form input').keyup(function () {
                $(this).closest('tr').addClass('changed');
            });

        }
    }

    $levelSelection.find('div').click(function () {
        if (!$(this).hasClass('disabled')) {
            selectLevel($(this));
        }
    });

    if (window.location.hash) {
        const hash = window.location.hash.replaceAll('#', '');
        $(`#level-selection div[data-level="${hash}"]`).click();
    }

    $('#form form').css('padding-right', $('#level-selection').width() + 20)
    $('#toggle-button').click(function () {
        $('#map-section').toggle();
        $('#form').toggle();
        if ($('#form').is(":visible")) {
            $(this).html('To map');
            $('#submit-button').show();
        } else {
            $(this).html('To table');
            $('#submit-button').hide();
        }
    })

    // When submit
    $('#submit-button').click(function () {

        const data = {};
        $('#form .changed').each(function () {
            $(this).find('input').each(function () {
                data[$(this).attr('name')] = $(this).val();
            })
        })

        $('#form input').prop('disabled', true);
        $('#toggle-button').prop('disabled', true);
        $('#submit-button').prop('disabled', true);
        $('#level-selection div').addClass('disabled');

        $.ajax({
            url: window.location.href,
            data: data,
            dataType: 'json',
            type: 'POST',
            success: function (data, textStatus, request) {
                window.location.reload()
            },
            error: function (error, textStatus, request) {
                if (error.status === 200) {
                    window.location.reload()
                }
            },
            beforeSend: beforeAjaxSend
        });
    })
});