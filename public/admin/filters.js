React = require('react');
var ReactDOM = require('react-dom');
var ErrorMessage = require('../errorMessage');

// This is the UI object containing the form for the user to apply demographics filters.
// Uses SemanticUI (http://semantic-ui.com/).
var Controls = React.createClass({
	getInitialState() {
	    return {
		userId: null,
		heartrateRanges: "",
		ageRanges: "",
		genders: "",
		languages: "",
		startDate: -1,
		endDate: -1,
		areControlsVisible: true,
		isDdlOpen: false
	    };
	},

	// Set up the SemanticUI elements.
	componentDidMount() {
	    var self = this;
	    $(ReactDOM.findDOMNode(this.refs.dateRangeBox)).daterangepicker(
	    {
		"drops": "up",
		    autoUpdateInput: false,
		    locale: {
		    cancelLabel: 'Clear'
			}
		});

	    $(ReactDOM.findDOMNode(this.refs.dateRangeBox)).on('show.daterangepicker', function(ev, picker) {
		    self.setState({ isDdlOpen: true });
		});

	    $(ReactDOM.findDOMNode(this.refs.dateRangeBox)).on('apply.daterangepicker', function(ev, picker) {
		    self.setState({ isDdlOpen: false });
		    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
		    self.setState({
			startDate: picker.startDate.utc().valueOf(),
			endDate: picker.endDate.utc().valueOf()
		    });
		    self.submitFilters();
		});

	    $(ReactDOM.findDOMNode(this.refs.dateRangeBox)).on('cancel.daterangepicker', function(ev, picker) {
		    self.setState({ isDdlOpen: false });
		    self.setState({
			startDate: -1,
			endDate: -1
				});
		    self.submitFilters();
		    $(this).val('');
		});

	    $(ReactDOM.findDOMNode(this.refs.heartrateDropdown)).dropdown({
		    onChange: function(value){
			self.setState({
				heartrateRanges: value
			    });
			self.submitFilters();
		    },
		    onShow: function(value){
			self.setState({ isDdlOpen: true });
		    }
		});
	    $(ReactDOM.findDOMNode(this.refs.ageDropdown)).dropdown({
		    onChange: function(value){
			self.setState({
				ageRanges: value
			    });
			self.submitFilters();
		    },
		    onShow: function(value){
			self.setState({ isDdlOpen: true });
		    }
		});
	    $(ReactDOM.findDOMNode(this.refs.genderDropdown)).dropdown({
		    onChange: function(value){
			self.setState({
				genders: value
			    });
			self.submitFilters();
		    },
		    onShow: function(value){
			self.setState({ isDdlOpen: true });
		    }
		});
	    $(ReactDOM.findDOMNode(this.refs.languageDropdown)).dropdown({
		    onChange: function(value){
			self.setState({
				languages: value
			    });
			self.submitFilters();
		    },
		    onShow: function(value){
			self.setState({ isDdlOpen: true });
		    }
		});
	},

	componentDidUpdate() {
	    $(ReactDOM.findDOMNode(this.refs.heartrateDropdown)).dropdown('refresh');
	    $(ReactDOM.findDOMNode(this.refs.ageDropdown)).dropdown('refresh');
	    $(ReactDOM.findDOMNode(this.refs.genderDropdown)).dropdown('refresh');
	    $(ReactDOM.findDOMNode(this.refs.languageDropdown)).dropdown('refresh');
	},
	
	handleBackgroundClick: function(){
	    // If a dropdown is open, first tap closes the dropdown
	    // second tap hides the controls.
	    if (!this.state.isDdlOpen){
		this.setState({ areControlsVisible: !this.state.areControlsVisible });
	    } else {
		this.setState({ isDdlOpen: false });
	    }
	},

        submitFilters: function(){
            var filters = {
                heartrateRanges: this.state.heartrateRanges,
		ageRanges: this.state.ageRanges,
		genders: this.state.genders,
		languages: this.state.languages,
		startDate: this.state.startDate,
		endDate: this.state.endDate
            };
	    
            this.props.onFiltersSubmit(filters);
        },

	getItemsMarkup: function(configItem){
	    var items = this.props.uiConfig[configItem];
	    var markup = [];

	    for (var i=0; i<items.length; ++i){
		markup.push(<div className="item" key={i}>{items[i]}</div>);
	    }

	    return markup;
	},

	getFiltersMarkup: function() {
	    var headerStyle = {
		width: this.props.width,
		position: "absolute",
		marginTop: 0   // Without this the padding of the dropdowns won't take effect.
	    };

	    if (!this.state.areControlsVisible){
		headerStyle.display = "none";
	    }

	    var dropDownStyle = {
		paddingBottom: 0
	    };

		return(
		    <div className="ui grid" style={headerStyle}>
		    <div className="eight wide column" style={dropDownStyle}>
		    <div className="ui fluid multiple search selection dropdown labeled search icon button" ref="heartrateDropdown">
		    <i className="heartbeat icon"></i>
                      <div className="default text">Heart rate</div>
                      <div className="menu">
			{ this.getItemsMarkup("heartRateRanges") }
                      </div>
		    </div>
		    </div>
		    <div className="eight wide column" style={dropDownStyle}>
		    <div className="ui fluid multiple search selection dropdown labeled search icon button" ref="ageDropdown">
		    <i className="calendar outline icon"></i>
                      <div className="default text">Age</div>
                      <div className="menu">
			{ this.getItemsMarkup("ageRanges") }
                      </div>
		    </div>		    
		    </div>
		    <div className="eight wide column" style={dropDownStyle}>
		    <div className="ui fluid multiple search selection dropdown labeled search icon button" ref="genderDropdown">
		    <i className="female icon"></i>
                      <div className="default text">Gender</div>
                      <div className="menu">
			{ this.getItemsMarkup("genders") }
                      </div>
		    </div>		    
		    </div>
		    <div className="eight wide column" style={dropDownStyle}>
		    <div className="ui fluid multiple search selection dropdown labeled search icon button" ref="languageDropdown">
		    <i className="world icon"></i>
                      <div className="default text">Language</div>
                      <div className="menu">
			{ this.getItemsMarkup("languages") }
                      </div>
		    </div>
		    </div>
		    <div className="sixteen wide column">
		    <ErrorMessage
		    enabled={this.props.serverState=="failedSubmission"}
		    messageText={"Problem getting scribbles"}
		    errorCode={this.props.errorCode}
                       />
		    </div>
		    </div>
		    );
	},

	getBottomControlsMarkup: function(){
	    var footerStyle = {
		width: this.props.width,
		position: "absolute",
		bottom: "1em"
	    };

	    if (!this.state.areControlsVisible){
		footerStyle.display = "none";
	    }

	return (
		<div>
		    <div className="ui equal width grid" style={footerStyle}>
		    <div className="sixteen wide column">
		    <input type="text" name="daterange" ref="dateRangeBox"/>
		    </div>
		    <div className="fourteen wide column">
		    <div className="ui segment">
		    <p>Draw how you feel joy in your body</p>
		    </div>
		    </div>
		    <div className="column">
		    <div className="segment">
		    <button className="ui disabled huge right floated icon button" ref="downloadButton">
		    <i className="cloud download icon"></i>
		    </button>
		    </div>
		    </div>
		    </div>
		</div>
			);
	},

	render: function() {
	    var rootStyle = {
		width: this.props.width,
		height: this.props.height,
		position: "absolute",
		zIndex: 2
	    };

	    var backgroundStyle = {
		width: this.props.width,
		height: this.props.height,
		position: "absolute",
		zIndex: 0
	    };

	    return (
		    <div style={rootStyle}>

		        <div style={backgroundStyle} onClick={this.handleBackgroundClick}/>

			{ this.getFiltersMarkup() }
			{ this.getBottomControlsMarkup() }
		    
		    </div>
		    );
	}
    });

module.exports = Controls;