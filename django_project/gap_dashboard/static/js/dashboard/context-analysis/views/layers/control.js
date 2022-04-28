/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define([
    'js/views/layers/context-layers',
    'js/views/layers/indicator-layer',
    'js/views/layers/administrative-level',
    'js/views/layers/indicator-info/by-summary',
    'js/views/layers/indicator-info/by-geometry',
    'js/views/layers/indicator-info/by-detail'
], function (
    ContextLayers, IndicatorLayer, AdministrativeLevelLayer,
    IndicatorSummary, IndicatorInfoByGeometry, IndicatorInfoByDetail
) {
    return Backbone.View.extend({
        /** Initialization **/
        indicatorLayers: {},
        $lastIndicatorInput: null,

        indicatorLeft: null,
        indicatorRight: null,

        isAutoPlay: false,
        cookieName: 'INDICATORLAYERS',
        initialize: function (map) {
            this.map = map;
            map.createPane(evt.INDICATOR_LEFT_PANE);
            map.createPane(evt.INDICATOR_RIGHT_PANE);
            map.createPane(evt.CONTEXT_LAYER_PANE);

            this.listener();
            this.contextLayers = new ContextLayers(contextLayers);
            this.contextLayers.render();


            // init administrative
            this.administrativeLevelLayer = new AdministrativeLevelLayer();
            this.administrativeLevelLayer.getLayer(
                'Country',
                dateToYYYYMMDD(new Date()),
                function (layer) {
                    mapView.flyTo(layer.getBounds());
                }
            );

            this.idsFromCookie = getCookieInList(this.cookieName);
            this.indicatorInit();
            this.detailPanelControl();
        },
        /** Init listener for layers
         */
        listener: function () {
            event.register(this, evt.RERENDER_CONTEXT_LAYER, this.contextLayersChanged);
            event.register(this, evt.INDICATOR_CHANGED, this.indicatorChanged);
            event.register(this, evt.INDICATOR_VALUES_CHANGED, this.timeSliderControl);

            const self = this;
            const $wrapper = $('#map-wrapper');
            $('#comparing-toggle').click(function () {
                if ($wrapper.hasClass('top-bottom')) {
                    $wrapper.removeClass('top-bottom');
                    $wrapper.addClass('left-right');
                } else {
                    $wrapper.addClass('top-bottom');
                    $wrapper.removeClass('left-right');
                }
                self.indicatorChanged(true);
            })

            // Auto play the time slider
            const $timeSliderWrapper = $('#time-slider-wrapper');

            // start autoplay
            $timeSliderWrapper.find('.fa-play-circle').click(
                function () {
                    $(this).hide();
                    $timeSliderWrapper.find('.fa-stop-circle').show();
                    self.isAutoPlay = true;
                    self.autoplay();
                }
            )
            $timeSliderWrapper.find('.fa-stop-circle').click(
                function () {
                    $(this).hide();
                    $timeSliderWrapper.find('.fa-play-circle').show();
                    self.isAutoPlay = false;
                }
            )
        },
        /** When context layer changed
         */
        contextLayersChanged: function () {
            const self = this;
            $.each(this.contextLayers.orders, function (index, id) {
                const layer = self.contextLayers.layers[id];
                if (layer) {
                    mapView.removeLayer(layer.layer);
                    if (layer.show && layer.layer) {
                        mapView.addLayer(layer.layer);
                    }
                }
            })
        },

        // Check if an indicator checked, change the stage of group name
        checkIndicatorGroup: function ($group) {
            let active = false;
            $group.find('.indicator-checkbox input').each(function () {
                if (this.checked) {
                    active = true;
                }
            });
            $group.removeClass('active');
            if (active) {
                $group.addClass('active');
            }
        },
        // -------------------------------------------------
        // INDICATOR INITITALIZE
        // -------------------------------------------------
        indicatorInit: function () {
            const self = this;
            const $inputs = $('.indicator-checkbox input');
            $inputs.click(function () {
                self.checkIndicatorGroup($(this).closest('.group'));
                // click last indicator input
                if (!self.indicatorLayers[$(this).data('id')]) {
                    self.indicatorLayers[$(this).data('id')] = new IndicatorLayer(
                        self.administrativeLevelLayer,
                        $(this).data('id'),
                        $(this).data('name'),
                        $(this).data('url'),
                        JSON.parse($(this).data('levels').replaceAll('\'', '"')),
                        $(this).data('scenario'),
                        $(this).data('unit'))
                }
                const indicatorLayer = self.indicatorLayers[$(this).data('id')];
                if (this.checked) {
                    if (self.indicatorLeft && self.indicatorRight) {
                        return false
                    }
                    // check which side is it and assign in
                    let side = '';
                    if (!self.indicatorLeft) {
                        side = evt.INDICATOR_LEFT_PANE;
                        self.indicatorLeft = indicatorLayer;
                    } else if (!self.indicatorRight) {
                        side = evt.INDICATOR_RIGHT_PANE;
                        self.indicatorRight = indicatorLayer;
                    }
                    indicatorLayer.show(side);

                    // auto show the info
                    if ($('#right-side').data('hidden')) {
                        $('#info-toggle').click();
                    }
                    appendCookie(self.cookieName, $(this).data('id'));
                } else {
                    // check which side is it and make it null
                    if (indicatorLayer === self.indicatorLeft) {
                        self.indicatorLeft = null;
                    } else if (indicatorLayer === self.indicatorRight) {
                        self.indicatorRight = null;
                    }
                    indicatorLayer.hide();
                    removeCookie(self.cookieName, $(this).data('id'));
                }
            });

            // init default one
            $.each(this.idsFromCookie, function (index, id) {
                $('#indicator-checkbox-' + id).click();

                // TODO:
                //  For the checked indicator
                //  Expand group by default
                // $('#indicator-checkbox-' + id).closest('.group').find('.group-toggle')
            });
            this.changeMasterData(new Date());
        },
        changeMasterData: function (date) {
            const dateStr = dateToYYYYMMDD(date);
            $('.master-data-downloader').each(function () {
                const url = $(this).data('url');
                const ids = url.split('indicator_id_in=');
                if (!ids[1]) {
                    $(this).attr('href', url.replaceAll('date', dateStr));
                    $(this).attr('title', "Download data for date " + dateToDDMMYYY(date));
                } else {
                    let dataExist = false;
                    $.each(ids[1].split(','), function (index, id) {
                        if (indicatorLatestDate[parseInt(id)] && indicatorLatestDate[parseInt(id)] <= dateStr) {
                            dataExist = true
                        }
                    })
                    if (dataExist) {
                        $(this).attr('title', "Download data for date " + dateToDDMMYYY(date));
                        $(this).attr('href', url.replaceAll('date', dateStr));
                    } else {
                        $(this).removeAttr('href');
                        $(this).attr('title', "No data found");
                    }
                }
            })
        },
        /**
         * When indicator layer added/removed
         */
        indicatorChanged: function (force) {
            $('#comparing-toggle').hide();
            let position = null;
            if (this.controlComparison) {
                if (!force) {
                    position = this.controlComparison._getPosition();
                }
                this.controlComparison.remove();
                this.controlComparison = null;
                this.map.getPane(evt.INDICATOR_LEFT_PANE).style.clip = '';
                this.map.getPane(evt.INDICATOR_RIGHT_PANE).style.clip = '';
            }

            $('#info-toggle').show();

            if (this.indicatorRight && this.indicatorLeft) {
                $('#comparing-toggle').show();
                this.controlComparison = L.control.layerSwiper(
                    {
                        id: 'lyrSwiper',
                        title: 'lyrSwiper',
                        position: 'topright',
                        orientation: $('#map-wrapper').hasClass('top-bottom') ? 'h' : 'v',
                        ratio: 0.5,
                        swipeLyrConf: {
                            base: {
                                layer: this.indicatorRight.layer, clip: null, $pane: $(`.leaflet-${evt.INDICATOR_RIGHT_PANE}-pane`)
                            },
                            compare: {
                                layer: this.indicatorLeft.layer, clip: null, $pane: $(`.leaflet-${evt.INDICATOR_LEFT_PANE}-pane`)
                            }
                        }
                    }
                ).addTo(this.map);
                if (position) {
                    this.controlComparison._setPosition(position);
                }
            } else if (!this.indicatorRight && !this.indicatorLeft) {
                if (this.bySummary) {
                    this.detailPanelOpened(this.bySummary.id);
                }
                $('#info-toggle').hide();
                if (!$('#right-side').data('hidden')) {
                    $('#info-toggle').click();
                }
                return
            }
        },
        /**
         * When indicator value changed
         */
        timeSliderControl: function () {
            const self = this;
            this.dates = [];
            if (this.indicatorRight && this.indicatorRight.values) {
                $.each(this.indicatorRight.values, function (idx, value) {
                    const date = new Date(value.date);
                    self.dates.push(dateToYYYYMMDD(date));
                });
            }
            if (this.indicatorLeft && this.indicatorLeft.values) {
                $.each(this.indicatorLeft.values, function (idx, value) {
                    const date = new Date(value.date);
                    self.dates.push(dateToYYYYMMDD(date));
                });
            }

            const $timeSliderWrapper = $('#time-slider-wrapper');
            if (self.dates.length !== 0) {
                $timeSliderWrapper.show();
                const $slider = $('#time-slider');
                self.dates.push(dateToYYYYMMDD(new Date()));
                self.dates = [...new Set(self.dates)];
                self.dates.sort();
                $slider.show();
                $slider.attr('min', 0);
                $slider.attr('max', (self.dates.length - 1));
                $slider.val((self.dates.length - 1));

                $slider.off('input');
                $slider.on('input', e => {
                    self.timeSliderChanged();
                    $timeSliderWrapper.find('.fa-stop-circle').click();
                });
                self.timeSliderChanged();
            } else {
                this.isAutoPlay = false;
                $timeSliderWrapper.hide();
                this.changeMasterData(new Date())
            }
        },
        timeSliderChanged: function () {
            const $slider = $('#time-slider');
            const date = this.dates[$slider.val()];
            let selectedDate = dateToDDMMYYY(new Date(date));
            if (selectedDate === dateToDDMMYYY(new Date())) {
                selectedDate = 'Today'
            }
            $('#time-slider-indicator').text(selectedDate);
            if (this.indicatorLeft) {
                this.indicatorLeft.date = date;
                this.indicatorLeft._addLayer();
            }
            if (this.indicatorRight) {
                this.indicatorRight.date = date;
                this.indicatorRight._addLayer();
            }
            event.trigger(evt.DATE_CHANGED, date);
            this.changeMasterData(new Date(date));
        },
        /**
         * Next date AutoPlay
         */
        autoplay: function () {
            if (!this.isAutoPlay) {
                return false
            }
            const self = this;
            setTimeout(
                function () {
                    if (!self.isAutoPlay) {
                        return false
                    }
                    const $slider = $('#time-slider');
                    let currentValue = parseInt($slider.val()) + 1;
                    if (currentValue > parseInt($slider.attr('max'))) {
                        currentValue = 0;
                    }
                    $slider.val(currentValue);
                    self.timeSliderChanged();
                    self.autoplayCheck();
                }, 1000
            );
        },
        /**
         * Autoplay Check
         * Will go to next autoplay if the indicators loaded
         */
        autoplayCheck: function () {
            const self = this;
            let loaded = true;
            if ((this.indicatorLeft && !this.indicatorLeft.isLoaded) || (this.indicatorRight && !this.indicatorRight.isLoaded)) {
                loaded = false;
            }
            if (loaded) {
                self.autoplay();
            } else {
                setTimeout(
                    function () {
                        self.autoplayCheck();
                    }, 100
                );
            }
        },

        // -----------------------------------------------------------
        // HANDLING THE SIDE PANEL DETAIL
        // -----------------------------------------------------------
        /**
         * Control for detail panel
         */
        detailPanelControl: function () {
            const self = this;
            this.bySummary = new IndicatorSummary(this);
            this.byGeometry = new IndicatorInfoByGeometry(this);
            this.byDetail = new IndicatorInfoByDetail(this);
            $('#right-side-navigation div').click(function () {
                self.detailPanelOpened($(this).attr('id').replaceAll('-nav', ''));

            })
        },
        detailPanelOpened: function (panelID, force) {
            if (panelID === this.byGeometry.panelID) {
                this.byDetail.opened = false;
                this.bySummary.close();
                this.byGeometry.open();
                this.byDetail.close();
            } else if (panelID === this.byDetail.panelID) {
                this.bySummary.close();
                this.byDetail.open();
            } else {
                this.byDetail.opened = false;
                this.bySummary.open();
                this.byGeometry.close();
                this.byDetail.close();
            }
        },
    });
});