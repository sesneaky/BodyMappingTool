var React = require('react');
var ReactDOM = require('react-dom');

var ErrorMessage = React.createClass({
	render: function(){
	    if (!this.props.enabled){
		return null;
	    }

	    return (
		    <div className="ui negative message" id={this.props.id}>
                      <div className="header">
		        {this.props.messageText}
			{ (this.props.errorCode ? ": " + this.props.errorCode : "") }
                      </div>
                    </div>
		    );
	}
    });

module.exports = ErrorMessage;