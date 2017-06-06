var SignaturePad = require('signature_pad');

var Point = function (x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || new Date().getTime();
};

Point.prototype.velocityFrom = function (start) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
};

Point.prototype.distanceTo = function (start) {
    return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
};

// signatureScribble is a wrapper for signature_pad (https://github.com/szimek/signature_pad)
// that creates a more generic interface for drawing scribbles and adds the functionality
// to draw scribbles from data rather than from input.
var signatureScribble = function(){
    this._onSegmentDrawn = null;
    this._numLines = 0;
    this._numSegments = 0;
    this._points = [];
    this._aspectRatio = 1;
    this._signaturePad = null;
    this._isInteractive = true;
};

// Set up the signatureScribble object and create its signature_pad member in the DOM.
signatureScribble.prototype.create = function(htmlElement, aspectRatio, onSegmentDrawn, maxPointsPerLineSegment) {
    var self = this;

    this._onSegmentDrawn = onSegmentDrawn;
    this._aspectRatio = aspectRatio;

    var scribbleArea = this._createScribbleArea(htmlElement);
    this._signaturePad = scribbleArea;

    // Override.
    // Handle non interactivity for display only scribble pads.
    scribbleArea._strokeBegin = function(event){
	if (self._isInteractive){
	    self.startSegment();

	    SignaturePad.prototype._strokeBegin.call(this, event);
	}
    };

    // Override.
    // We want to break the line into segments after a preset number of points 
    // have been drawn and already push each segment to the server to 
    // decrease transfer load.
    scribbleArea._strokeUpdate = function(event){
	if (self._isInteractive){
	    var point = SignaturePad.prototype._createPoint.call(this, event);
	    SignaturePad.prototype._addPoint.call(this, point);
	
	    self.addPoint(point.x, point.y, point.time);

	    if (self._points.length >= maxPointsPerLineSegment){
		self.finishSegment();
		self.startSegment();
	    }
	}
    };

    // Override.
    // Handle non-interactivity for display only scribble pads.
    scribbleArea._strokeEnd = function(event){
	if (self._isInteractive){
	    SignaturePad.prototype._strokeEnd.call(this, event);

	    self.finishLine();
	}
    }

    this.handleResize();
};

signatureScribble.prototype.hide = function() {
    $("#signature-pad").hide();
};

signatureScribble.prototype.show = function() {
    $("#signature-pad").show();
};

signatureScribble.prototype.setStrokeColour = function(rgbArray) {
    var colourString = 'rgb(' + rgbArray[0] + ', ' + rgbArray[1] + ', ' + rgbArray[2] + ')';
    this._signaturePad.penColor = colourString;
};

signatureScribble.prototype.setPenWidths = function(widths){
    this._signaturePad.minWidth = widths.minWidth;
    this._signaturePad.maxWidth = widths.maxWidth;
};

// Toggle whether signatureScribble is interactive or just used for displaying previously drawn scribbles.
signatureScribble.prototype.setInteractive = function(isInteractive) {
    this._isInteractive = isInteractive;
};

signatureScribble.prototype.clear = function() {
    this._signaturePad.clear();
};

// Draw a line from the given points (not from user input).
signatureScribble.prototype.drawLine = function(points) {
    var pad = this._signaturePad;

    pad._reset();
    
    for (var j=0; j<points.length; ++j){
	var point = new Point(Number(points[j].x), Number(points[j].y), Number(points[j].time));
	pad._addPoint(point);
    }

    var canDrawCurve = points.length > 2,
    point = points[0];

    if (!canDrawCurve && point) {
	pad._strokeDraw(point);
    }
};

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
signatureScribble.prototype.handleResize = function(event) {
    var canvas = $("#signature-pad")[0];

    if (!canvas){
	return;
    }

    var calcWidth = $(window).width();
    var calcHeight = $(window).height();
    var aspectRatio = this._aspectRatio;

    // Preserve image aspect ratio.
    if (calcWidth/calcHeight > aspectRatio){
	calcWidth = calcHeight * aspectRatio;
    } else {
	calcHeight = calcWidth / aspectRatio;
    }

    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.

    var ratio =  Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = calcWidth * ratio;
    canvas.height = calcHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

signatureScribble.prototype.startSegment = function(){
    this._points = [];
};

signatureScribble.prototype.addPoint = function(x, y, time){
    var point = {
	time: time,
	x: x,
	y: y
    };
    this._points.push(point);
};

// As called by _strokeUpdate.
signatureScribble.prototype.finishSegment = function(){
    if (this._onSegmentDrawn && this._points.length > 0){
	this._onSegmentDrawn(this._points, this._numLines, this._numSegments);
    }
    this._numSegments++;
};

// As called by _strokeEnd.
signatureScribble.prototype.finishLine = function(){
    if (this._onSegmentDrawn && this._points.length > 0){
	this._onSegmentDrawn(this._points, this._numLines, this._numSegments);
    }
    this._numLines++;
    this._numSegments = 0;
};

// Create signature_pad in the DOM.
signatureScribble.prototype._createScribbleArea = function(htmlElement){
    var self = this;

    var rootElement = $(htmlElement);
    rootElement.prepend('<img id="bodyImage" src="Figure_ink_A4.png"/>'
			+ '<canvas id="signature-pad" class="signature-pad"></canvas>');

    var scribbleArea = new SignaturePad(document.getElementById('signature-pad'), {
	backgroundColor: 'rgba(255, 255, 255, 0)',
	penColor: 'rgb(0, 0, 0)'
    });

    return scribbleArea;
};

module.exports = signatureScribble;
