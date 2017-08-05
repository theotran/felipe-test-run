
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'

class InviteSentPage extends Component {

  render(){

    return (
      <div id="inviteSentPageId">

        <div className="login-header row">
          <div className="col-sm-12">
            <h3>Success!</h3>
          </div>
        </div>

        <div className="row">
            <Header as='h4' color='teal'>Thank you for signing up!</Header>
            <p> An invite link has been sent to the email provided. Access to Ryion will be permitted upon setting a username and password.</p>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <a style={{color: 'purple'}} href="/login">Login Page</a>
          </div>
        </div>
      </div>
    )
  };
}

export default InviteSentPage;
