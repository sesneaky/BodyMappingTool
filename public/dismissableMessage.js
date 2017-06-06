var React = require('react');
var ReactDOM = require('react-dom');

var DismissableMessage = React.createClass({
	componentDidMount: function(){
	    var self = this;

	    $('.message .close')
            .on('click', function() {
                    $(this).closest('.message').transition('fade');
		    self.props.onMessageDismissed();
                });
	},

	render: function(){
	    if (!this.props.enabled){
		return null;
	    }

	    return (
		    <div className="ui message transition" id="dismissableMessage">
                      <i className="close icon"></i>
                      <div className="header">
		        {this.props.messageText}
                      </div>
                    </div>
		    );
	}
    });

module.exports = DismissableMessage;