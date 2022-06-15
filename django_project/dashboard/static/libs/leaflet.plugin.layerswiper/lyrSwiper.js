L.Control.layerSwiper = L.Control.extend({
    options: {
        id: "layerSwiper",
        title: 'Image swiper',
        position: 'topright',
        orientation: 'h',
        ratio: 0.5,
        swipeLyrConf: null
    },

    initialize: function (options) {
        L.setOptions(this, options);
        this._swipeLyrConf = this.options.swipeLyrConf || null;
        this._swipeOrinConf = ['h', 'v'];
        this._ratio = this.options.ratio;
    },

    onAdd: function (map) {
        this._initCtrl();
        return this._container;
    },

    onRemove: function () {
        $('#lyrSwipeBar').remove();
    },

    _getPosition: function () {
        if (this.options.orientation.toLowerCase() === 'h') {
            return $('#lyrSwipeBar').css('top');

        } else {
            return $('#lyrSwipeBar').css('left');
        }
    },
    _setPosition: function (position) {
        if (this.options.orientation.toLowerCase() === 'h') {
            $('#lyrSwipeBar').css('top', position);
            this._swipeLyrH($('#lyrSwipeBar')[0], this._swipeLyrConf)

        } else {
            $('#lyrSwipeBar').css('left', position);
            this._swipeLyrV($('#lyrSwipeBar')[0], this._swipeLyrConf)
        }
    },

    _initCtrl: function () {
        var className = 'leaflet-control-lyrSwiper';
        this._container = L.DomUtil.create('div', className);
        L.DomEvent.disableClickPropagation(this._container);
        this._sliderLink = L.DomUtil.create('a', className + '-toggle', this._container);
        this._sliderLink.setAttribute("title", this.options.title);
        L.DomEvent.on(this._sliderLink, 'click', this._toggleCtrl, this);
        this._lyrSwipeBarContainer = L.DomUtil.create('div', '', map.getContainer());
        var lyrSwipeBarContainer = this._lyrSwipeBarContainer;
        L.DomEvent.disableClickPropagation(lyrSwipeBarContainer);
        lyrSwipeBarContainer.setAttribute('id', 'lyrSwipeBar');
        this._lyrSwipeBar = L.DomUtil.create('div', 'bar', lyrSwipeBarContainer);
        const handle = L.DomUtil.create('div', 'handle', this._lyrSwipeBar);
        $('.bar .handle').html('<i class="fa fa-align-justify" aria-hidden="true"></i>')


        var swipeLyrFunc;
        if (this.options.orientation.toLowerCase() != 'n') {
            if (this.options.orientation.toLowerCase() == 'h') {
                this._swipeOrin = 'h';
                swipeLyrFunc = this._swipeLyrH;
                var nw = map.containerPointToLayerPoint([0, 0]);
                var se = map.containerPointToLayerPoint(map.getSize());
                var clipY = nw.y + (se.y - nw.y) * this._ratio;
                var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
                this._swipeLyrConf.base.clip = clipStyle;
            } else if (this.options.orientation.toLowerCase() == 'v') {
                this._swipeOrin = 'v';
                swipeLyrFunc = this._swipeLyrV;
                var nw = map.containerPointToLayerPoint([0, 0]);
                var se = map.containerPointToLayerPoint(map.getSize());
                var clipX = nw.x + (se.x - nw.x) * this._ratio;
                var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
                this._swipeLyrConf.base.clip = clipStyle;
            }
            var swipeLyrConf = this._swipeLyrConf;
            $('#lyrSwipeBar').draggable({
                containment: map.getContainer(),
                drag: function () {
                    swipeLyrFunc.call(this, this, swipeLyrConf);
                },
                stop: function () {
                    swipeLyrFunc.call(this, this, swipeLyrConf);
                }
            }).css('-ms-touch-action', 'none');
            lyrSwipeBarContainer.addEventListener('mouseover', function () {
                map.dragging.disable();
                this.style.opacity = 0.9;
            });
            lyrSwipeBarContainer.addEventListener('mouseout', function () {
                map.dragging.enable();
                this.style.opacity = 1.0;
            });
            map.on('move', function () {
                swipeLyrFunc.call(this, lyrSwipeBarContainer, swipeLyrConf);
            });
            if (this._swipeOrin == 'v') {
                lyrSwipeBarContainer.style.left = this._swipeLyrConf.base.clip.split(',')[1];
            } else if (this._swipeOrin == 'h') {
                lyrSwipeBarContainer.style.top = this._swipeLyrConf.base.clip.split(',')[2];
            }
            swipeLyrFunc(lyrSwipeBarContainer, swipeLyrConf);
        } else {
            this._swipeOrin = 'n';
        }
        this._sliderLink.innerHTML = this._swipeOrin;
        this._sliderLink.innerHTML = '<i class="fa fa-map-o" aria-hidden="true"></i>';
        this._classPrefix = 'leaflet-control-lyrSwipeBarContainer';
        L.DomUtil.addClass(lyrSwipeBarContainer, this._classPrefix + '-' + this._swipeOrin);
    },

    _toggleCtrl: function () {
    },

    _swipeLyrH: function (swipeBar, swipeLyrConf) {
        try {
            $(swipeBar).draggable("option", "axis", "y");
            var $topPane = swipeLyrConf.base.$pane;
            var $botPane = swipeLyrConf.compare.$pane;
            var nw = map.containerPointToLayerPoint([0, 0]);
            var se = map.containerPointToLayerPoint(map.getSize());
            var swipeBarY = Number(swipeBar.style.top.substring(0, swipeBar.style.top.lastIndexOf('px')));
            var clipY = nw.y + swipeBarY;

            // top layer
            var topStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
            $topPane.attr('style', 'display: block;' + topStyle);
            swipeLyrConf.base.clip = topStyle;

            var botStyle = 'clip:rect(' + [clipY, se.x, se.y, nw.x].join('px,') + 'px)';
            $botPane.attr('style', 'display: block;' + botStyle);
            swipeLyrConf.compare.clip = botStyle;
        } catch (e) {

        }
    },

    _swipeLyrV: function (swipeBar, swipeLyrConf) {
        try {
            $(swipeBar).draggable("option", "axis", "x");
            var $leftPane = swipeLyrConf.base.$pane;
            var $rightPane = swipeLyrConf.compare.$pane;
            var nw = map.containerPointToLayerPoint([0, 0]);
            var se = map.containerPointToLayerPoint(map.getSize());
            var swipeBarX = Number(swipeBar.style.left.substring(0, swipeBar.style.left.lastIndexOf('px')));
            var clipX = nw.x + swipeBarX;

            // left layer
            var clipLeft = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
            $leftPane.attr('style', 'display: block;' + clipLeft);
            swipeLyrConf.base.clip = clipLeft;

            // right layer
            var clipRight = 'clip:rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
            $rightPane.attr('style', 'display: block;' + clipRight);
            swipeLyrConf.compare.clip = clipRight;
        } catch (e) {

        }
    },
});
L.control.layerSwiper = function (f, options) {
    return new L.Control.layerSwiper(f, options);
};