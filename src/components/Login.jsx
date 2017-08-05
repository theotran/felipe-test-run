
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';

// import PasswordResetModal from './PasswordResetModal';
import { Button, Image } from 'semantic-ui-react'

const LoginUserMutation = gql`
  mutation loginUser ($username: String!, $password: String!) {
    login (username: $username, password: $password) {
      success
      message
      field
      token
    }
  }
`;

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: "",
      password: "",
      field: "",
      error: null
    }
  }

  handleSubmit(e) {
    this.props.mutate({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    })
    .then((value) => {
      console.log('VALUE', value);
      if(value.data.login.success === true) {
        localStorage.setItem('ryionAuthToken', value.data.login.token);
        browserHistory.push('/');
      } else {
        this.setState({
          field: value.data.login.field,
          error: value.data.login.message
        })
      }
    })
    e.preventDefault();
  }

  render(){
    console.log(this);

    let displayErrorName;
    let displayErrorPassword;
    let displayErrorActive;
    let errorStyles = {
      color: 'red'
    };

    switch(this.state.field){
      case "user":
        displayErrorName = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "active":
        displayErrorActive = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "password":
        displayErrorPassword = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        displayErrorName = null;
        displayErrorPassword = null;
        displayErrorActive = null;
    }

    let loginDesktop = (
      <div>
        <div id="loginPageId">
          <div id="loginPageFormBackground"></div>
          <div id="loginPageFormCover"></div>

          <div id="loginPageCoverLogo">
            <img src="./../../images/RYION_UI_launch_Logo.png"/>
          </div>

          <div id="loginPageContentContainer">
            <div id="loginPageFormContainer">
              <div className="row" id="loginPageForm">
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        name='Username'
                        type='text'
                        placeholder='Username'
                        required
                        className='form-control'
                        autoFocus='true'
                        onChange={(e) => this.setState({username: e.target.value})}
                      />
                      {displayErrorName}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        name='Password'
                        type='password'
                        placeholder='Password'
                        required
                        className='form-control'
                        onChange={(e) => this.setState({password: e.target.value})}
                      />
                      {displayErrorPassword}
                      {displayErrorActive}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12">
                      {/* <button name='submit' type='submit' value='Submit' className='btn btn-default'>
                        Login
                      </button> */}
                      <Button style={{ width: "250px", padding: "16px" }} color='teal' value="Submit">LOGIN</Button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 login-link">
                      <span>Dont have an account?<a style={{ color: "#00b1b3"}} href="/registerAdmin"> Create One.</a></span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 login-link">
                      <span><a style={{ color: "#00b1b3"}} href="/identify">Forgot password?</a></span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    let loginMobile = (
      <div>
        <div className="row mobileLoginHeader">
          <Image centered size="large" src='/images/ryion_logo_white_tag.png' fluid />
        </div>
        <div className="row mobileLoginHeaderTeal">
        </div>
        <div className="row mobileLoginInputs">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-sm-12">
                <input
                  name='Username'
                  type='text'
                  placeholder='Username'
                  required
                  className='form-control'
                  autoFocus='true'
                  onChange={(e) => this.setState({username: e.target.value})}
                />
                {displayErrorName}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <input
                  name='Password'
                  type='password'
                  placeholder='Password'
                  required
                  className='form-control'
                  onChange={(e) => this.setState({password: e.target.value})}
                />
                {displayErrorPassword}
                {displayErrorActive}
              </div>
            </div>

            <div className="row">
              <div className="loginPageButton">
                {/* <button name='submit' type='submit' value='Submit' className='btn btn-default'>
                  Login
                </button> */}
                <Button centered style={{ width: "300px", padding: "16px" }} color='teal' value="Submit">LOGIN</Button>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 login-link">
                <span>Dont have an account?<a style={{ color: "#00b1b3"}} href="/registerAdmin"> Create One.</a></span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 login-link">
                <span><a style={{ color: "#00b1b3"}} href="/identify">Forgot password?</a></span>
              </div>
            </div>
          </form>
        </div>
      </div>
    )

    if(this.props.mediaQuery === 'large') {
      return loginDesktop;
    } else {
      return loginMobile;
    }
  };
}

const LoginPageWithMutation = graphql(LoginUserMutation)(LoginPage);

export default LoginPageWithMutation;
