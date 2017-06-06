var React = require('react');
var ReactDOM = require('react-dom');

// These are the controls for scribbles.js. Namely to open the colour picker, toggle the brush thickness
// and finish the scribble.
var Controls = React.createClass({
	componentDidMount: function(){
	    var self = this;

	    $('.menu .colourPicker').on('click', function(){
                    self.props.onColourPickerEnable();
		});

	    $('.menu .brushSelector').on('click', function(){
                    self.props.onBrushToggled();
		});

	    $('.menu .nextScreen').on('click', function(){
		    if (self.props.isNextScreenButtonEnabled){
			self.props.onNextScreen();
		    }
		});
	},

	render: function(){
	    return (
                    <div className="ui vertical icon menu" id="controls">
                      <a className="item colourPicker">
		        <i className="theme icon"></i>
                      </a>
		      <a className={ this.props.isBrushToggleOn ? "item active blue brushSelector" : "item brushSelector" }>
			<i className="paint brush icon"></i>
		      </a>
		      <a className={ this.props.isNextScreenButtonEnabled ? "item nextScreen" : "item disabled nextScreen"}>
		        <i className={ this.props.isNextScreenButtonEnabled ? "circle arrow right icon" : "disabled circle arrow right icon"}></i>
                      </a>
                    </div>
		    );
	}
    });

module.exports = Controls;