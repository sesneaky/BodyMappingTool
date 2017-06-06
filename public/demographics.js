var React = require('react');
var ReactDOM = require('react-dom');

// This is simply a UI form for the user to enter various demographics and pass them up.
// It uses SemanticUI.
var Demographics = React.createClass({
	componentDidMount: function(){
	    $('.ui.form')
	    .form({
		    onSuccess: this.handleValidForm,
		    on: 'blur',
		    fields: {
			heartrate: {
			    identifier  : 'heartrate',
			    optional    : true,
			    rules: [
                              {
				type   : 'integer[30..220]',
				prompt : 'Please enter a valid heartrate'
			      }
			    ]
			},
			yearOfBirth: {
			    identifier  : 'yearOfBirth',
			    rules: [
                              {
				  type   : 'integer[1900..2016]',
				  prompt : 'Please enter a valid year of birth'
                              }
			    ]
			},
			gender: {
			    identifier: 'gender',
			    rules: [
                              {
				  type   : 'empty',
				  prompt : 'Please select a gender'
                              }
			    ]
			},
			language: {
			    identifier: 'language',
			    rules: [
                              {
				  type   : 'empty',
				  prompt : 'Please select a language'
                              }
			    ]
			},
			name: {
			    identifier  : 'name',
			    optional : true
			},
			email: {
			    identifier  : 'email',
			    optional : true,
			    rules: [
                              {
				  type   : 'email',
				  prompt : 'Please enter a valid e-mail or leave blank'
                              }
			    ]
			}
		    }
		})
	    ;

	    $('.ui.form')
	    .api({
		    action: 'submit',
		    beforeSend: function(settings){
			// Prevent semantic UI from submitting form (React will do it).
			return false;
		    }
		})
	    ;
	},

	componentDidUpdate: function(){
	    var self = this;

	    $('.menu .nextScreen').on('click', function(){
                    self.props.onNextScreen();
		});
	},

	handleValidForm: function(){
	    var $form = $('.ui.form');

	    var heartrate = $form.form('get value', 'heartrate');
	    var yearOfBirth = $form.form('get value', 'yearOfBirth');
	    var gender = $form.form('get value', 'gender');
	    var language = $form.form('get value', 'language');
	    var name = $form.form('get value', 'name');
	    var email = $form.form('get value', 'email');
	   
	    var demographics = {
                heartRate: heartrate,
                yearOfBirth: yearOfBirth,
                gender: gender,
                language: language
            };

	    if (name.length > 0){
		demographics.name = name;
	    }

            if (email.length > 0){
                demographics.emailAddress = email;
            }

            this.props.onDemographicsSubmit(demographics);
	},

	getSubmissionMarkup: function(){
	    var message, messageClass;

	    if (this.props.serverState == "successfulSubmission"){
		message = "Thank you for your contribution!";
		messageClass = "ui positive message";
	    } else if (this.props.serverState == "failedSubmission"){
		message = "Problem submitting demographics";
		if (this.props.errorCode){
		    message += " : " + this.props.errorCode;
		}
		messageClass = "ui negative message";
	    } else {
		return null;
	    }

	    return(
		   <div className="ui segment">
		   <div className="ui equal width grid">
		   <div className="thirteen wide column">
		   <div className={messageClass}><div className="header">{message}</div></div>
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
	},

        render: function(){
	    var genderOptions = [];

	    for (var i=0; i<this.props.uiConfig.genders.length; ++i){
		var gender = this.props.uiConfig.genders[i];
		genderOptions.push(<option value={gender} key={i}>{gender}</option>);
	    }

	    var languageOptions = [];

	    for (var i=0; i<this.props.uiConfig.languages.length; ++i){
		var language = this.props.uiConfig.languages[i];
		languageOptions.push(<option value={language} key={i}>{language}</option>);
	    }

            return (
		    <div className="demographics">

		      <div className="ui raised segment">
		        <h4 className="ui header">We respect your privacy</h4>
		      </div>

		    <form className="ui form">

		    <div className="ui segment">
		    <div className="two fields">
		    <div className="field">
		    <label>Heart rate</label>
		    <input name="heartrate" type="text" defaultValue=""/>
		    </div>
		    <div className="field">
		    <label>In what year were you born?</label>
		    <input name="yearOfBirth" type="text" defaultValue=""/>
		    </div>
		    </div>

		    <div className="two fields">
		    <div className="field">
		    <label>What is your gender?</label>
		    <select className="ui dropdown" name="gender">
		    <option value="">Gender</option>
			{genderOptions}
		    </select>
		    </div>
		    <div className="field">
		    <label>What is your first language?</label>
		    <select className="ui dropdown" name="language">
		    <option value="">Language</option>
			{languageOptions}
		    </select>
		    </div>
		    </div>
		    </div>

		    <div className="ui segment">
		    <div className="two fields">
		    <div className="field">
		    <label>Your name...</label>
		    <input name="name" type="text" defaultValue=""/>
		    </div>
		    <div className="field">
		    <label>Your email address...</label>
		    <input name="email" type="text" defaultValue=""/>
		    </div>
		    </div>
		    </div>

			{
			    this.props.serverState == "waitingForSubmission"
			    ?
			    <div>
			    <div className="ui submit button">Submit</div>
			    <div className="ui error message"></div>
			    </div>
			    :
			    null
			}
		    </form>

			{ this.getSubmissionMarkup() }			   
		    
		   </div>
		   );
        }
    });

module.exports = Demographics;