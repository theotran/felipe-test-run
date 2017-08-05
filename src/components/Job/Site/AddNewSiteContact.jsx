import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'react-addons-update';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Button } from 'semantic-ui-react'

const createPersonMutation = gql`
  mutation createPerson($firstName: String!, $lastName: String!) {
    createPerson(input: {firstName: $firstName, lastName: $lastName}) {
      id
      firstName
      lastName
      success
      message
      field
    }
  }
`;

const createPhoneMutation = gql`
  mutation createPhone($type: String, $number: String!, $belongsTo: String!, $belongsToId: ID!) {
    createPhone(input: {type: $type, number: $number, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      type
      number
      success
      message
    }
  }
`;

const createEmailMutation = gql`
  mutation createEmail($type: String, $address: String!, $belongsTo: String!, $belongsToId: ID!) {
    createEmail(input: {type: $type, address: $address, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      type
      address
      success
      message
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

const GetCompanyGroups = gql`
  query company{
    company {
      id
      groups{
        id
        name
        type
      }
    }
  }
 `;

class AddPerson extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.popPhone = this.popPhone.bind(this);
    this.popEmail = this.popEmail.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    this.state = {
      open: false,
      firstName: "",
      lastName: "",
      field: "",
      phones: [""],
      emails: [""],
      error: null
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleSave(e) {
    const {firstName, lastName, phones, emails } = this.state;
    let customerGroupId;
    for(let k=0; k < this.props.data.company.groups.length; k++){
      if(this.props.data.company.groups[k].name === 'Customer' && this.props.data.company.groups[k].type === 'Person'){
        customerGroupId = this.props.data.company.groups[k].id;
        break;
      }
    }

    this.props.CreatePerson({variables: { firstName, lastName, phones, emails }})
    .then((person) => {
      console.log('AddPersonModal', person);
      if(person.data.createPerson.success !== true){
        this.setState({
          field: person.data.createPerson.field,
          error: person.data.createPerson.message
        })
      } else {
        this.props.AddToGroup({
          variables:{
            GroupId: customerGroupId,
            MemberId: person.data.createPerson.id
          }
        }).then((group)=>{
          phones.map((phone, index) => {
            this.props.CreatePhone({variables: {type: "", number: phone, belongsTo: "Person", belongsToId: person.data.createPerson.id}}).then((phone) => {
              if(phone.data.createPhone.success !== true){
                console.log('ERROR - PHONES', phone.data);
                this.setState({
                  error: phone.data.createPhone.message,
                  field: phone.data.createPhone.field
                })
              }
            })
            return phone;
          })
          emails.map((email, index) => {
            this.props.CreateEmail({variables: {type: "", address: email, belongsTo: "Person", belongsToId: person.data.createPerson.id}}).then((email) => {
              if(email.data.createEmail.success !== true){
                console.log('ERROR - EMAIL', email.data);
                this.setState({
                  error: email.data.createEmail.message,
                  field: email.data.createEmail.field
                })
              }
            })
            return email;
          })
          console.log('HANDLESAVE',this.state);
          window.location.reload();
        })
      }
    })
    e.preventDefault();
  }

  popPhone(phone, index) {
    const initialState = this.state;

    const newState = update(initialState, {phones: {$splice: [[initialState.phones.indexOf(phone), 1]]}});

    this.setState(newState);
  }

  popEmail(email) {
    const initialState = this.state;

    const newState = update(initialState, {emails: {$splice: [[initialState.emails.indexOf(email), 1]]}});

    this.setState(newState);
  }

  handlePhoneChange(e) {
    const newPhones = update(this.state, {phones: {$splice: [[0, 1, e.target.value]]}});

    this.setState(newPhones, () => {console.log('HANDLEPHONE', this.state)});
  }

  handleEmailChange(e) {
    const newEmails = update(this.state, {emails: {$splice: [[0, 1, e.target.value]]}});

    this.setState(newEmails, () => {console.log('HANDLEEMAIL', this.state)});
  }

  render() {
    let userNameErrorFirst;
    let userNameErrorLast;
    let phoneError;
    let emailError;
    let errorStyles = {
      color: 'red'
    };

    switch(this.state.field){
      case 'firstName':
        userNameErrorFirst = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'lastName':
        userNameErrorLast = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'phone':
        phoneError = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'email':
        emailError = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        userNameErrorFirst = null;
        userNameErrorLast = null;
        phoneError = null;
        emailError = null;
    }
    console.log(this.props);
    return (

      <div>
        <Button color="teal" content='ADD CONTACT' icon='plus' labelPosition='left' onClick={this.handleOpen} />
        <Dialog
          title="Add Customer"
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          <form onSubmit={this.handleSave}>

            <div className="row">
              <div className="form-group col-sm-6">
                <label htmlFor="">First Name (Letters Only)</label>
                <input
                  placeholder="First Name"
                  className="form-control"
                  value={this.state.firstName}
                  onChange={(e) => this.setState({firstName: e.target.value})}
                  pattern="^[a-zA-Z-]+$"
                  required
                />
                {userNameErrorFirst}
                {/* <TextField
                  autoFocus="true"
                  type="text"
                  hintText="First Name"
                  floatingLabelText="First Name"
                  errorText={userNameErrorFirst}
                  value={this.state.firstName}
                  onChange={(e) => this.setState({firstName: e.target.value})}
                  title="Letters Only"
                  pattern="^[a-zA-Z-]+$"
                  required
                /> */}
              </div>

              <div className="form-group col-sm-6">
                <label htmlFor="">Last Name (Letters Only)</label>
                <input
                  placeholder="Last Name"
                  className="form-control"
                  value={this.state.lastName}
                  onChange={(e) => this.setState({lastName: e.target.value})}
                  pattern="^[a-zA-Z-]+$"
                  required
                />
                {/* <TextField
                  type="text"
                  hintText="Last Name"
                  floatingLabelText="Last Name"
                  errorText={userNameErrorLast}
                  value={this.state.lastName}
                  onChange={(e) => this.setState({lastName: e.target.value})}
                  title="Letters Only"
                  pattern="^[a-zA-Z.]+$"
                  required
                /> */}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-sm-6">
                <label htmlFor="">Phone (800-000-0000)</label>
                <input
                  placeholder="Phone"
                  className="form-control"
                  value={this.state.phone}
                  onChange={(e) => this.handlePhoneChange(e)}
                  pattern="^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
                  required
                />
                {phoneError}
                {/* <TextField
                  type="text"
                  hintText="(*** *** ****)"
                  floatingLabelText="Phone"
                  errorText={phoneError}
                  value={this.state.phone}
                  onChange={(e) => this.handlePhoneChange(e)}
                  title="*** *** ****"
                  pattern="^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
                  required
                /> */}
              </div>

              <div className="form-group col-sm-6">
                <label htmlFor="">Email</label>
                <input
                  placeholder="Email"
                  className="form-control"
                  value={this.state.email}
                  onChange={(e) => this.handleEmailChange(e)}
                  required
                />
                {emailError}
                {/* <TextField
                  type="email"
                  hintText="Email"
                  floatingLabelText="Email"
                  errorText={emailError}
                  value={this.state.email}
                  onChange={(e) => this.handleEmailChange(e)}
                  required
                /> */}
              </div>

            </div>

          <div className="row">
            <RaisedButton
              backgroundColor={"#00B1B3"}
              labelColor={"#fff"}
              label="Submit"
              type="submit"
              className="pull-right"
            />
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.handleClose}
              className="pull-right"
            />
          </div>

          </form>

        </Dialog>
      </div>

    )
  }
}

const AddPersonWithMutation = compose(
  graphql(createPersonMutation, { name: "CreatePerson" }),
  graphql(createPhoneMutation, { name: "CreatePhone" }),
  graphql(createEmailMutation, { name: "CreateEmail" }),
  graphql(AddToGroupMutation, { name: "AddToGroup" }),
  graphql(GetCompanyGroups)
  )(withRouter(AddPerson));

export default AddPersonWithMutation;
