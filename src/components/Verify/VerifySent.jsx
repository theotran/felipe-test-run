import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Header, Button } from 'semantic-ui-react'
class VerifySentPage extends Component {
  componentDidMount () {
    window.scrollTo(0, 0);
  }
  render(){

    return (
      <div className="row">
        <div className="col-md-6" id="verifySentPageId">
            <div className="row">
                <Header as='h2' color='teal'>Thank you for registering with Ryion.</Header>
                <Header as='h3' color='teal'>Please check your email to complete your registration.</Header>
                {/*<p> Didn't receive an email? Click Here to resend it now.</p>*/}
            </div>

            {/* <div className="row verifySentButton">
              <Button color='teal' onClick={(e, data) => { browserHistory.push('/login') }} >LOGIN</Button>
            </div> */}
        </div>
      </div>
    )
  };
}

export default VerifySentPage;
