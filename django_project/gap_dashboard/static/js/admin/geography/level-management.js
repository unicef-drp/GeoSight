jQuery.fn.outerHTML = function () {
    return jQuery('<div />').append(this.eq(0).clone()).html();
};
$(document).ready(function () {
    const $dropLevelArea = $('#content-view .section');
    let $temporary = null;
    let $dropAreaOver = null;
    let draggedId = null;

    function dragFunction(evt) {
        $(evt.target).css('z-index', 9999);
        $(evt.target).css('height', 0);
        draggedId = $(evt.target).attr('id');

    }

    $('.level-block').draggable({
        cursorAt: { left: -10, top: -10 },
        drag: dragFunction
    });
    $dropLevelArea.droppable({
        hoverClass: "ui-state-hovered",
        drop: function (e, ui) {
            onDropArea($(ui.draggable));
        },
        over: function () {
            $dropAreaOver = $dropLevelArea;
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
    function onDropArea($elm) {
        const id = $elm.data('id');
        const htmlNewElement = `<div id="level-${id}" class="level-block level-block-value" data-id="${id}">${$elm.html()}</div>`;
        if ($temporary && $temporary.length > 0) {
            $temporary.replaceWith(htmlNewElement);
            $elm.remove();
            dragInit(id);
        } else {
            $('#level-list > .row').append(htmlNewElement);
            $elm.remove();
            dragInit(id);
        }
        $dropAreaOver = null;

        // prepare data
        saveData();
    }

    function saveData() {
        const data = getData(
            $($('#level-0').children('.row')[0])
        );
        $('#level-input').val(JSON.stringify(data))
    }

    function getData($element) {
        const data = {}
        $($element.children('.level-block-value').each(function () {
            data[$(this).data('id')] = getData(
                $($(this).children('.row')[0])
            )
        }))
        return data;
    }

    // init instance level
    renderLevelTree(0, instanceLevelTree);

    function dragInit(id) {
        // make draggable
        const $newElmt = $(`#level-${id}`);
        $newElmt.draggable({
            cursorAt: { left: -10, top: -10 },
            drag: dragFunction
        });
        $newElmt.find('.level-block-content').hover(onHover)

        // make draggable for child
        $newElmt.find('.level-block-value').draggable({
            cursorAt: { left: -10, top: -10 },
            drag: dragFunction
        });
        $newElmt.find('.level-block-content').hover(onHover)

    }

    function renderLevelTree(parent, levels) {
        $.each(levels, function (id, level) {
            const $element = $(`#level-${id}`);
            const $target = $(`#level-${parent} > .row`);
            $element.remove()
            $target.append($element.outerHTML());
            if (level) {
                renderLevelTree(id, level);
            }
            dragInit(id);
        });
        $('#level-drop-area .level-block-content').hover(onHover);
        saveData();
    }

    function onHover() {
        const $wrapper = $(this).closest('.level-block-value');
        const $blockElement = $wrapper.find('.row').first();
        removeTemporary();
        if ($dropLevelArea.attr('class').indexOf('ui-droppable-active') < 0) {
            return false;
        }
        const htmlTemporary = `<div id="level-temporary" class="col level-block"><div class="level-block-content">Temporary</div></div>`
        $blockElement.append(htmlTemporary)
        $temporary = $('#level-temporary');
        if ($temporary.parents(`#${draggedId}`).length > 0) {
            removeTemporary();
        }
        return false
    }

});