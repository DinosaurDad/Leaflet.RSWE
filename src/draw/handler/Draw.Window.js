L.Draw.Window = L.Draw.Polyline.extend({
	statics: {
		TYPE: 'window'
	},

	Poly: L.Polyline,

	options: {
		allowIntersection: true,
		repeatMode: false,
		drawError: {
			color: '#bbbbb',
			timeout: 2500
		},
		icon: new L.DivIcon({
			iconSize: new L.Point(16, 16),
			className: 'leaflet-div-icon leaflet-editing-icon'
		}),
		guidelineDistance: 20,
		maxGuideLineLength: 4000,
		shapeOptions: {
			stroke: true,
			color: '#bbbbbb',
			weight: 4,
			opacity: 0.5,
			fill: false,
			clickable: true
		},
		metric: true, // Whether to use the metric meaurement system or imperial
		showLength: true, // Whether to display distance in the tooltip
		zIndexOffset: 2000, // This should be > than the highest z-index any map layers
		toolbarIcon: {
			className: 'leaflet-draw-draw-polyline',
			tooltip: L.drawLocal.draw.toolbar.buttons.polyline
		}
	},

	initialize: function (map, options) {
		L.Draw.Polyline.prototype.initialize.call(this, map, options);
		this.type = 'window';

	},

	_updateFinishHandler: function () {
		var markerCount = this._markers.length;
		// The last marker should have a click handler to close the polyline
		// Remove the old marker click handler (as only the last point should close the polyline)
		if (markerCount > 1) {
			L.DomEvent.addListener(this._markers[markerCount - 1]._icon, 'mouseup', this._onMarkerMouseUp, this);
			L.DomEvent.addListener(this._markers[markerCount - 1]._icon, 'touchend', this._onMarkerMouseUp, this);
//allow only two-points lines
			this._finishShape();
		}
	}
});