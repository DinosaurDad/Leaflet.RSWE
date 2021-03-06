L.Control.SlideMenu = L.Control.extend({
    options: {
        isOpen: false,
        position: 'topright',
        width: '100%',
        height: '40px',
        delay: '0',
        closeButtonIcon: 'fa-angle-double-up',
        menuButtonIcon: 'fa-angle-double-down'
    },
    contents: [
        '<span class="leaflet-top-menu-spacer">&nbsp;</span>',
        '<a class="leaflet-top-menu-link"><b> Load </b></a>',
        '<a class="leaflet-top-menu-link"><b> Save </b></a>',
        '<a class="leaflet-top-menu-link"><b> SVG </b></a>',
        '<a class="leaflet-top-menu-link"><b> PNG </b></a>',
        '<a class="leaflet-top-menu-link"><b> JPG </b></a>',
        '<a class="leaflet-top-menu-link"><b> Options </b></a>'
    ],

    initialize: function (innerHTML, options) {
        if (options) {
            L.Util.setOptions(this, options);
        }
        if (innerHTML) {
            this._innerHTML = innerHTML;
        } else {
            this._innerHTML = this.contents.join('');
        }

        this._startPosition = 0;

        this._isLeftPosition = ((this.options.position === 'topleft') || (this.options.position === 'buttomleft')) ? true : false;
    },

    onAdd: function (map) {
        this._map = map;
        this._startPosition = -(parseInt(this.options.width, 10));
        if (this.options.width.indexOf('%') + 1) {
            this._startPosition = this._startPosition * (map.getSize().x) * 0.01;
        }

        this._container = L.DomUtil.create('div', 'leaflet-control-slidemenu leaflet-bar leaflet-control');
        this.showlink = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
        this.showlink.title = 'Menu';

        if (this.options.menuButtonIcon.length > 0) {
            L.DomUtil.create('span', 'fa ' + this.options.menuButtonIcon, this.showlink);
        } else {
            L.DomUtil.create('span', 'fa fa-bars', this.showlink);
        }
        this._menu = L.DomUtil.create('div', 'leaflet-menu', document.getElementsByClassName('leaflet-container')[0]);
        this._menu.style.width = this.options.width;
        this._menu.style.height = this.options.height;

        this.closeButton = L.DomUtil.create('span', 'leaflet-menu-close-button fa', this._menu);

        if (this.options.closeButtonIcon.length > 0) {
            this._isLeftPosition = true;
            this._menu.style.left = '-' + this.options.width;
/* jshint ignore:start */
            this.closeButton.style['float'] = 'right';
/* jshint ignore:end */
            L.DomUtil.addClass(this.closeButton, this.options.closeButtonIcon);
        } else {
            if (this._isLeftPosition) {
                this._menu.style.left = '-' + this.options.width;
/* jshint ignore:start */
                this.closeButton.style['float'] = 'right';
/* jshint ignore:end */
                L.DomUtil.addClass(this.closeButton, 'fa-chevron-left');
            }
            else {
/* jshint ignore:start */
                this.closeButton.style['float'] = 'left';
/* jshint ignore:end */
                this._menu.style.right = '-' + this.options.width;
                L.DomUtil.addClass(this.closeButton, 'fa-chevron-right');
            }
        }

        this._contents = L.DomUtil.create('div', 'leaflet-menu-contents', this._menu);
        this._contents.innerHTML = this._innerHTML;
 
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[0], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.loadDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.loadDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.loadDialog.close(); }
        }, this);
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[1], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.saveDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.saveDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.saveDialog.close(); }
        }, this);
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[2], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.saveSVGDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.saveSVGDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.saveSVGDialog.close(); }
        }, this);
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[3], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.savePNGDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.savePNGDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.savePNGDialog.close(); }
        }, this);
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[4], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.saveJPGDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.saveJPGDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.saveJPGDialog.close(); }
        }, this);
        L.DomEvent.addListener(this._contents.getElementsByTagName('A')[5], 'click', function () {
            this.menuClose();
            var isOpen = this._map.RSWEIndoor.options.dialogs.optionsDialog._isOpen;
            this._map.RSWEIndoor.options.dialogs.optionsDialog.open();
            if (isOpen) { this._map.RSWEIndoor.options.dialogs.optionsDialog.close(); }
        }, this);

        L.DomEvent.disableClickPropagation(this._menu);
        L.DomEvent
//            .on(link, 'click', L.DomEvent.stopPropagation)
            .on(this.showlink, 'click', function () {
                // Open
//                e.stopPropagation();
                this.menuOpen();
            }, this)
//            .on(closeButton, 'click', L.DomEvent.stopPropagation)
            .on(this.closeButton, 'click', function () {
                // Close
//                e.stopPropagation();
                this.menuClose();
            }, this);

        if (this.options.isOpen) { this._animate(this._menu, this._startPosition, 0, true); }
        else { this._animate(this._menu, 0, this._startPosition, false); }

        return this._container;
    },
    menuOpen: function () {
        this.showlink.style.display = 'none';
        this.closeButton.style.display = 'block';
        this._animate(this._menu, this._startPosition, 0, true);
    },
    menuClose: function () {
        this.showlink.style.display = 'block';
        this.closeButton.style.display = 'none';
        this._animate(this._menu, 0, this._startPosition, false);
    },

    setContents: function (innerHTML) {
        this._innerHTML = innerHTML;
    },

    _animate: function (menu, from, to, isOpen) {
        this.options.isOpen = isOpen;
        if (!isOpen) {
            this._startPosition = -(parseInt(this.options.width, 10));
            if (this.options.width.indexOf('%') + 1) {
                this._startPosition = this._startPosition * (this._map.getSize().x) * 0.01;
            }
            this._menu.style.width = this.options.width;
            from = 0;
            to = this._startPosition;
        }

        if (this.options.delay > 0) {
            if (isOpen ? from > to : from < to) {
                return;
            }

            if (this._isLeftPosition) {
                menu.style.left = from + 'px';
            } else {
                menu.style.right = from + 'px';
            }

            setTimeout(function (slideMenu) {
                var value = isOpen ? from + 10 : from - 10;
                if (from.indexOf('%') + 1) { value = value + '%'; }

                slideMenu._animate(slideMenu._menu, value, to, isOpen);
            }, this.options.delay, this);
        } else {
            if (this._isLeftPosition) {
                menu.style.left = to + 'px';
            } else {
                menu.style.right = to + 'px';
            }

            if (this._map.getSize().x === -to) {
                if (this._isLeftPosition) {
                    menu.style.left = '-100%';
                } else {
                    menu.style.right = '100%';
                }
            }
        }
    }
});

L.control.slideMenu = function (innerHTML, options) {
    return new L.Control.SlideMenu(innerHTML, options);
};
