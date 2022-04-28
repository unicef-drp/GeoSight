/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define(['js/views/layers/indicator-info/base'], function (Base) {
    return Base.extend({
        /** Initialization
         */
        panelID: 'indicator-summary',
        /**
         * Open the panel
         */
        open: function () {
            $('#' + this.panelID + '-nav').addClass('active');
            event.trigger(evt.GEOMETRY_INDICATOR_CLICKED, null);
        },
        /**
         * Open the panel
         */
        close: function () {
            $('#' + this.panelID + '-nav').removeClass('active');
        },
    })
});