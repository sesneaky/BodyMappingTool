var React = require('react');
var ReactDOM = require('react-dom');
var ErrorPage = require('../errorPage.js');
var Filters = require('./filters.js');
var Scribble = require('./scribble.js');

var emptyFilters = {
    ageRanges: "",
    genders: "", 
    heartrateRanges: "", 
    languages: "",
    startDate: -1,
    endDate: -1
};

// This is the root UI object for the admin app.
// It contains the Filters object and the Scribble object.
// When the user applies demographics filters with the Scribble object
// the Scribble object gets updated with corresponding scribbles from the server.
var App = React.createClass({
        getInitialState: function(){
            return {
		stage: 'admin',
                token: '',
                uiConfig: null,
		width: 200,
		height: 300,
		serverState: 'waitingForSubmission',
		errorCode: null,
                lines: [],
                strokeColourIndex: 0,
                value: null
            }
	},

        componentDidMount: function(){
            this.handleRestart();
	},

        handleRestart: function(){
            this.setState({
                    lines: [],
                    strokeColourIndex: 0
                });

            this.startNewSession();
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
				this.setState({errorCode: "6676", stage: "startUpError"});
			    } else {
				this.setState({token: data.token, uiConfig: data.uiConfig});
				this.resize();
			    }
                        } else {
                            this.setState({errorCode: data.errorCode, stage: "startUpError"});
                        }
                    }.bind(this),
                    error: function(xhr, status, err){
                        this.setState({errorCode: "8921", stage: "startUpError"});
                    }.bind(this)
		});
	},

	// When the user has chosen to submit demographics filters, pass them up to the server.
	handleFiltersSubmit: function(filters){
	    var params = {
		filters: filters
	    };

            $.ajax({
                    url: this.props.loadScribblesUrl,
                    dataType: 'json',
                    type: 'POST',
		    data: params,
                    success: function(data){
			if (data.success){
			    if (!data.lines){
				this.setState({ errorCode: "4465", stage: "startUpError" });
			    } else {
				// If server responds successfully we have new lines to display on the Scribble object.
				this.setState({	serverState: "successfulSubmission", lines: data.lines });
			    }
			} else {
			    this.setState({ serverState: "failedSubmission", errorCode: data.errorCode });
			}
                    }.bind(this),
		    error: function(xhr, status, err){
				this.setState({	serverState: 'failedSubmission', errorCode: '8845' });
                        console.error("Ajax error\n");
                        console.error(this.props.url, status, err.toString());
                    }.bind(this)
                });
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

            case 'admin':
		return(
		       <div style={rootStyle}>

		       <Filters
		       uiConfig={this.state.uiConfig}
		       onFiltersSubmit={this.handleFiltersSubmit}
		       width={this.state.width}
		       height={this.state.height}
		       serverState={this.state.serverState}
		       errorCode={this.state.errorCode}/>

		       <Scribble
		       lines={this.state.lines}
		       width={this.state.width}
		       height={this.state.height}
		       uiConfig={this.state.uiConfig}
		       />

		       </div>
		       );
	    }
	}
    });

ReactDOM.render(
		<App sessionUrl="/api/session" loadScribblesUrl="/api/loadScribbles"/>,
                document.getElementById('content')
                );

