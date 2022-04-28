/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define([], function () {
    return Backbone.View.extend({
        /** Initialization
         */
        panelID: 'indicator-geometry-detail',
        initialize: function (control) {
            this.$el = $('#' + this.panelID);
            this.control = control;
            this.listener();
        },
        /** Init listener for layers
         */
        listener: function () {
        },
        /**
         * Toggle the info panel
         */
        toggle: function () {
            // doing toggle side panel
            const isHidden = this.$el.hasClass('hidden');
            if (!isHidden) {
                this.close();
            } else {
                this.open();
            }
        },
        /**
         * Open the panel
         */
        open: function () {
            const $el = this.$el;
            $el.animate({ left: `0` }, 100, function () {
                $el.removeClass('hidden');
            });
            $('#right-side-navigation div').removeClass('active');
            $('#' + this.panelID + '-nav').addClass('active');
            $('#' + this.panelID + '-nav').show();
        },
        /**
         * Open the panel
         */
        close: function () {
            const $el = this.$el;
            const width = this.$el.width();
            $el.animate({ left: `${width}px` }, 100, function () {
                $el.addClass('hidden');
            });
            $('#' + this.panelID + '-nav').removeClass('active');
        }
    })
});