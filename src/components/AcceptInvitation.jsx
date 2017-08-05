
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import decode from 'jwt-decode';

import { Header, Button } from 'semantic-ui-react';

import validator from 'validator';

const RegisterNewUserMutation = gql`
  mutation registerNewUser ($username: String!, $password: String!, $email: String!, $PersonId: ID!, $CompanyId: ID) {
    register (username: $username, password: $password, email: $email, PersonId: $PersonId, CompanyId: $CompanyId) {
      id
      username
      success
      message
      field
    }
  }
`;

const AddToGroupMutation = gql`
  mutation addToGroup ($GroupId: ID!, $MemberId: ID!) {
    addToGroup (input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

// Live Validation
const IsUniqueUsernameMutation = gql`
  mutation isUniqueUsername($username: String!) {
    isUniqueUsername(username: $username)
  }
`;

let cachedCompanyQuery;

class AcceptInvitationPage extends Component {
  constructor(props) {
    super(props);

    let token = this.props.params.token;
    let data = decode(token);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      email: data.email,
      PersonId: data.PersonId,
      GroupIdArr: data.GroupIdArr,
      CompanyId: data.CompanyId,
      validating: false,
      field: "",
      error: null
    }
  }

  handleBlur(e) {
    switch(e.target.name){
      case "Username":
        this.props.IsUniqueUsername({
          variables: {
            username: this.state.username
          }
        }).then(result =>{
          if(result.data.isUniqueUsername === false && this.state.username === ""){
            this.setState({
              field: "",
              error: ""
            })
          } else if(result.data.isUniqueUsername === false){
            this.setState({
              field: "username",
              error: "Username already taken."
            })
          }
        })
        break;
      default:
    }
  }

  handleChange() {
    this.setState({ validating: true });
  }

  renderPasswordConfirmError() {
    if(this.state.validating && this.state.password !== this.state.confirmPassword){
      return <div style={{color:'red'}}>Passwords do not match.</div>
    }
    return null;
  }

  handleSubmit = (e) => {
    this.props.RegisterNewUser({
      variables: {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        PersonId: this.state.PersonId,
        CompanyId: this.state.CompanyId
      }
    }).then(user => {
      if(user.data.register.success === false){
        this.setState({
          field: user.data.register.field,
          error: user.data.register.message
        })
      } else {
        this.state.GroupIdArr.map((group, index) => {
          this.props.AddToGroup({
            variables: {
              GroupId: group,
              MemberId: user.data.register.id
            }
          }).then(userMember => {
            if(userMember.data.addToGroup.success === false){
              this.setState({
                field: userMember.data.addToGroup.field,
                error: userMember.data.addToGroup.message
              })
            } else {
              browserHistory.push('/verify');
            }
          })
        })
      }
    })
    e.preventDefault()
  }

  render(){
    let displayErrorUser;
    let displayErrorEmail;
    let displayErrorPassword;
    let displayErrorAccount;
    let errorStyles = {
      color: 'red'
    };

    switch(this.state.field){
      case "username":
        displayErrorUser = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "email":
        displayErrorEmail = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "password":
        displayErrorPassword = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "account":
        displayErrorAccount = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        displayErrorUser = null;
        displayErrorEmail = null;
        displayErrorPassword = null;
        displayErrorAccount = null;
    }

    return (
      <div className="row">
        <div style={{width: '100%', maxWidth: 700}}>
          <div id="registerPageId">
            <div className="login-header row">
                <Header as='h2' color='teal'>Register with Ryion</Header>
            </div>

            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <label className="" htmlFor="Username">Username*</label>
                  <input
                    className='form-control'
                    name='Username'
                    type='text'
                    autoFocus='true'
                    placeholder='Username'
                    value={this.state.username}
                    onBlur={this.handleBlur}
                    onChange={(e) => {!validator.matches(e.target.value, /^[\w-]{3,12}$/) ? this.setState({field: "username", error: "Username must be 3-12 characters. Hyphens and underscores allowed.", username: e.target.value}) : this.setState({field: "", error: "", username: e.target.value })}}
                    title="Username must be 3-12 characters. Hyphens and underscores allowed."
                    pattern="^[\w-]{3,12}$"
                    required
                  />
                  {displayErrorUser}
                  {displayErrorEmail}
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <label className="" htmlFor='Password'>Password*</label>
                  <input
                    className='form-control'
                    name='Password'
                    type='password'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={(e) => {!validator.matches(e.target.value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*_-]).{8,25}$/) ? this.setState({field: "password", error: "Password must be 8-25 characters and include one upper and lowercase letter, a number and a special character (#?!@$%^&*_-).", password: e.target.value}) : this.setState({field: "", error: "", password: e.target.value}) }}
                    title="Password must be 8-25 characters and include one upper and lowercase letter, a number and a special character (#?!@$%^&*_-)."
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*_-]).{8,25}$"
                    required
                  />
                  {displayErrorPassword}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <label className="" htmlFor='confirmPassword'>Confirm Password*</label>
                  <input
                    name='confirmPassword'
                    type='password'
                    placeholder='Confirm Password'
                    className='form-control'
                    onBlur={this.handleChange}
                    value={this.state.confirmPassword}
                    onChange={(e) => this.setState({confirmPassword: e.target.value})}
                    required
                  />
                  {this.renderPasswordConfirmError()}
                </div>
                {displayErrorAccount}
              </div>

              <div className="row">
                <div className=" col-md-6 AcceptInvitationButton">
                  {/* <button name='submit' type='submit' value='Submit' className='btn btn-default pull-right'>
                    Submit
                  </button> */}
                  <Button color='teal' type="Submit" onClick={this.handleSubmit}>SUBMIT</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  };
}

const AcceptInvitationPageWithMutation = compose(
  graphql(RegisterNewUserMutation, { name: "RegisterNewUser" }),
  graphql(AddToGroupMutation, { name: "AddToGroup" }),
  graphql(IsUniqueUsernameMutation, { name: "IsUniqueUsername" })
  )(withRouter(AcceptInvitationPage));

export default AcceptInvitationPageWithMutation;
