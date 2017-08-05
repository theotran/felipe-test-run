import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { withRouter, browserHistory } from 'react-router';
import { Header, Button } from 'semantic-ui-react'

const UpdateUserMutation = gql`
  mutation updateUser($token: String!) {
    updateUser (token: $token) {
      username
      password
      active
      success
      message
      field
    }
  }
`;

class VerifyConfirmPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: this.props.params.token,
      field: "",
      error: null
    }
    console.log('PROPS', this.props);
    console.log('TOKEN',this.state.token);
  }

  componentDidMount() {
    this.props.UpdateUser({
      variables: {
        token: this.props.params.token
      }
    })
    .then((value) => {
      if(value.data.updateUser.success === false) {
        this.setState({
          field: value.data.updateUser.field,
          error: value.data.updateUser.message
        })
      }
    })
  }

  render(){
    let verifyUserError;
    let updateUserError;

    let confirm;
    let tokenRefresh;

    let errorStyles = {
      color: 'red'
    };

    confirm = <div className="row">
                <div className="col-md-12">
                  <Header as='h3' color='teal'>Thank you for verifying your email.</Header>
                  <Header as='h4' color='teal'>Please login!</Header>
                </div>
              </div>;

    switch (this.state.field){
      case "verifyUser":
        verifyUserError = <div id="verifyUserError" style={errorStyles}>{this.state.error}</div>;
        break;
      case "updateUser":
        updateUserError = <div id="updateUserError" style={errorStyles}>{this.state.error}</div>;
        break;
      case "expiredToken":
        tokenRefresh = <div className="row">
                          <div className="col-md-6">
                            <Header as='h3' color='teal'>Uh oh! Your verification link has expired. A new email has been sent to you.</Header>
                          </div>
                        </div>;
        confirm = null;
        break
      default:
        verifyUserError = null;
        updateUserError = null;
        tokenRefresh = null;
    }

    return (
    <div>
      <div className="col-md-6" id="verifyConfirmPageId">

        <div className="login-header row">
          <div className="col-md-12">
            <Header as='h3' color='teal'>Welcome!</Header>
          </div>
        </div>

        {confirm}
        {tokenRefresh}

        <div className="row">
          <div className="col-md-12">
            {verifyUserError}
            {updateUserError}
          </div>
        </div>

        <div className="row">
            <Button color='teal' onClick={(e, data) => { browserHistory.push('/login') }} >LOGIN</Button>
        </div>
      </div>
    </div>
    )
  };
}

const VerifyConfirmPageWithMutation = compose(
  graphql(UpdateUserMutation, { name: "UpdateUser" })
  )(withRouter(VerifyConfirmPage));

export default VerifyConfirmPageWithMutation;
