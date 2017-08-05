
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { browserHistory } from 'react-router';
import gql from 'graphql-tag';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const PasswordResetMutation = gql`
  mutation passwordReset($token: String!, $password: String!) {
    passwordReset (token: $token, password: $password) {
      username
      password
      success
      message
      field
    }
  }
`;

class PasswordResetPage extends Component {
  constructor(props){
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.goLogin = this.goLogin.bind(this);

    this.state = {
      token: this.props.params.token,
      password: "",
      confirmPassword: "",
      validating: false,
      reset: false,
      field: "",
      error: null
    };
  }

  goLogin = () => {
    browserHistory.push('/login');
  }

  handleBlur = () => {
    this.setState({
      validating: true
    })
  }

  renderPasswordConfirmError() {
    if(this.state.validating && this.state.password !== this.state.confirmPassword){
      return <div style={{color:'red'}}>Passwords do not match.</div>
    }
      return null;
    }

  handleSubmit = (e) => {

    this.props.mutate({
      variables: {
        token: this.state.token,
        password: this.state.password
      }
    }).then(value => {
      if(value.data.passwordReset.success === false){
        this.setState({
          field: value.data.passwordReset.field,
          error: value.data.passwordReset.message
        })
      } else {
        this.setState({
          reset: true
        })
      }
    })

    e.preventDefault
  }

  render() {
    let passwordInputHeader;
    let passwordInput;
    let passwordInputAction;
    let passwordChangedHeader;
    let passwordChangedAction;
    let passwordError;
    let errorStyles = {
      color: 'red'
    };

    switch(this.state.field){
      case "password" || "mail":
        passwordError = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        passwordError = null;
    }

    if(this.state.reset === false){
      passwordInputHeader = <CardHeader
                              title="Enter a new password."
                              titleStyle={{fontSize: '25px', marginLeft: 90, marginTop: -5}}
                            />;

      passwordInput = <CardText style={{marginTop: -9}}>
                        <div className="form-group col-md-12">
                          <input
                            autoFocus={true}
                            name='Password'
                            type='password'
                            className="form-control"
                            value={this.state.password}
                            placeholder='Password'
                            onChange={(e) => this.setState({password: e.target.value})}
                          />
                        </div>
                        <div className="form-group col-md-12">
                          <input
                            name='Confirm Password'
                            type='password'
                            className="form-control"
                            value={this.state.confirmPassword}
                            placeholder='Confirm Password'
                            onBlur={this.handleBlur}
                            onChange={(e) => this.setState({confirmPassword: e.target.value})}
                          />
                          {this.renderPasswordConfirmError()}
                          {passwordError}
                        </div>
                      </CardText>;


      passwordInputAction = <RaisedButton
                              backgroundColor={"#00B1B3"}
                              labelColor={"#fff"}
                              label="Submit"
                              onTouchTap={this.handleSubmit}
                              disabled={this.state.validating && this.state.password !== this.state.confirmPassword ? true : false }
                            />;

    } else if(this.state.reset === true){
      passwordChangedHeader = <CardHeader
                                title="Your login credentials have been updated"
                                titleStyle={{fontSize: '25px', marginLeft: 90, marginTop: 25}}
                              />;

      passwordChangedAction = <RaisedButton
                                backgroundColor={"#00B1B3"}
                                labelColor={"#fff"}
                                label="Login"
                                onTouchTap={this.goLogin}
                              />
    }

    return (
      <div className="panel panel-default" style={{width: '33%', margin: 'auto', marginTop: '5%'}}>
        <div className="panel-body">
          <div>
            <Card style={{textAlign: 'center', height: 250}}>
              {passwordInputHeader}
              {passwordChangedHeader}
              <div className="row">
                {passwordInput}
              </div>

              <CardActions>
                {passwordInputAction}
                {passwordChangedAction}
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const PasswordResetPageWithMutation = graphql(PasswordResetMutation)(PasswordResetPage);

export default PasswordResetPageWithMutation;
