/**
 * Layers of map controlled in here.
 * Add layers in here.
 */
define([], function () {
    return Backbone.View.extend({
        /** Initialization
         */
        initialize: function (parent) {
            // TODO:
            //  We disable this for now
            //  Bug is when we drag/drop, the toggle is not working
            return false;


            const $dropArea = $('#layer-list .side-panel-content');
            let $temporary = null;
            let $dropAreaOver = null;

            function dragFunction(evt) {
                if ($dropAreaOver) {
                    removeTemporary();
                    var relY = $(evt.target).position().top - $dropAreaOver.offset().top;
                    let $blockElement = null;
                    $dropAreaOver.find('.top-tree').each(function (index) {
                        const levelY = $(this).position().top - $dropAreaOver.offset().top
                        if (relY < levelY) {
                            $blockElement = $(this);
                            return false
                        }
                    });
                    const htmlTemporary = `<div id="temporary">${$(evt.target).clone().html()}</div>`
                    if (!$blockElement) {
                        $dropAreaOver.append(htmlTemporary);
                    } else {
                        $blockElement.before(htmlTemporary);
                    }
                    $temporary = $('#temporary')
                }
            }

            $('#layer-list .top-tree').draggable({
                drag: dragFunction,
                revert: 'invalid',
                axis: 'y'
            });
            $dropArea.droppable({
                hoverClass: "ui-state-hovered",
                drop: function (e, ui) {
                    onDropArea($(ui.draggable), $dropArea);
                },
                over: function () {
                    $dropAreaOver = $dropArea;
                },
                out: function () {
                    $dropAreaOver = null;

                    // delete temporary
                    removeTemporary();
                },
            });

            /**
             * Remove temporary level
             */
            function removeTemporary() {
                if ($temporary) {
                    $temporary.remove();
                    $temporary = null;
                }
            }

            /**
             * When the element dropped
             */
            function onDropArea($elm, $dropArea) {
                const id = $elm.attr('id');
                if ($temporary) {
                    $temporary.replaceWith($elm.clone())
                }
                $elm.remove();
                const $newElm = $('#' + id);
                $newElm.css('position', '');
                $newElm.css('top', '');
                $newElm.css('left', '');
                $newElm.css('z-index', '');
                $newElm.removeClass('ui-draggable-dragging');
                $newElm.draggable({
                    drag: dragFunction,
                    revert: 'invalid',
                    axis: 'y'
                });
                parent.initLayerEvent(id);
                $newElm.find('.layer-list-group .layer-row').each(function (index) {
                    parent.initLayerEvent($(this).attr('id'));
                });
                parent.changeOrders();
            }
        },
    })
});