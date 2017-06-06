var React = require('react');
var ReactDOM = require('react-dom');
var d3Scribble = require('./d3Scribble');
var SignatureScribble = require('./signatureScribble');
var DismissableMessage = require('./dismissableMessage');
var ErrorMessage = require('./errorMessage');
var Controls = require('./controls');
var ColourPicker = require('./colourPicker');
var scribble = new SignatureScribble();

// The scribble object contains an entire scribble screen including a canvas for the user to
// scribble into and buttons to select colours, toggle a thick brush and a 'finish' button.
var Scribble = React.createClass({
	getInitialState: function(){
	    return {
		messageEnabled: true,
		thickerBrushEnabled: false,
		colourPickerEnabled: false,
		selectedColourIndex: this.props.uiConfig.selectedColourIndex
	    };
	},

	// Create a new SignatureScribble object at the DOM node.
	componentDidMount: function(){
	    var el = ReactDOM.findDOMNode(this);
	    scribble.create(el, this.props.uiConfig.aspectRatio, this.handleLineSegmentDrawn, this.props.uiConfig.maxPointsPerLineSegment);

	    scribble.setStrokeColour( this.props.uiConfig.colours[ this.state.selectedColourIndex ].rgb );
	    scribble.setPenWidths(this.props.uiConfig.penWidths.thin);
	},

	handleMessageDismissed: function(){
	    this.setState({ messageEnabled: false });
	},

	// When the user finishes drawing a line, pass up the drawn data via props.
	handleLineSegmentDrawn: function(points, lineIndex, segmentIndex){
	    var colourId = this.props.uiConfig.colours[ this.state.selectedColourIndex ].id;
	    this.props.onLineSegmentDrawn(points, lineIndex, segmentIndex, colourId, this.state.thickerBrushEnabled ? 1 : 0);
	},

	handleColourPickerEnable: function(){
	    this.setState({colourPickerEnabled: true});
	    scribble.hide();
	},

	// Pass the selected colour into the SignatureScribble object.
	handleColourSelect: function(colourIndex){
	    this.setState({colourPickerEnabled: false, selectedColourIndex: colourIndex});
	    scribble.show();
	    scribble.setStrokeColour( this.props.uiConfig.colours[colourIndex].rgb );
	},

	// Pass the selected pen width (thick or thin) into the SignatureScribble object.
	handleBrushToggled: function(){
	    this.setState({thickerBrushEnabled: !this.state.thickerBrushEnabled});

	    if (this.state.thickerBrushEnabled){
		scribble.setPenWidths(this.props.uiConfig.penWidths.thick);
	    } else {
		scribble.setPenWidths(this.props.uiConfig.penWidths.thin);
	    }
	},

	handleNextScreen: function(){
	    this.props.onNextScreen();
	},

	render: function(){
	    var scribbleStyle = {
		width: this.props.width,
		height: this.props.height
	    };

	    return (
		    <div className="Scribble" style={scribbleStyle}>

		    <ColourPicker
		    enabled={this.state.colourPickerEnabled}
		    width={this.props.width}
		    height={this.props.height}
		    uiConfig={this.props.uiConfig}
		    onColourSelect={this.handleColourSelect}/>

		    <DismissableMessage
		    enabled={this.state.messageEnabled}
		    messageText={this.props.uiConfig.scribbleMessage}
		    onMessageDismissed={this.handleMessageDismissed}/>

		    <ErrorMessage
		    enabled={this.props.serverState=="failedSubmission"}
		    messageText={"Problem saving scribble"}
		    errorCode={this.props.errorCode}
		    id="bottomLeftError"/>

		    <Controls
		    onColourPickerEnable={this.handleColourPickerEnable}
		    onBrushToggled={this.handleBrushToggled}
		    isBrushToggleOn={this.state.thickerBrushEnabled}
		    onNextScreen={this.handleNextScreen}
		    isNextScreenButtonEnabled={(this.props.serverState=="successfulSubmission")}
		    width={this.props.width}/>

		    </div>
		    );
	}
    });

module.exports = Scribble;