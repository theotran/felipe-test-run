
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Dropdown, Button } from 'semantic-ui-react';

import LabelInput from './../LabelInput';

import InputMask from 'react-input-mask';

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
      id
      type
      number
      success
      message
      field
    }
  }
`;

const createEmailMutation = gql`
  mutation createEmail($type: String, $address: String!, $belongsTo: String!, $belongsToId: ID!) {
    createEmail(input: {type: $type, address: $address, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      type
      address
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

const AddAddressMutation = gql`
  mutation addAddressTo ($belongsTo: String!, $belongsToId: ID!, $line1: String!, $line2: String, $city: String, $state: String, $zip: String!, $country: String) {
    addAddressTo (belongsTo: $belongsTo, belongsToId: $belongsToId, input: { line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip, country: $country }) {
      id
      line1
      line2
      city
      state
      zip
      country
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
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
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
          if(group.data.addToGroup.success === false){
            this.setState({
              field: group.data.addToGroup.field,
              error: group.data.addToGroup.message
            })
          } else {
            this.props.AddAddress({
              variables: {
                belongsTo: "Person",
                belongsToId: person.data.createPerson.id,
                line1: this.state.line1,
                line2: this.state.line2,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
                country: this.state.country
              }
            }).then(address => {
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
              browserHistory.push(`/customers/${person.data.createPerson.id}`);
            })
          }
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

    if(this.state.phones[0] === "" && e.target.value === "(___) ___-____"){
      const requiredPhone = update(this.state, {
        field: {$set: "phone"},
        error: {$set: "Required"}
      })
      this.setState(requiredPhone)
    }
  }

  handleEmailChange(e) {
    const newEmails = update(this.state, {emails: {$splice: [[0, 1, e.target.value]]}});

    this.setState(newEmails, () => {console.log('HANDLEEMAIL', this.state)});
  }

  render() {
    let errorFirstName;
    let errorLastName;
    let errorPhone;
    let errorEmail;
    let errorStyles = {
      color: 'red'
    };
    let err = <div style={errorStyles}>{this.state.error}</div>;

    switch(this.state.field){
      case 'firstName':
        errorFirstName = err;
        break;
      case 'lastName':
        errorLastName = err;
        break;
      case 'phone':
        errorPhone = err;
        break;
      case 'email':
        errorEmail = err;
        break;
      default:
        errorFirstName = null;
        errorLastName = null;
        errorPhone = null;
        errorEmail = null;
    }

    return (

      <div>
        <div className='row'>
          <Button color="teal" content='ADD CUSTOMER' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        </div>
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="Add Customer" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Customer"
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          <form onSubmit={this.handleSave}>

            <div className="row">
              <div className="form-group col-sm-6">
                <label htmlFor="firstName" >First Name</label>
                <input
                  autoFocus="true"
                  type="text"
                  className='form-control'
                  name="firstName"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={(e) => this.setState({firstName: e.target.value})}
                  title="Letters Only"
                  pattern="^[a-zA-Z\s.-]+$"
                  required
                />
                {errorFirstName}
              </div>

              <div className="form-group col-sm-6">
                <label htmlFor="lastName" >Last Name</label>
                <input
                  type="text"
                  className='form-control'
                  name="lastName"
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={(e) => this.setState({lastName: e.target.value})}
                  title="Letters Only"
                  pattern="^[a-zA-Z\s.-]+$"
                  required
                />
                {errorLastName}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-sm-6">
                <label htmlFor="phone">*Phone</label>
                <InputMask
                  mask="(999) 999-9999"
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={this.state.phone}
                  onChange={(e) => this.handlePhoneChange(e)}
                  required
                />
                {errorPhone}
              </div>
              <div className="form-group col-sm-6">
                <label htmlFor="email">*Email</label>
                <input
                  type="email"
                  className='form-control'
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={(e) => this.handleEmailChange(e)}
                  required
                />
                {errorEmail}
              </div>
            </div>


            <div className="row">
              <LabelInput className={'col-md-6'} label='Address Line 1' name='Line 1' value={this.state.line1} placeholder='Line 1' onChange={(e) => this.setState({line1: e.target.value})} />
              <LabelInput className={'col-md-6'} label='Address Line 2 (optional)' name='Line 2' value={this.state.line2} placeholder='Line 2' onChange={(e) => this.setState({line2: e.target.value})} />
            </div>

            <div className="row">
              <LabelInput className={'col-md-6'} label='City' name='City' value={this.state.city} placeholder='City' onChange={(e) => this.setState({city: e.target.value})} />

              <div className="form-group col-md-3">
                <label htmlFor="">State</label>
                <Dropdown
                  placeholder='Select a State'
                  fluid selection options={[
                    { value: "AL", text: "Alabama" },
                    { value: "AK", text: "Alaska" },
                    { value: "AZ", text: "Arizona" },
                    { value: "AR", text: "Arkansas" },
                    { value: "CA", text: "California" },
                    { value: "CO", text: "Colorado" },
                    { value: "CT", text: "Connecticut" },
                    { value: "DE", text: "Delaware" },
                    { value: "DC", text: "District Of Columbia" },
                    { value: "FL", text: "Florida" },
                    { value: "GA", text: "Georgia" },
                    { value: "HI", text: "Hawaii" },
                    { value: "ID", text: "Idaho" },
                    { value: "IL", text: "Illinois" },
                    { value: "IN", text: "Indiana" },
                    { value: "IA", text: "Iowa" },
                    { value: "KS", text: "Kansas" },
                    { value: "KY", text: "Kentucky" },
                    { value: "LA", text: "Louisiana" },
                    { value: "ME",  text: "Maine" },
                    { value: "MD", text: "Maryland" },
                    { value: "MA", text: "Massachusetts" },
                    { value: "MI", text: "Michigan" },
                    { value: "MN", text: "Minnesota" },
                    { value: "MS", text: "Mississippi" },
                    { value: "MO",  text: "Missouri" },
                    { value: "MT",  text: "Montana" },
                    { value: "NE",  text: "Nebraska" },
                    { value: "NV",  text: "Nevada" },
                    { value: "NH",  text: "New Hampshire" },
                    { value: "NJ",  text: "New Jersey" },
                    { value: "NM",  text: "New Mexico" },
                    { value: "NY",  text: "New York" },
                    { value: "NC",  text: "North Carolina" },
                    { value: "ND",  text: "North Dakota" },
                    { value: "OH",  text: "Ohio" },
                    { value: "OK",  text: "Oklahoma" },
                    { value: "OR", text: "Oregon" },
                    { value: "PA", text: "Pennsylvania" },
                    { value: "RI", text: "Rhode Island" },
                    { value: "SC", text: "South Carolina" },
                    { value: "SD", text: "South Dakota" },
                    { value: "TN", text: "Tennessee" },
                    { value: "TX", text: "Texas" },
                    { value: "UT", text: "Utah" },
                    { value: "VT", text: "Vermont" },
                    { value: "VA", text: "Virginia" },
                    { value: "WA", text: "Washington" },
                    { value: "WV", text: "West Virginia" },
                    { value: "WI", text: "Wisconsin" },
                    { value: "WY", text: "Wyoming" },
                    { value: "AS", text: "American Samoa" },
                    { value: "GU", text: "Guam" },
                    { value: "MP", text: "Northern Mariana Islands" },
                    { value: "PR", text: "Puerto Rico" },
                    { value: "UM", text: "United States Minor Outlying Islands" },
                    { value: "VI", text: "Virgin Islands" },
                    { value: "AA", text: "Armed Forces Americas" },
                    { value: "AP", text: "Armed Forces Pacific" },
                    { value: "AE", text: "Armed Forces Others" },
                   ]}
                  value={this.state.state}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ state: data.value })
                  }}
                />
              </div>

              <div className="form-group col-md-3">
                <label htmlFor="">Zip</label>
                <input
                  name='Zip'
                  className="form-control"
                  value={this.state.zip}
                  placeholder='Zip'
                  onChange={(e) => this.setState({zip: e.target.value})}
                />
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
  graphql(AddAddressMutation, { name: "AddAddress" }),
  graphql(GetCompanyGroups)
  )(withRouter(AddPerson));

export default AddPersonWithMutation;
