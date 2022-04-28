/**
 * Handler of dispatcher event
 */
const evt = {
    MAP_PAN: 'map:pan', // Pan the map
    MAP_FLY: 'map:fly', // Fly the map
    MAP_ADD_LAYER: 'map:layer:add', // add layer to map
    MAP_REMOVE_LAYER: 'map:layer:remove', // remove layer from map

    RERENDER_CONTEXT_LAYER: 'layers:context-layer:rerender', // When layers changed
    ADMINISTRATIVE_GET_LAYER: 'administrative:get-layer', // Get administrative layer

    INDICATOR_LEFT_PANE: 'indicator-left-pane', // Indicator left
    INDICATOR_RIGHT_PANE: 'indicator-right-pane', // Indicator right
    CONTEXT_LAYER_PANE: 'context-layer-pane', // Indicator right
    INDICATOR_CHANGED: 'indicator:changed',
    INDICATOR_VALUES_CHANGED: 'indicator:value-changed',

    GEOMETRY_CLICKED: 'geometry:clicked', // Geometry clicked
    GEOMETRY_INDICATOR_CLICKED: 'geometry-indicator:clicked', // Geometry clicked
    DATE_CHANGED: 'date:changed', // When global date changed
    INDICATOR_TO_DETAIL: 'indicator:to-detail',
    INDICATOR_DETAIL_LIST_CHANGED: 'indicator:detail-list-changed',
};
define([], function () {
    return Backbone.View.extend({

        initialize: function () {
            this.dispatcher = _.extend({}, Backbone.Events);
        },
        /** Register event with specific name for an objecy
         * @param obj
         * @param name, name of event that will be used
         * @param func, function that will be called for the event
         */
        register: function (obj, name, func) {
            obj.listenTo(this.dispatcher, name, func);
        },
        /** Trigger event with specific name
         * @param name, name of event that will be used
         * @param args, any parameters that will be passed to function
         */
        trigger: function (name, ...args) {
            this.dispatcher.trigger(name, ...args)
        }
    });
});