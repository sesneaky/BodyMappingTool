var React = require('react');
var ReactDOM = require('react-dom');

// This is a colour picker UI element. When a colour is chosen it passes it up via props.
var ColourPicker = React.createClass({
	handlePaletteClick: function(event){
	    this.props.onColourSelect(event.target.dataset.colourindex);
	},

	render: function(){
	    if (!this.props.enabled){
		return null;
	    }

	    var rows = this.props.uiConfig.colourRows, cols = this.props.uiConfig.colourCols;
 
	    var swatchWidth = this.props.width / cols;
	    var swatchHeight = this.props.height / rows;

	    var swatches = [];

	    for (var j=0; j<rows; ++j){
		for (var i=0; i<cols; ++i){
		    var arrayIndex = j + i*rows;
		    var colour = this.props.uiConfig.colours[arrayIndex];

		    var swatchStyle = {
			background: 'rgb(' + colour.rgb[0] + ', ' + colour.rgb[1] + ', ' + colour.rgb[2] + ')',
			float: 'left',
			width: swatchWidth,
			height: swatchHeight
		    };

		    swatches.push(<div data-colourIndex={arrayIndex} key={colour.id} style={swatchStyle} onClick={this.handlePaletteClick}></div>);
		}
	    }

	    return (
		   <div id="colourPicker">
		       {swatches}
		   </div>
		   );
	}
    });

module.exports = ColourPicker;