var React = require('react');
var ReactDOM = require('react-dom');
var ErrorMessage = require('./errorMessage');

var ErrorPage = React.createClass({
	componentDidMount: function(){
	    var self = this;

            $('.menu .nextScreen').on('click', function(){
                    self.props.onNextScreen();
                });
	},

        render: function(){
	    var rootStyle = {
		width: "80%",
		margin: "1em auto 0 auto"
	    };
	    
            return (
		    <div className="ui segment" style={rootStyle}>
		    <div className="ui equal width grid">
		    <div className="thirteen wide column">
		    <div className="ui negative message">
		    <div className="header">
			{this.props.messageText}
			{this.props.errorCode ? " : " + this.props.errorCode : null}
		    </div>
		    </div>
		    </div>
		    <div className="column">
		    <div className="segment">
		    <div className="ui compact icon menu">
		    <a className="item nextScreen">
		    <i className="circle arrow right icon"></i>
		    </a>
		    </div>
		    </div>
		    </div>
		    </div>
		    </div>
		    );
        }
    });

module.exports = ErrorPage;