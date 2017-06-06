var React = require('react');
var ReactDOM = require('react-dom');
var SignatureScribble = require('../signatureScribble');
var scribble = new SignatureScribble();

// This is the Scribble object for the admin app.
var Scribble = React.createClass({
	getColourIndex: function(colourId){
	    var colours = this.props.uiConfig.colours;

	    for (var i=0; i<colours.length; ++i){
		if (colours[i].id == colourId){
		    return i;
		}
	    }

	    return -1;
	},

	componentDidMount: function(){
	    var el = ReactDOM.findDOMNode(this);
	    scribble.create(el, this.props.uiConfig.aspectRatio, null);
	    scribble.setStrokeColour( this.props.uiConfig.colours[ 0 ].rgb );
	    scribble.setInteractive(false);
	},

	componentWillReceiveProps: function(nextProps){
	    if (nextProps.lines){
		scribble.clear();

		for (var i=0; i<nextProps.lines.length; ++i){
		    var line = nextProps.lines[i];
		    var colourIndex = this.getColourIndex(line.colourId);
		    scribble.setStrokeColour( this.props.uiConfig.colours[colourIndex].rgb );

		    if (line.isThickBrush == 1){
			scribble.setPenWidths(this.props.uiConfig.penWidths.thick);
		    } else {
			scribble.setPenWidths(this.props.uiConfig.penWidths.thin);
		    }

		    scribble.drawLine(line.points);
		}
	    }
	},

	render: function(){
	    var scribbleStyle = {
		width: this.props.width,
		height: this.props.height
	    };

	    return (
		    <div className="Scribble" style={scribbleStyle}>
		    </div>
		    );
	}
    });

module.exports = Scribble