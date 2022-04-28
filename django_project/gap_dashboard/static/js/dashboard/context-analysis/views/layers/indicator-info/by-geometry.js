/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define(['js/views/layers/indicator-info/base'], function (Base) {
    return Base.extend({
        /** Initialization
         */
        panelID: 'indicator-list-by-geometry',
        opened: false,
        /**
         * Init listener for layers
         */
        listener: function () {
            event.register(this, evt.GEOMETRY_CLICKED, this.geometryClicked);
            event.register(this, evt.DATE_CHANGED, this.dateChanged);
        },
        changed: function () {
            if (this.opened && this.geometry && this.date) {
                const self = this;
                this.$el.find('tr').hide();
                this.$el.find('#indicator-geometry-loading').show();
                this.$el.find('.indicator-info-title .col').html(
                    `${this.geometry.properties.geometry_name} (${this.geometry.properties.geometry_code})  <br><span style="color: gray">on</span> ${this.date}`
                );
                this.control.detailPanelOpened(this.panelID);
                const url = urls['indicators-values-by-geometry-level-date-api'].replaceAll(
                    'geometry_identifier', this.geometry.properties.geometry_code).replaceAll(
                    'geometry_level', this.geometry.properties.geometry_level).replaceAll(
                    'date', this.date);

                const $noData = this.$el.find('#no-data');
                this.$el.find('#no-data').html('');
                this.currentUrl = url;
                if (this.request) {
                    this.request.abort();
                }
                this.request = Request.get(
                    url, {}, {},
                    function (data) {
                        if (self.currentUrl !== url) {
                            return
                        }
                        self.$el.find('#indicator-geometry-loading').hide();
                        self.$el.find('tr').show();
                        self.$el.find('tr').addClass('disabled');
                        self.$el.find('.value-color').css('background', '');
                        self.$el.find('.value-name').html('<i>No data found</i>');
                        const groupsValue = {}
                        const allValues = []
                        $.each(data, function (idx, rowData) {
                            const $row = $('#indicator-by-geometry-' + rowData.indicator_id);
                            const $rowGroup = $row.closest('.group').find('.group-name');
                            $row.removeClass('disabled');
                            $rowGroup.removeClass('disabled');
                            $rowGroup.show();
                            $row.show();
                            $($row.find('td')[0]).attr('onclick', `triggerEventToDetail('${rowData.indicator_id}', '${$($row.find('td')[0]).html()}')`);
                            $($row.find('td')[1]).css('background', rowData.background_color);
                            $($row.find('td')[2]).html(`${numberWithCommas(rowData.value)} ${indicatorUnit[rowData.indicator_id] ? indicatorUnit[rowData.indicator_id] : ''}`);

                            if (!groupsValue[rowData['group_name']]) {
                                groupsValue[rowData['group_name']] = []
                            }
                            groupsValue[rowData['group_name']].push(rowData.scenario_value);
                            allValues.push(rowData.scenario_value);
                        });

                        // get the common value for each group
                        $.each(groupsValue, function (groupName, array) {
                            const scenario = scenarios[returnMostOccurring(array)[0]];
                            if (scenario) {
                                const $groupEl = self.$el.find(`.group-name[data-name="${groupName}"]`);
                                $($groupEl.find('td')[1]).css('background', scenario.color);
                                $($groupEl.find('td')[2]).html(scenario.text);
                            }
                        })
                        // for all values
                        const $bullet = self.$el.find('.indicator-info-title .scenario-bullet')
                        $.each(scenarios, function (scenarioLevel, data) {
                            $bullet.removeClass('scenario-' + scenarioLevel);
                        });

                        const scenarioClass = 'scenario-' + returnMostOccurring(allValues)[0]
                        $bullet.addClass(scenarioClass);

                        // thisis for popup
                        const $popupBullet = $('.geometry-' + self.geometry.properties.geometry_id + ' .scenario-bullet');
                        $popupBullet.addClass(scenarioClass);

                        // create dashboard link
                        if (self.geometry.properties.dashboard_link) {
                            $bullet.attr('onclick', `showDashboard('${self.geometry.properties.dashboard_link}')`)
                            $popupBullet.attr('onclick', `showDashboard('${self.geometry.properties.dashboard_link}')`)
                        } else {
                            $bullet.removeAttr('onclick')
                            $popupBullet.removeAttr('onclick')
                        }

                        // duplicate to no-data tbody
                        self.$el.find('.disabled').each(function () {
                            $(this).clone().appendTo($noData);
                        })
                    }, function (e) {
                        console.log(e)
                    })
            }
        },
        /**
         * Open the panel
         */
        open: function () {
            Base.prototype.open.apply(this);
            event.trigger(evt.GEOMETRY_INDICATOR_CLICKED, this.geometry);
        },
        /**
         * Open the panel
         */
        close: function () {
            Base.prototype.close.apply(this);
            this.opened = false;
        },
        /**
         * When geometry clicked
         */
        geometryClicked: function (geometry) {
            this.geometry = geometry;
            this.opened = true;
            this.changed();
        },
        /**
         * When date changed
         */
        dateChanged: function (date) {
            this.date = date;
            this.changed();
        }
    })
});