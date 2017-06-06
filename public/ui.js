var React = require('react');
var ReactDOM = require('react-dom');
var Scribble = require('./Scribble');
var Demographics = require('./Demographics');
var ErrorPage = require('./errorPage.js');

var App = React.createClass({
	// Application stages are 'scribble', 'startUpError' and 'demographics'.
	getInitialState: function(){
	    return {
		stage: 'scribble',
		serverState: 'waitingForSubmission',
		errorCode: null,
		token: '',
		uiConfig: null,
		width: 400,
		height: 300,
		strokeColourIndex: 0
	    }
	},

	componentDidMount: function(){
	    this.handleRestart();
	},

	resize: function(){
	    if (this.state.uiConfig == null){
		return;
	    }

	    var calcWidth = $(window).width();
	    var calcHeight = $(window).height();
	    var aspectRatio = this.state.uiConfig.aspectRatio;

	    // Preserve image aspect ratio.
	    if (calcWidth/calcHeight > aspectRatio){
		calcWidth = calcHeight * aspectRatio;
	    } else {
		calcHeight = calcWidth / aspectRatio;
	    }

	    this.setState({width: calcWidth, height: calcHeight});
	},

	// Start new server session.
	startNewSession: function(){
	    $.ajax({
		    url: this.props.sessionUrl,
		    dataType: 'json',
		    type: 'POST',
		    success: function(data){
			if (data.success){
			    if (!data.token || !data.uiConfig){
				this.setState({errorCode: "0476", stage: "startUpError"});
			    } else {
				this.setState({token: data.token, uiConfig: data.uiConfig});
				this.resize();
			    }
			} else {
			    this.setState({errorCode: data.errorCode, stage: "startUpError"});
			}
		    }.bind(this),
		    error: function(xhr, status, err){
			this.setState({errorCode: "7558", stage: "startUpError"});
		    }.bind(this)
		});
	},

	// When user has drawn a line segment upload it to the server.
	handleLineSegmentDrawn: function(points, lineIndex, segmentIndex, colourId, isThickBrush){
	    var params = { 
		token: this.state.token,
		lineIndex: lineIndex,
		segmentIndex: segmentIndex,
		colourId: colourId,
		points: points,
		isThickBrush: isThickBrush
	    };

	    $.ajax({
		    url: this.props.saveLineSegmentUrl,
		    dataType: 'json',
		    type: 'POST',
		    data: params,
		    success: function(data){
			if (data.success == true){
			    this.setState({
				serverState: "successfulSubmission"
				    });
			} else {
			    this.setState({
				    serverState: 'failedSubmission',
				    errorCode: data.errorCode
					});
			}

		    }.bind(this),
		    error: function(xhr, status, err){
			console.error("Ajax error\n");
			console.error(this.props.url, status, err.toString());
			this.setState({
				serverState: "failedSubmission",
				errorCode: "1101"
				    });
		    }.bind(this)
		});
	},

	// When user hits the 'finish' button on the scribble screen advance to the demographics screen.
	handleScribbleFinished: function(){
	    this.setState({stage: 'demographics'});
	    this.setState({serverState: 'waitingForSubmission'});
	},

	// When user has hit the submit button on the demographics form,
	// upload the demographics to the server.
	// parameter demographics - object of name/value pairs
	handleDemographicsSubmit: function(demographics){
	    var params = { 
		token: this.state.token,
		demographics: demographics
	    };

	    $.ajax({
		    url: this.props.demographicsUrl,
		    dataType: 'json',
		    type: 'POST',
		    data: params,
		    success: function(data){
			if (data.success == true){
			    this.setState({serverState: 'successfulSubmission'});
			} else {
			    this.setState({
				    serverState: 'failedSubmission',
				    errorCode: data.errorCode
					});
			}
		    }.bind(this),
		    error: function(xhr, status, err){
			console.log("Ajax error\n");
			console.log(this.props.url, status, err.toString());

			this.setState({	serverState: 'failedSubmission', errorCode: "5829" });
		    }.bind(this)
		});
	},

	// Set state for restart.
	handleRestart: function(){
	    this.setState({
		    stage: 'scribble',
		    serverState: 'waitingForSubmission',
		    lines: [],
		    strokeColourIndex: 0
		});

	    this.startNewSession();
	},

	render: function(){
	    if (!this.state.uiConfig && this.state.stage != 'startUpError'){
		return null;
	    }

	    var rootStyle = {
		width: this.state.width,
		height: this.state.height,
		marginTop: 0,
		marginRight: "auto",
		marginBottom: 0,
		marginLeft: "auto"
	    };

	    switch (this.state.stage){
	    case 'startUpError':
	    return(
		  <ErrorPage
		  messageText={"Problem starting up"}
		  errorCode={this.state.errorCode}
		  onNextScreen={this.handleRestart}/>
            );

	    case 'scribble':
	    return(
		   <div style={rootStyle}>
		   <Scribble
		   onLineSegmentDrawn={this.handleLineSegmentDrawn}
		   width={this.state.width}
		   height={this.state.height}
		   uiConfig={this.state.uiConfig}
		   onNextScreen={this.handleScribbleFinished}
		   serverState={this.state.serverState}
		   errorCode={this.state.errorCode}/>
		   </div>
		   );

	    case 'demographics':
	    return(
		   <div style={rootStyle}>
		   <Demographics 
		   onDemographicsSubmit={this.handleDemographicsSubmit} 
		   uiConfig={this.state.uiConfig}
		   onNextScreen={this.handleRestart}
		   serverState={this.state.serverState}
		   errorCode={this.state.errorCode}
		   />
		   </div>
		   );
	    }
	}
    });

ReactDOM.render(
		<App sessionUrl="/api/session" saveLineSegmentUrl="/api/saveLineSegment" demographicsUrl="/api/demographics"/>,
                document.getElementById('content')
                );
