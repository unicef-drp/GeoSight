/**
 * This file contains leaflet map controller
 * Put just function of map in here
 */
define([], function () {
    return Backbone.View.extend({
        /** Initialization
         */
        basemapCookieName: 'BASEMAP',
        basemapLayer: null,
        initialize: function () {
            this.map = L.map('map',
                {
                    attributionControl: false,
                    zoomControl: false
                }
            ).fitBounds([[0, 0], [0, 0]]);
            this.event();
        },
        /** Init listener for map
         */
        listener: function () {
            event.register(this, evt.MAP_PAN, this.panTo);
            event.register(this, evt.MAP_FLY, this.flyTo);
            event.register(this, evt.MAP_ADD_LAYER, this.addLayer);
            event.register(this, evt.MAP_REMOVE_LAYER, this.removeLayer);
        },
        /**
         * Init events
         */
        event: function () {
            const self = this;
            $('#basemap-list .basemap-box').click(function () {
                $('#basemap-list .basemap-box').removeClass('active');
                $(this).addClass('active');
                self.basemapChanged(basemapLayers[$(this).data('id')]);
                setCookie(self.basemapCookieName, $(this).data('id'));
            });

            // set default one
            let basemapDefaultID = basemapDefault;
            if (getCookie(self.basemapCookieName)) {
                basemapDefaultID = getCookie(self.basemapCookieName);
            }
            $(`#basemap-list .basemap-box[data-id="${basemapDefaultID}"]`).click()
        },
        /**
         * Pan map to lat lng
         * @param lat
         * @param lng
         * @param zoom
         */
        panTo: function (lat, lng, zoom) {
            if (zoom) {
                this.map.flyTo([lat, lng], zoom, {
                    duration: 0.5
                });
            } else {
                this.map.panTo(new L.LatLng(lat, lng));
            }
        },
        /**
         * Pan map to lat lng
         * @param bound
         * @param duration
         */
        flyTo: function (bound, duration = 1) {
            if (bound._southWest) {
                this.map.flyToBounds(bound, { 'duration': duration });
            }
        },
        /** Add specific layer to map
         * @param layer, leaflet layer
         */
        addLayer: function (layer) {
            try {
                layer.addTo(this.map)
            } catch (e) {

            }
        },
        /**Remove specific layer from map
         * @param layer, leaflet layer
         */
        removeLayer: function (layer) {
            try {
                this.map.removeLayer(layer)
            } catch (e) {

            }
        },
        /**
         * Basemaps
         */
        basemapChanged: function (basemapDetail) {
            try {
                map.removeLayer(this.basemapLayer)
            } catch (e) {

            }
            if (basemapDetail.type === 'WMS') {
                basemapDetail.parameters['transparent'] = true;
                basemapDetail.parameters['zIndex'] = 1;
                this.basemapLayer = L.tileLayer.wms(basemapDetail.url, basemapDetail.parameters);
            } else {
                this.basemapLayer = L.tileLayer(basemapDetail.url, basemapDetail.parameters);
            }
            this.basemapLayer.addTo(this.map);
        },
    });
});