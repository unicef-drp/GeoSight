/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define([], function () {
    return Backbone.View.extend({
        /** Initialization
         */
        layer: null,
        geometryLayers: {},
        initialize: function () {
        },
        /** Init listener for layers
         */
        listener: function () {
            event.register(this, evt.ADMINISTRATIVE_GET_LAYER, this.getLayer);
        },
        /**
         * Get layer with identifier
         * @returns {string}
         */
        getLayer: function (level, date, callback) {
            const self = this;
            const identifier = `${level}-${date}`;
            const layer = self.geometryLayers[identifier];
            if (!layer) {
                Request.get(
                    url.replace('level', level).replace('date', date), {}, {},
                    function (data) {
                        self.geometryLayers[identifier] = L.geoJSON(
                            data, {
                                style: {
                                    color: "#ff7800",
                                    weight: 1,
                                    fillOpacity: 0
                                },
                                onEachFeature: self.onEachFeature
                            }
                        );
                        self.getLayer(level, date, callback);
                    }, function () {
                        callback(layer);
                    })
            } else {
                callback(layer)
            }
        },

        /**
         * POPUP Administrative Layer
         * @param feature
         * @param layer
         */
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(templates.ADMINISTRATIVE_POPUP(feature.properties));
        }
    })
});