$(document).ready(function () {

    // ---------------------------
    // ORDERS
    // ---------------------------
    const $dropArea = $('#drop-area');

    function updateDone() {
        // const orders = [];
        // $dropArea.find('.block-value').each(function () {
        //     orders.push($(this).data('id'));
        // });
        // $('#order-input').val(orders.join(','));

        const orders = {};
        $('.group-row').each(function () {
            const group = $(this).data('group');
            orders[group] = []
            $(this).find('.block-value').each(function () {
                orders[group].push($(this).data('id'));
            });
            checkShowHideGroup($(this));
        })
        $('#order-input').val(JSON.stringify(orders));
    }

    function checkIndicatorList() {
        // check every group, if empty show No Indicator
        $('.group-row').each(function () {
            if ($(this).find('.block-value').not('.ui-sortable-helper').length === 0) {
                $(this).find('.no-value').remove();
                $(this).find('ul').append(
                    '<li class="block no-value"><i>No indicator</i></li>'
                )
            } else {
                $(this).find('.no-value').remove();
            }
        })
    }

    // for group list
    const $groupList = $("#group-list");
    $groupList.sortable({
        update: updateDone
    });
    $groupList.sortable('disable');

    // for the indicator list
    const $indicatorList = $(".indicator-list");
    $indicatorList.sortable({
        connectWith: '.indicator-list',
        update: updateDone,
        sort: checkIndicatorList
    });
    $indicatorList.sortable('disable');


    $('#cancel-order').click(function () {
        $dropArea.removeClass('ordering');
        $groupList.sortable('disable');
        $indicatorList.sortable('disable');
        return false;
    });
    $('#change-order').click(function () {
        $dropArea.addClass('ordering');
        $groupList.sortable('enable');
        $indicatorList.sortable('enable');
    });

    checkIndicatorList();
    updateDone();

    // ---------------------------
    // SHOW/HIDE
    // ---------------------------
    function checkShowHideGroup($element) {
        if ($element.find('.indicator-name .fa-eye:visible').length === 0) {
            $element.addClass('hidden');
        } else {
            $element.removeClass('hidden');
        }
    }

    $('.indicator-name .fa-eye, .indicator-name .fa-eye-slash').click(function () {
        if ($(this).hasClass('fa-eye')) {
            $(this).closest('li').addClass('hidden');
        } else {
            $(this).closest('li').removeClass('hidden');
        }
        $.ajax({
            url: $(this).data('url'),
            type: 'PATCH',
            success: function (data, textStatus, request) {
            },
            error: function (error, textStatus, request) {
            },
            beforeSend: beforeAjaxSend
        });
        checkShowHideGroup($(this).closest('.group-row'));
    });

    // if group is clicked
    $('.group-name .fa-eye').click(function () {
        $(this).closest('li').find('.indicator-name .fa-eye').click();
    });
    $('.group-name .fa-eye-slash').click(function () {
        $(this).closest('li').find('.indicator-name .fa-eye-slash').click();
    });

    // init check group
    $('.group-row').each(function () {
        checkShowHideGroup($(this));
    })

    // ---------------------------
    // MULTI EDIT
    // ---------------------------

    $('#cancel-multi-edit').click(function () {
        $dropArea.removeClass('multi-edit');
        return false;
    });
    $('#multi-edit').click(function () {
        $dropArea.addClass('multi-edit');
        $('.checkbox-indicator input').prop('checked', false);
    });
    // if checkbox checked in individual
    $('.indicator-name .checkbox-indicator input').click(function () {
        const $group = $(this).closest('.group-row');
        $group.find('.group-name .checkbox-indicator input').prop(
            'checked',
            $group.find('.indicator-name .checkbox-indicator input:checked').length === $group.find('.indicator-name .checkbox-indicator input').length
        );
        if ($('.indicator-name .checkbox-indicator input:checked').length !== 0) {
            $('#to-multi-edit').prop("disabled", false);
        } else {
            $('#to-multi-edit').prop("disabled", true);
        }
    });
    // if checkbox checked in group name
    $('.group-name .checkbox-indicator input').click(function () {
        const $group = $(this).closest('.group-row');
        $group.find('.indicator-name .checkbox-indicator input').prop(
            'checked',
            $(this).is(':checked')
        );
        if ($('.indicator-name .checkbox-indicator input:checked').length !== 0) {
            $('#to-multi-edit').prop("disabled", false);
        } else {
            $('#to-multi-edit').prop("disabled", true);
        }
    })
    $('#to-multi-edit').click(function () {
        if ($('.indicator-name .checkbox-indicator input:checked').length !== 0) {
            const ids = [];
            $('.indicator-name .checkbox-indicator input:checked').each(function () {
                ids.push($(this).closest('.block-value').data('id'));
            })
            window.location.href = $(this).data('url') + '?ids=' + ids.join(',');
        }
    })
});