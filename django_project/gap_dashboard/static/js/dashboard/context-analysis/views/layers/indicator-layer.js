/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define([], function () {
    return Backbone.View.extend({
        /** Initialization
         */
        initialize: function (administrativeLevelLayer, id, name, url, levels, scenario, unit) {
            this.name = name;
            this.administrativeLevelLayer = administrativeLevelLayer;
            this.$el = $(`#indicator-` + id);
            this.$input = this.$el.find('input');
            this.$legend = this.$el.find('.legend');
            this.levels = levels;
            this.date = dateToYYYYMMDD(new Date());
            this.level = this.levels[0];
            this.url = url;
            this.id = id;
            this.layers = {};
            this.layer = null;
            this.scenario = scenario;
            this.unit = unit;
            this.isShow = false;
            this.isLoaded = false;


            // for the legend
            const self = this;
            this.$legend.find('input').change(function () {
                $(this).closest('.legend-row').removeClass('active');
                if (this.checked) {
                    $(this).closest('.legend-row').addClass('active');
                }
                self.setStyle();
            });
            event.register(this, evt.GEOMETRY_CLICKED, this.geometryClicked);
            event.register(this, evt.GEOMETRY_INDICATOR_CLICKED, this.geometryClicked);
        },
        /**
         * Event when geometry is clicked
         * @param geometry
         */
        geometryClicked: function (geometry) {
            this.geometry = geometry;
            this.setStyle();
        },
        /**
         * Get layer with identifier
         * @returns {string}
         */
        getLayer: function (callback) {
            const self = this;
            const level = this.level;
            const date = this.date;
            const identifier = `${level}-${date}`;
            const layer = self.layers[identifier];
            $(`#${this.side}-value-donut-chart`).html('');
            $(`#${this.side}-value-table`).html('');
            if (!layer) {
                Request.get(
                    self.url.replace('level', level).replace('date', date), {}, {},
                    function (data) {
                        // process data
                        // we need to make sure all layer are turned off
                        const cleanGeojson = {
                            type: "FeatureCollection",
                            features: []
                        }
                        self.administrativeLevelLayer.getLayer(level, date, function (geometryLayer) {
                            if (geometryLayer) {
                                const geometryData = JSON.parse(JSON.stringify(geometryLayer.toGeoJSON()));
                                $.each(geometryData.features, function (idx, feature) {
                                    $.each(data, function (idx, rowData) {
                                        if (feature.id === rowData.geometry_id) {
                                            rowData['geometry_level'] = feature.properties.geometry_level_name;
                                            rowData['dashboard_link'] = feature.properties.dashboard_link;
                                            feature['properties'] = rowData;
                                            cleanGeojson['features'].push(feature);
                                            return false;
                                        }
                                    })
                                });
                                self.layers[identifier] = cleanGeojson;

                                // recall getLayer if the current date same with date of request
                                if (date === self.date) {
                                    self.getLayer(callback);
                                }
                            } else {
                                callback(null);
                            }
                        });
                    }, function () {
                        callback(null);
                    })
            } else {
                callback(
                    L.geoJSON(
                        layer, {
                            pane: self.side,
                            paneID: self.side,
                            name: self.name,
                            onEachFeature: function (feature, layer) {
                                if (feature.properties.background_color) {
                                    let defaultHtml =
                                        `<tr style="background-color: ${feature.properties.background_color}; color: ${feature.properties.text_color}"><td colspan="2" style="text-align: center"><b>${self.name}</b></td></tr>` +
                                        `<tr><td colspan="2"><button class="white-button" onclick="triggerEventToDetail('${self.id}', '${self.name}')">Detail</button></td></tr>` +
                                        `<tr><td valign="top"><b>Scenario</b></td valign="top"><td>${feature.properties.scenario_text}</td></tr>` +
                                        `<tr><td><b>${self.name} value</b></td><td valign="top" title="${feature.properties.value}">${numberWithCommas(feature.properties.value)} ${self.unit}</td></tr>`

                                    // check others properties
                                    const geometryProperties = {};
                                    geometryProperties[feature.properties['geometry_level'] + ' code'] = feature.properties['geometry_code'];
                                    geometryProperties[feature.properties['geometry_level'] + ' name'] = feature.properties['geometry_name'];
                                    $.each(geometryProperties, function (key, value) {
                                        defaultHtml += `
                                        <tr>
                                            <td valign="top"><b>${key.capitalize()}</b></td>
                                            <td valign="top" class="geometry-value geometry-${feature.properties.geometry_id}">
                                                ${numberWithCommas(value)}
                                                ${templates.SCENARIO_BULLET()}
                                            </td>
                                        </tr>`
                                    });
                                    $.each(feature.properties, function (key, value) {
                                        if (![
                                            'unit', 'value', 'background_color', 'text_color',
                                            'indicator_id', 'scenario_text', 'scenario_value',
                                            'geometry_id', 'geometry_code', 'geometry_name', 'geometry_level', 'dashboard_link',
                                            'details'
                                        ].includes(key)) {
                                            defaultHtml += `<tr><td valign="top"><b>${key.capitalize()}</b></td><td valign="top">${numberWithCommas(value)}</td></tr>`
                                        }
                                    });
                                    if (feature.properties.details && feature.properties.details.length > 0) {
                                        defaultHtml += '<tr><td colspan="2"><button type="button" class="main-button list-detail-button" data-toggle="modal" data-target="#global-modal">List data</button></td></tr>';
                                    }

                                    // for details
                                    layer.bindPopup('' +
                                        '<table>' + defaultHtml + '</table>');
                                }

                                // on feature clicked
                                layer.on("click", function (e) {
                                    event.trigger(evt.GEOMETRY_CLICKED, feature);
                                    // This is for detail data in list
                                    event.trigger(evt.INDICATOR_DETAIL_LIST_CHANGED, feature.properties.details, `${self.name} <span style="color: gray">in</span> ${feature.properties['geometry_name']} (${feature.properties['geometry_code']})`)
                                });
                            }
                        }
                    )
                )
            }
        },

        /**
         * Show this indicator
         */
        show: function (side) {
            this.isShow = true;
            this.side = side;
            this.initLevelSelection();
            this._addLayer();
            $(`.${this.side}-text`).html(`<table class="indicator-${this.id}"><tr><td><div>${this.name}</div></td> <td>${templates.SCENARIO_BULLET().replace('scenario-0', `scenario-${this.scenario}`).replace('pull-right', '')}</td></tr></table>`);
            $(`.${this.side}-info`).show();
            $(`.${this.side}-info`).html(templates.INDICATOR_SUMMARY({
                id: this.id,
                name: `<div class="indicator-${this.id}">${this.name}</div>`,
                indicator: templates.SCENARIO_DOWNLOAD().replace('<ids>', this.id) +
                    templates.SCENARIO_BULLET().replace('scenario-0', `scenario-${this.scenario}`),
                side: this.side
            }));
            const onclick = $('#indicator-' + this.id).find('.scenario-bullet').attr('onclick');
            if (onclick) {
                $('.indicator-' + this.id).find('.scenario-bullet').attr('onclick', onclick);
            }

            this.renderValueOvertime();
            event.trigger(evt.INDICATOR_VALUES_CHANGED);
        },
        /**
         * Add specific layer to map
         */
        _addLayer: function () {
            const self = this;
            this._removeLayer();
            $(`.${this.side}-info .loading-info`).show();
            $(`.${this.side}-info .no-data-found`).hide();
            $(`.indicator-${this.id} .scenario-bullet`).addClass('show');
            $(`.indicator-${this.id} .spinner`).addClass('loading');
            $(`.indicator-${this.id} .spinner`).show();
            this.isLoaded = false;
            this.getLayer(function (layer) {
                self.isLoaded = true;
                $(`.${self.side}-info .loading-info`).hide();
                $(`.indicator-${self.id} .spinner`).removeClass('loading');
                $(`.indicator-${self.id} .scenario-bullet`).addClass('show');
                if (!self.isShow) {
                    return
                }
                $(`.${self.side}-info .value-table`).html('<table></table>');
                self._removeLayer();
                self.layer = layer;
                self.setStyle();
                self.$legend.show();
                self.layer.options['pane'] = map.getPane(self.side);
                mapView.addLayer(self.layer);
                event.trigger(evt.INDICATOR_CHANGED);
            });
        },
        /**
         * hide this indicator
         */
        hide: function () {
            this.isShow = false;
            const $levelSelection = $(`.${this.side}-level-selection`);
            $levelSelection.html('');
            this.level = this.levels[0];
            this.$legend.hide();
            this._removeLayer();
            $(`.${this.side}-text`).html(``);
            $(`.${this.side}-info`).hide();
            event.trigger(evt.INDICATOR_VALUES_CHANGED);
            $(`.indicator-${this.id} .spinner`).hide();
            $(`.indicator-${this.id} .scenario-bullet`).removeClass('show');
        },
        /**
         * Remove specific layer from map
         */
        _removeLayer: function () {
            mapView.removeLayer(this.layer);
            event.trigger(evt.INDICATOR_CHANGED);
        },

        /**
         * Remove specific layer from map
         */
        initLevelSelection: function () {
            const self = this;
            const $levelSelection = $(`.${this.side}-level-selection`);
            $levelSelection.html('');
            $.each(this.levels, function (key, level) {
                let active = ''
                if (level === self.level) {
                    active = 'active'
                }
                $levelSelection.prepend(`<div id="level-${level}" data-level="${level}" class="${active}">${level}</div>`);
            });
            $levelSelection.find('div').click(function () {
                self.level = $(this).data('level');
                $levelSelection.find('div').removeClass('active')
                $levelSelection.find(`div[data-level="${self.level}"]`).addClass('active');
                self._addLayer();
            })
        },

        /**
         * Set Style
         */
        setStyle: function () {
            const self = this;
            $(`.${self.side}-info .value-table table`).html('');
            if (!this.geometry) {
                map.closePopup();
            }
            if (this.layer) {
                const levelActivated = [];
                this.$el.find('.legend-row.active').each(function () {
                    levelActivated.push($(this).data('level'));
                });
                const style = function (feature, layer) {
                    if (levelActivated.includes(feature.properties.scenario_value)) {
                        let color = '#ffffff';
                        let weight = 0.5;
                        if (self.geometry && feature.id === self.geometry.id) {
                            color = '#ffffff';
                            weight = 3;
                        }
                        return {
                            color: color,
                            weight: weight,
                            opacity: 1,
                            fillColor: feature.properties.background_color,
                            fillOpacity: 0.7
                        };
                    } else {
                        return {
                            opacity: 0,
                            fillOpacity: 0
                        };
                    }
                };
                this.layer.setStyle(style);

                // --------------------------------------------
                // CREATE THE INFO TABLE
                // --------------------------------------------
                const features = JSON.parse(JSON.stringify(this.layer.toGeoJSON().features));
                sortArrayOfDict(features, 'geometry_name');

                const rawDonutData = {};
                let total = 0;
                $.each(features, function (idx, feature) {
                    if (levelActivated.includes(feature.properties.scenario_value)) {
                        $(`.${self.side}-info .value-table table`).append(
                            `<tr>
                                <td style="text-align: right; color: ${feature.properties.background_color}"><b class="value-key" data-id="${feature.id}">${feature.properties.geometry_name}</b></td>
                                <td style="background-color: ${feature.properties.background_color}" class="value-color"></td>
                                <td>${numberWithCommas(feature.properties.value)} ${indicatorUnit[feature.properties.indicator_id] ? indicatorUnit[feature.properties.indicator_id] : ''}</td>
                                <!--<td>${feature.properties.value}</td>-->
                            </tr>
                        `);

                        // get data for donut
                        if (!rawDonutData[feature.properties.scenario_value]) {
                            rawDonutData[feature.properties.scenario_value] = {
                                name: feature.properties.scenario_text,
                                y: 0,
                                color: feature.properties.background_color
                            }
                        }
                        rawDonutData[feature.properties.scenario_value].y += 1
                        total += 1;
                    }
                    $(`.${self.side}-info .value-key`).off("click").click(function () {
                        const id = $(this).data('id');
                        $.each(self.layer.getLayers(), function (idx, layer) {
                            if (layer.feature.id === id) {
                                layer.openPopup();
                                const center = layer.getCenter();
                                mapView.panTo(center.lat, center.lng);
                                event.trigger(evt.GEOMETRY_CLICKED, layer.feature);
                                return false
                            }
                        });
                    })
                });

                // rendering donut graph
                const donutData = []
                $.each(rawDonutData, function (idx, data) {
                    donutData.push(data)
                });
                $(`#${self.side}-value-donut-chart`).html('');
                $(`.${self.side}-info .no-data-found`).hide();
                if (donutData.length > 0) {
                    self.renderValueDonut(donutData, total);
                } else {
                    $(`.${self.side}-info .no-data-found`).show();
                    $(`#${self.side}-value-donut-chart`).html('');

                }
            }
        },
        // -----------------------------------------------------------
        // RENDERING CHART
        // -----------------------------------------------------------
        /**
         * Render all value overtime
         */
        renderValueDonut: function (data, total) {
            $(`#${this.side}-value-donut-chart`).html('');
            $(`#${this.side}-value-donut-chart`).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                title: {
                    text: 'Number of district',
                    align: 'center',
                    verticalAlign: 'middle',
                    style: { "fontSize": "0" }
                },
                tooltip: {
                    pointFormat: `<b>{point.y}</b> of <b>${total}</b> ${this.level.toLowerCase()}s`,
                    style: { "fontSize": "12px" }
                },
                series: [{
                    type: 'pie',
                    name: 'District number',
                    innerSize: '50%',
                    data: data,
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                }],
                legend: {
                    enabled: true
                },
            });
        },
        /**
         * Render all value overtime
         */
        renderValueOvertime: function () {
            const self = this;
            $(`.${this.side}-info .loading-info`).show();
            if (!self.values) {
                Request.get(
                    self.url.replace('level', self.levels[self.levels.length - 1]).replace('/date', '') + '?exact_date=True', {}, {},
                    function (data) {
                        $(`.${self.side}-info .loading-info`).hide();
                        self.values = data;
                        self.renderValueOvertime();
                        event.trigger(evt.INDICATOR_VALUES_CHANGED);
                    }, function () {
                        $(`.${self.side}-info .loading-info`).hide();
                        $(`.${self.side}-info .value-chart`).html('<span class="error">Error</span>')
                        event.trigger(evt.INDICATOR_VALUES_CHANGED);
                        self.values = [];
                    }
                )
            }
        },
    })
});