/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define(['js/views/layers/context-layers-draggable'], function (ContextLayerDraggable) {
    return Backbone.View.extend({
        /** Initialization
         */
        cookieName: 'CONTEXTLAYERS',
        cookieOrderName: 'CONTEXTLAYERSORDER',
        layers: {},
        orders: [],
        initialize: function (data) {
            this.data = data;
            this.listener();
            this.idsFromCookie = getCookieInList(this.cookieName);

            let orders = [];
            const self = this;
            this.data.forEach(
                (layer, idx) => {
                    orders.unshift(layer.id);
                    self.layers[layer.id] = layer;
                }
            );
            this.orders = orders;

            // get order cookie
            // TODO:
            //  We disable this for now
            // const orderCookie = getCookieInList(this.cookieOrderName);
            // if (orderCookie.length) {
            //     const newIds = orders.filter(x => !orderCookie.includes('' + x));
            //     orders = orderCookie.concat(newIds);
            // }
        },
        /** Init listener for layers
         */
        listener: function () {
        },
        /** Change orders
         */
        changeOrders: function () {
            const self = this;
            this.orders = [];
            $('#layer-list .side-panel-content .layer-row ').each(function () {
                self.orders.unshift($(this).data('id'));
            });
            setCookie(this.cookieOrderName, this.orders.join(','));
            event.trigger(evt.RERENDER_CONTEXT_LAYER);
        },
        /** Render the views
         */
        render: function () {
            const self = this;
            // ----------------------------------------
            // Init Layers
            // ----------------------------------------
            const $layerList = $('#layer-list .side-panel-content');
            this.orders.forEach(
                (id, idx) => {
                    const layer = self.layers[id];
                    if (layer) {
                        let $appendElement = $layerList;
                        layer['top_tree'] = 'top-tree';
                        if (layer.group_name) {
                            let $group = $layerList.find(`div[data-group="${layer.group_name}"]`);
                            if ($group.length === 0) {
                                $layerList.prepend(templates.CONTEXT_LAYER_GROUP(layer));
                                self.initLayerEvent('context-layer-group-' + layer.group);
                            }
                            layer['top_tree'] = '';
                            $appendElement = $layerList.find(`div[data-group="${layer.group_name}"] .layer-list-group`);

                        }
                        $appendElement.prepend(templates.CONTEXT_LAYER(layer));
                        self.initLayerEvent('context-layer-' + layer.id);
                        self.initLayer(layer);
                    }
                }
            );

            // Init drag event
            new ContextLayerDraggable(this);
        },
        checkboxLayerClicked: function (element) {
            const layer = this.layers[$(element).data('id')];
            const $element = $(`#context-layer-${layer.id}`);
            const $legend = $element.find('.legend');
            const $toggleButton = $element.find('.legend-toggle');
            layer.show = element.checked;
            if (element.checked) {
                $toggleButton.show();
                $toggleButton.addClass('fa-caret-down');
                $toggleButton.removeClass('fa-caret-up');
                appendCookie(this.cookieName, $(element).data('id'));
            } else {
                $legend.hide();
                $toggleButton.hide();
                removeCookie(this.cookieName, $(element).data('id'));
            }
            event.trigger(evt.RERENDER_CONTEXT_LAYER);
        },

        /**
         * Initiate layer from the data
         */
        initLayer: function (layerData) {
            const self = this;
            const layerType = layerData.layer_type;

            // we need to check the params using in url or in parameter model
            const splitted = layerData.url.splitOnce('?')
            const url = splitted[0];
            const params = {};
            if (splitted[1]) {
                const rawParams = splitted[1] ? splitted[1] : '';
                rawParams.split('&').forEach((item) => {
                    const keyValue = item.splitOnce('=');
                    const key = ['crs'].includes(keyValue[0].toLowerCase()) ? keyValue[0].toUpperCase() : keyValue[0].toLowerCase();
                    const value = keyValue[1];
                    if (!['bbox'].includes(key.toLowerCase())) {
                        params[key] = value ? value : '';
                    }
                });
            } else {
                $.each(layerData.parameters, function (index, value) {
                    params[index] = value;
                    if (!Number.isInteger(value)) params[index] = decodeURIComponent(value);
                });
            }

            switch (layerType) {
                case 'ARCGIS': {
                    const options = {
                        token: layerData.token
                    };
                    const argisLayer = (new EsriLeafletLayer(
                        layerData.name, url, params, options, layerData.style
                    ));
                    argisLayer.load().then(output => {
                        self.addLayerToData(layerData, output.layer, argisLayer.getLegend(), output.error);
                    });
                    break;
                }
                case 'Raster Tile': {
                    const layer = L.tileLayer.wms(url, params);
                    let legend = layerData.url_legend ? `<img src="${layerData.url_legend}">` : '';
                    self.addLayerToData(layerData, layer, legend);
                    break;
                }
            }
        },

        /**
         * Initiate layer event
         */
        initLayerEvent: function (id) {
            const self = this;
            // ----------------------------------------
            // Initiate toggle group event
            // ----------------------------------------
            $(`#${id} .group-name .group-toggle`).click(function () {
                const $row = $(this).closest('.group');
                const $i = $(this);
                $i.toggleClass('fa-caret-down').toggleClass('fa-caret-up').toggleClass('hidden');
                if (!$i.hasClass('fa-caret-down')) {
                    $row.find('.layer-list-group').show()
                } else {
                    $row.find('.layer-list-group').hide()
                }
            });
            // ----------------------------------------
            // Initiate toggle legend
            // ----------------------------------------
            $(`#${id} .legend-toggle`).click(function () {
                const $row = $(this).closest('.layer-row');
                const $i = $(this);
                $i.toggleClass('fa-caret-down').toggleClass('fa-caret-up').toggleClass('hidden');
                if (!$i.hasClass('fa-caret-down')) {
                    $row.find('.legend').show()
                } else {
                    $row.find('.legend').hide()
                }
            });

            // ----------------------------------------
            // Initiate group checkbox event
            // ----------------------------------------)
            $(`#${id} .group-checkbox`).click(function () {
                const checked = this.checked;
                $(this).closest('.group').find('.layer-row input').each(function (index) {
                    if (!checked && $(this).prop("checked")) {
                        $(this).click()
                    } else if (checked && !$(this).prop("checked")) {
                        $(this).click()
                    }
                });
            })

            // ----------------------------------------
            // Initiate layer checkbox event
            // ----------------------------------------
            $(`#${id}-input`).click(function () {
                self.checkboxLayerClicked(this);
                const $groupRow = $(this).closest('.group');
                const $group = $groupRow.find('.layer-list-group');
                const inputLength = $group.find('input').length;
                const inputLengthChecked = $group.find('input:checked').length;
                if (inputLength === inputLengthChecked) {
                    $groupRow.find('.group-checkbox').prop('checked', true);
                } else {
                    $groupRow.find('.group-checkbox').prop('checked', false);
                }
            })
        },

        /**
         * Add layer
         * @param layerData - The data of layer
         * @param layer - The leaflet layer
         * @param legend - The legend for the layer
         * @param error - Error text if it is error
         */
        addLayerToData: function (layerData, layer, legend, error) {
            const $element = $(`#context-layer-${layerData.id}`);
            if (layer) {
                const $legend = $element.find('.legend');
                const $legendToggle = $element.find('.legend-toggle');
                const $input = $element.find('input');
                layer.options.pane = evt.CONTEXT_LAYER_PANE;
                layerData['layer'] = layer;
                layerData['show'] = layerData.enable_by_default;
                if (legend) {
                    $legend.html(legend);
                } else {
                    $legend.remove();
                    $legendToggle.remove();
                }
                $input.removeAttr('disabled');
                $element.find('.disabled').removeClass('disabled');
                if (layerData.enable_by_default || this.idsFromCookie.includes('' + layerData.id)) {
                    $input.click();
                    this.checkboxLayerClicked($input[0]);
                }
            } else {
                if (error) {
                    $element.find('.disabled').append(' <i class="fa fa-exclamation" aria-hidden="true" title="' + error + '"></i>')
                }
            }
        }
    })
});