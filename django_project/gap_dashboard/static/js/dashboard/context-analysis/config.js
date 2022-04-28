let mapView;
let map;
let event;
let Request;

require.config(requireConfig);
require([
    // projects static
    'js/request',
    'js/templates',
    'js/event',
    'js/views/map',
    'js/views/layers/control'
], function (
    _Request, _Templates, _Event,
    Map, LayersControl) {

    new _Templates();
    event = new _Event();
    Request = new _Request();

    // Get context analysis data
    // And render every data to elements
    Request.get(
        contextAnalysisDataURL, {}, {},
        function (data) {
            $('#page-loading').hide();

            $.each(data.indicators_in_groups, function (groupName, groupValue) {
                $.each(groupValue.indicators, function (idx, indicator) {
                    if (indicator.scenario_value !== undefined) {
                        indicatorLatestDate[`${indicator.id}`] = `${indicator.latest_date}`;
                        $(`#indicator-${indicator.id}`).removeClass("disabled");
                        $(`#indicator-${indicator.id} .scenario-bullet`).addClass(`scenario-${indicator.scenario_value}`)
                        $(`#indicator-${indicator.id} td[data-scenario-level='${indicator.scenario_value}']`).addClass(`scenario-${indicator.scenario_value}`);
                        const $input = $(`#indicator-checkbox-${indicator.id}`);
                        $input.prop("disabled", false);
                        $input.attr('data-id', indicator.id);
                        $input.attr('data-name', indicator.name);
                        $input.attr('data-scenario', indicator.scenario_value);
                        $(`#indicator-${indicator.id}`).closest('.group').find('.scenario-bullet').addClass(`scenario-${groupValue.overall_scenario}`)
                        $(`#indicator-${indicator.id}`).closest('.group').find(`td[data-scenario-level='${groupValue.overall_scenario}']`).addClass(`scenario-${groupValue.overall_scenario}`)
                    } else {
                        $(`#indicator-${indicator.id}`).attr("title", "There is no data for for this indicator.");
                    }
                })
            });
            $('.scenario-header .scenario-bullet').addClass(`scenario-${data.overall_scenario.level}`)
            if (data.overall_scenario.level) {
                $('.scenario-header .loading').replaceWith(`${data.overall_scenario.level}: ${data.overall_scenario.name}`);
            } else {
                $('.scenario-header .loading').replaceWith(`<i>- Unkonwn</i>`);
            }

            $.each(data.interventions, function (idx, intervention) {
                $('#map-wrapper').before(_.template($('#_intervention-template').html())(intervention))
            });

            initEvent();

            // initiate all view
            mapView = new Map();
            map = mapView.map;
            new LayersControl(map);
        },
        function () {

        }
    )
    const docStyle = getComputedStyle(document.documentElement);

    function initEvent() {
        // --------------------------------------------------------------------
        // INIT BUTTONS EVENT
        // --------------------------------------------------------------------

        // checking hash to check the tab
        const $list = $('.context-analysis-nav');
        $list.click(function () {
            $list.removeClass('active');
            $(this).addClass('active');
            $('.scenario-section').hide();

            const target = $(this).data('target');
            if (target === 'context-analysis') {
                $('#navigation').addClass('first')
            } else {
                $('#navigation').removeClass('first')
            }
            $(`div[data-program="${target}"]`).show();
            $('#content').scrollTop(0);
            $('#map-wrapper').css('opacity', 1)
        });
        if (!window.location.hash) {
            $($list[0]).click();
        } else {
            const hash = window.location.hash.replaceAll('#', '');
            const $target = $(`.context-analysis-nav[data-target="${hash}"]`);
            if ($target.length === 0) $($list[0]).click();
            else $target.click();
        }

        // table toggle to show/hide all indicators or not
        $('#toggle-table').click(function () {
            $(this).toggleClass('all');
            if ($(this).hasClass('all')) {
                $(this).html('Show just context indicator analysis');
                $('.no-context-analysis').removeClass('hide');
            } else {
                $(this).html('Show all indicators');
                $('.no-context-analysis').addClass('hide');
            }
            $('#indicator .group-name.hidden').click();
        });

        // Event for toggling indicator group
        $('#indicator .group-name .group-toggle').click(function () {
            const $row = $(this).closest('tbody');
            const $i = $(this);
            $i.toggleClass('fa-caret-down');
            $i.toggleClass('fa-caret-up');
            $(this).toggleClass('hidden');
            if (!$i.hasClass('fa-caret-down')) $row.find('tr').show();
            else $row.find('.group-row').hide();
        })
        {
            // ---------------------------------------------------
            // LEFT SIDE
            // ---------------------------------------------------
            // Left side panel of map
            // Event for toggling side panel
            const $leftSide = $('#left-side');
            const $toggleButton = $('#left-side .toggle-button');
            const width = $leftSide.width();
            $toggleButton.click(function () {
                const isHidden = $(this).hasClass('hidden');
                $toggleButton.addClass('hidden');
                $('#left-side .content').hide();
                $(this).removeClass('hidden');
                $(`#${$(this).data('target')}`).show();

                // doing toggle side panel
                if (!isHidden) {
                    if (!$leftSide.data('hidden')) {
                        $leftSide.animate({ left: `-${width}px` }, 100, function () {
                            $leftSide.data('hidden', true)
                        });
                    } else {
                        $leftSide.animate({ left: `0` }, 100, function () {
                            $leftSide.data('hidden', false)
                        });
                    }
                } else {
                    $leftSide.animate({ left: `0` }, 100, function () {
                        $leftSide.data('hidden', false)
                    });
                }
            });
            // indicator shows by default
            $('#indicator-toggle-button').click();

            // Event for toggling full screen
            const $fullScreen = $('.left-side-fullscreen');
            const $scenarioHeader = $('.scenario-header');
            const $indicator = $('#indicator');
            const $exitFullScreen = $('.left-side-exit-fullscreen');
            $fullScreen.click(function () {
                $leftSide.width('100%');
                $exitFullScreen.show();
                $fullScreen.hide();
                $indicator.find('table').addClass('full-screen');
                $leftSide.addClass('full-screen');
                $scenarioHeader.removeClass('shrink');
            });
            $exitFullScreen.click(function () {
                $leftSide.width(width);
                $exitFullScreen.hide();
                $fullScreen.show();
                $indicator.find('table').removeClass('full-screen');
                $leftSide.removeClass('full-screen');
                $scenarioHeader.addClass('shrink');
            });
        }

        {
            // ---------------------------------------------------
            // RIGHT SIDE
            // ---------------------------------------------------
            // Right side panel of map
            // Event for toggling side panel
            const $rigthSide = $('#right-side');
            const $toggleButton = $('#right-side .toggle-button');
            const width = $rigthSide.width();
            $toggleButton.click(function () {
                // doing toggle side panel
                if (!$rigthSide.data('hidden')) {
                    $rigthSide.removeClass('show');
                    $rigthSide.animate(
                        {
                            right: `-${docStyle.getPropertyValue('--right-side-width').trim()}`
                        }, 100, function () {
                            $rigthSide.data('hidden', true);
                        });
                } else {
                    $rigthSide.addClass('show');
                    $rigthSide.animate({ right: `0` }, 100, function () {
                        $rigthSide.data('hidden', false);
                    });
                }
            });
        }
    }
});