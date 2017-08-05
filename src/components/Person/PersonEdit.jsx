import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
import update from 'react-addons-update';
import gql from 'graphql-tag';

import FlatButton from 'material-ui/FlatButton';
import { Dropdown, Button } from 'semantic-ui-react'

import InputMask from 'react-input-mask';
import equal from 'deep-equal';
import validator from 'validator';

import GetPersonQuery from './../../queries/GetPersonQuery';

import LabelInput from './../LabelInput';
import client from './../../index.js';

const updatePersonMutation = gql`
  mutation updatePerson($id: ID!, $firstName: String!, $middleName: String, $lastName: String!) {
    updatePerson (input: {id: $id, firstName: $firstName, middleName: $middleName, lastName: $lastName}) {
      id
      firstName
      middleName
      lastName
      success
      message
      field
    }
  }
`;

const updatePhoneMutation = gql`
  mutation updatePhone($id: ID, $type: String, $number: String!, $belongsTo: String!, $belongsToId: ID!) {
    updatePhone(input: {id: $id, type: $type, number: $number, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      type
      number
      success
      message
      field
    }
  }
`;

const updateEmailMutation = gql`
  mutation updateEmail($id: ID, $type: String, $address: String!, $belongsTo: String!, $belongsToId: ID!) {
    updateEmail(input: {id: $id, type: $type, address: $address, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      type
      address
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

const deletePhoneMutation = gql`
  mutation deletePhone($id: ID!) {
    deletePhone(id: $id) {
      success
      message
      field
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

const deleteEmailMutation = gql`
  mutation deleteEmail($id: ID!) {
    deleteEmail(id: $id) {
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

const UpdateAddressMutation = gql`
  mutation updateAddress ($id: ID!, $belongsTo: String!, $belongsToId: ID!, $line1: String!, $line2: String, $city: String, $state: String, $zip: String!, $country: String) {
    updateAddress (id: $id, belongsTo: $belongsTo, belongsToId: $belongsToId, input: { line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip, country: $country }) {
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

let cachedPersonQuery;

class PersonEditForm extends Component {

  constructor(props) {
    super(props);

    this.popPhone = this.popPhone.bind(this);
    this.popEmail = this.popEmail.bind(this);
    this.appendPhone = this.appendPhone.bind(this);
    this.appendEmail = this.appendEmail.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      firstName: this.props.person.firstName,
      middleName: this.props.person.middleName,
      lastName: this.props.person.lastName,
      phones: this.props.person.phones,
      emails: this.props.person.emails,
      line1: this.props.person.addresses[0] ? this.props.person.addresses[0].line1 : '',
      line2: this.props.person.addresses[0] ? this.props.person.addresses[0].line2 : '',
      city: this.props.person.addresses[0] ? this.props.person.addresses[0].city : '',
      state: this.props.person.addresses[0] ? this.props.person.addresses[0].state : '',
      zip: this.props.person.addresses[0] ? this.props.person.addresses[0].zip : '',
      country: this.props.person.addresses[0] ? this.props.person.addresses[0].country : '',
      field: "",
      error: null
    }
  }

  handleBlur(index) {

    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    console.log('CACHED PERSON QUERY', cachedPersonQuery.person);

    // UPDATE PERSON
    if(cachedPersonQuery.person.firstName !== this.state.firstName || cachedPersonQuery.person.middleName !== this.state.middleName || cachedPersonQuery.person.lastName !== this.state.lastName){
      client.mutate({
        mutation: updatePersonMutation,
        variables: {
          id: cachedPersonQuery.person.id,
          firstName: this.state.firstName,
          middleName: this.state.middleName,
          lastName: this.state.lastName
        },
        optimisticResponse: {
          id: cachedPersonQuery.person.id,
          firstName: this.state.firstName,
          middleName: this.state.middleName,
          lastName: this.state.lastName
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy);

          console.log('RESULT', result);

          // Read data from cache
          const data = proxy.readQuery({
            query: GetPersonQuery,
            variables: {
              id: this.props.person.id
            }
          });
          console.log('data', data);

          if("updatePerson" in result.data){

            if(result.data.updatePerson.success === false){
              this.setState({
                error: result.data.updatePerson.message,
                field: result.data.updatePerson.field
              });
            } else {
              // Combine original query data with mutation result
              data.person.firstName = result.data.updatePerson.firstName;
              data.person.middleName = result.data.updatePerson.middleName;
              data.person.lastName = result.data.updatePerson.lastName;
            }

          } else {
            data.person.firstName = result.data.firstName;
            data.person.middleName = result.data.middleName;
            data.person.lastName = result.data.lastName;
          }

          console.log('DATA POST UPDATE', data);

          // Write combined data back to the cache
          proxy.writeQuery({
            query: GetPersonQuery,
            variables: {
              id: this.props.person.id
            },
            data
          });
        }
      });

      // Update the variable
      cachedPersonQuery = client.readQuery({
        query: GetPersonQuery,
        variables: {
          id: this.props.person.id
        }
      });
    }

    console.log('CONDITIONAL CACHE PHONE INDEX', cachedPersonQuery.person.phones[index]);
    console.log('CONDITIONAL STATE PHONE INDEX', this.state.phones[index]);

    console.log('CONDITIONAL CACHE EMAIL INDEX', cachedPersonQuery.person.emails[index]);
    console.log('CONDITIONAL STATE EMAIL INDEX', this.state.emails[index]);

    // DEEP COMPARISON OF CACHED PHONES TO STATE PHONES
    if(equal(cachedPersonQuery.person.phones[index], this.state.phones[index]) === false){
      console.log('PHONE IN THE CONDITIONAL');
      console.log('INDEX OF NEW PHONE', cachedPersonQuery.person.phones.indexOf(this.state.phones[index]));

      // IF A PHONE IN STATE IS NOT IN CACHE (A PHONE WAS ADDED) CREATE PHONE, ELSE UPDATE
      if(cachedPersonQuery.person.phones.indexOf(this.state.phones[index]) === -1 && cachedPersonQuery.person.phones.length !== this.state.phones.length){
        console.log('CREATE A NEW PHONE');
        client.mutate({
          mutation: createPhoneMutation,
          variables: {
            type: "",
            number: this.state.phones[index].number,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          optimisticResponse: {
            type: "",
            number: this.state.phones[index].number,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          update: (proxy, result) => {
            console.log('CREATE PHONE PROXY', proxy);
            console.log('CREATE PHONE RESULT', result);

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });
            console.log('data', data);

            // Combine original query data with mutation result
            if("createPhone" in result.data){
              console.log('THE RESULT DATA',result.data);
              if(result.data.createPhone.success === false){
                this.setState({
                  error: result.data.createPhone.message,
                  field: result.data.createPhone.field
                });
              } else {
                data.person.phones = result.data.createPhone.phones;
              }
            } else {
              data.person.phones = result.data.phones;
            }

            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              },
              data
            });
          }
        });
        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      } else {
        console.log('UPDATE EXISTING PHONES');
        client.mutate({
          mutation: updatePhoneMutation,
          variables: {
            id: this.state.phones[index].id,
            type: "",
            number: this.state.phones[index].number,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          optimisticResponse: {
            id: this.state.phones[index].id,
            type: "",
            number: this.state.phones[index].number,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          update: (proxy, result) => {
            console.log('PHONE PROXY', proxy);
            console.log('PHONE RESULT', result);

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });
            console.log('data', data);

            // Combine original query data with mutation result
            if("updatePhone" in result.data){
              if(result.data.updatePhone.success === false){
                this.setState({
                  error: result.data.updatePhone.message,
                  field: result.data.updatePhone.field
                });
              } else {
                data.person.phones = result.data.updatePhone.phones;
              }
            } else {
              data.person.phones = result.data.phones;
            }

            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              },
              data
            });
          }
        });

        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      }
    }

    if(equal(cachedPersonQuery.person.emails[index], this.state.emails[index]) === false){
      console.log('EMAILS DIFFER');
      console.log('INDEX OF NEW EMAIL', cachedPersonQuery.person.emails.indexOf(this.state.emails[index]));
      if(cachedPersonQuery.person.emails.indexOf(this.state.emails[index]) === -1 && cachedPersonQuery.person.emails.length !== this.state.emails.length){
        console.log('CREATE A NEW EMAIL');
        client.mutate({
          mutation: createEmailMutation,
          variables: {
            type: "",
            address: this.state.emails[index].address,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          optimisticResponse: {
            type: "",
            address: this.state.emails[index].address,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          update: (proxy, result) => {
            console.log('CREATE EMAIL PROXY', proxy);
            console.log('CREATE EMAIL RESULT', result);

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });
            console.log('CREATE EMAIL DATA', data);

            // Combine original query data with mutation result
            if("createEmail" in result.data){
              if(result.data.createEmail.success === false){
                this.setState({
                  error: result.data.createEmail.message,
                  field: result.data.createEmail.field
                });
              } else {
                data.person.emails = result.data.createEmail.emails;
              }
            } else {
              data.person.emails = result.data.emails;
            }

            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              },
              data
            });
          }
        });
        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      } else {
        client.mutate({
          mutation: updateEmailMutation,
          variables: {
            id: this.state.emails[index].id,
            type: "",
            address: this.state.emails[index].address,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          optimisticResponse: {
            id: this.state.emails[index].id,
            type: "",
            address: this.state.emails[index].address,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id
          },
          update: (proxy, result) => {
            console.log('EMAIL PROXY', proxy);
            console.log('EMAIL RESULT', result);

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });
            console.log('data', data);

            // Combine original query data with mutation result
            if("updateEmail" in result.data){
              if(result.data.updateEmail.success === false){
                this.setState({
                  error: result.data.updateEmail.message,
                  field: result.data.updateEmail.field
                });
              } else {
                data.person.emails = result.data.updateEmail.emails;
              }
            } else {
              data.person.emails = result.data.emails;
            }

            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              },
              data
            });
          }
        });

        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      }
    }

    if(cachedPersonQuery.person.addresses.length === 0){
      console.log('ADDRESS LENGTH IS ZERO')
      if(this.state.line1 !== "" && this.state.city !== "" && this.state.state !== "" && this.state.zip !== ""){
        console.log('STATE IN CREATE', this.state)
        client.mutate({
          mutation: AddAddressMutation,
          variables: {
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id,
            line1: this.state.line1,
            line2: this.state.line2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            country: this.state.country
          },
          optimisticResponse: {
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id,
            line1: this.state.line1,
            line2: this.state.line2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            country: this.state.country
          },
          update: (proxy, result) => {

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });

            data.person.addresses[0] = result.data.addAddressTo

            // Write our combined data back to the store cache
            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: cachedPersonQuery.person.id
              },
              data
            });
          }
        })
        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      }
    } else {
      if(cachedPersonQuery.person.addresses[0].line1 !== this.state.line1 || cachedPersonQuery.person.addresses[0].line2 !== this.state.line2 || cachedPersonQuery.person.addresses[0].city !== this.state.city || cachedPersonQuery.person.addresses[0].state !== this.state.state || cachedPersonQuery.person.addresses[0].zip !== this.state.zip || cachedPersonQuery.person.addresses[0].country !== this.state.country){
        client.mutate({
          mutation: UpdateAddressMutation,
          variables: {
            id: cachedPersonQuery.person.addresses[0].id,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id,
            line1: this.state.line1,
            line2: this.state.line2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            country: this.state.country
          },
          optimisticResponse: {
            id: cachedPersonQuery.person.addresses[0].id,
            belongsTo: "Person",
            belongsToId: cachedPersonQuery.person.id,
            line1: this.state.line1,
            line2: this.state.line2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            country: this.state.country
          },
          update: (proxy, result) => {

            // Read data from cache
            const data = proxy.readQuery({
              query: GetPersonQuery,
              variables: {
                id: this.props.person.id
              }
            });

            data.person.addresses[0] = result.data.updateAddress

            // Write our combined data back to the store cache
            proxy.writeQuery({
              query: GetPersonQuery,
              variables: {
                id: cachedPersonQuery.person.id
              },
              data
            });
          }
        })
        // Update the variable
        cachedPersonQuery = client.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });
      }
    }
  }

  popPhone(phone, index) {
    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    console.log('ID OF PHONE', phone.id);

    client.mutate({
      mutation: deletePhoneMutation,
      variables: {
        id: phone.id
      },
      update: (proxy, result) => {
        console.log('DELETE PROXY', proxy);
        console.log('DELETE RESULT', result);

        // Read data from cache
        const data = proxy.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });

        console.log('delete data', data);

        // Combine original query data with mutation result
        if("deletePhone" in result.data){
          if(result.data.deletePhone.success === false){
            this.setState({
              error: result.data.deletePhone.message,
              field: result.data.deletePhone.field
            });
          } else {
            data.person.phones = result.data.deletePhone.phones;
          }
        } else {
          data.person.phones = result.data.phones;
        }

        proxy.writeQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          },
          data
        });
      }
    });
    // Update the variable
    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    const newState = update(this.state, { phones: {$splice: [[this.state.phones.indexOf(phone), 1]]}});

    this.setState(newState, () => {console.log('POP PHONE', this.state)});

  }

  popEmail(email, index) {

    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    console.log('ID OF EMAIL', email.id);

    client.mutate({
      mutation: deleteEmailMutation,
      variables: {
        id: email.id
      },
      update: (proxy, result) => {
        console.log('DELETE PROXY', proxy);
        console.log('DELETE EMAIL', result);

        // Read data from cache
        const data = proxy.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });

        console.log('EMAIL DELETE DATA', data);

        // Combine original query data with mutation result
        if("deleteEmail" in result.data){
          if(result.data.deleteEmail.success === false){
            this.setState({
              error: result.data.deleteEmail.message,
              field: result.data.deleteEmail.field
            });
          } else {
            data.person.emails = result.data.deleteEmail.emails;
          }
        } else {
          data.person.emails = result.data.emails;
        }

        proxy.writeQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          },
          data
        });
      }
    });
    // Update the variable
    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    const newState = update(this.state, { emails: {$splice: [[this.state.emails.indexOf(email), 1]]}});

    this.setState(newState, () => {console.log('POP EMAIL', this.state)});
  }

  appendPhone() {
    let newPhone = [{}];

    this.setState({ phones: this.state.phones.concat(newPhone) });
  }

  appendEmail() {
    let newEmail = [{}];

    this.setState({ emails: this.state.emails.concat(newEmail) });
  }

  handlePhoneChange(index, e) {
    const newPhones = update(this.state, {phones: {[index]: {number: {$set: e.target.value}}}})

    this.setState(newPhones, () => {console.log('HANDLEPHONE', this.state)});
  }

  handleEmailChange(index, e) {
    if(!validator.isEmail(e.target.value)){
      this.setState({field: "email", error: "Enter a valid email.", email: e.target.value})
    }
    const newEmails = update(this.state, {emails: {[index]: {address: {$set: e.target.value}}}})
    newEmails.field = "";
    newEmails.error = "";

    this.setState(newEmails, () => {console.log('HANDLEEMAIL', this.state)});
  }

  render() {

    let nameErrorFirst;
    let nameErrorLast;
    let phoneError;
    let emailError;
    let errorStyles = {
      color: 'red'
    };

    const phone = this.state.phones.map((phone, index) => {
      return <div key={index}>
                <label className="mdl-textfield__label" htmlFor="">Phone</label>
                <InputMask
                  mask="(999) 999-9999"
                  className='form-control'
                  placeholder="Phone"
                  value={this.state.phones[index].number}
                  onChange={(e) => this.handlePhoneChange(index, e)}
                  onBlur={(e) => this.handleBlur(index, e)}
                  type="text"
                  required
                />
                <FlatButton
                  label="Delete Number"
                  onTouchTap={this.popPhone.bind(this, phone)}
                  style={{marginRight: 5}}
                />
             </div>
    })

    const email = this.state.emails.map((email, index) => {
      return <div key={index}>
                <label className="mdl-textfield__label" htmlFor="">Email</label>
                <input
                  className='form-control'
                  placeholder="Email"
                  value={this.state.emails[index].address}
                  onChange={(e) => this.handleEmailChange(index, e)}
                  onBlur={(e) => this.handleBlur(index, e)}
                  type="email"
                  required
                />
                <FlatButton
                  label="Delete Email"
                  onTouchTap={this.popEmail.bind(this, email)}
                  style={{marginRight: 5}}
                />
             </div>
    })

    if(this.props.person.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.person.error) {
      console.log(this.props.person.error);
      return (<div>An unexpected error occurred</div>);
    }

    switch(this.state.field){
      case 'firstName':
        nameErrorFirst = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'lastName':
        nameErrorLast = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'phone':
        phoneError = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case 'email':
        emailError = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        nameErrorFirst = null;
        nameErrorLast = null;
        phoneError = null;
        emailError = null;
    }

    return (

      <div>
        <div className="col-md-12 tabHeader" style={{marginBottom: 15}}>
          <h4 className="tabHeaderText">Details - {this.state.firstName} {this.state.lastName}</h4>
          <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
        </div>

            <div className="form-group">
              <div className="row">
                <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                  <label className="mdl-textfield__label" htmlFor="">First Name </label>
                  <input
                    name='firstName'
                    className='mdl-textfield__input form-control'
                    value={this.state.firstName}
                    onChange={(e) => this.setState({firstName: e.target.value})}
                    onBlur={this.handleBlur}
                    required
                  />
                  {nameErrorFirst}
                </div>
                <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                  <label className="mdl-textfield__label" htmlFor="">Last Name </label>
                  <input
                    name='Last Name'
                    className='mdl-textfield__input form-control'
                    value={this.state.lastName}
                    placeholder='Last Name'
                    onChange={(e) => this.setState({lastName: e.target.value})}
                    onBlur={this.handleBlur}
                    required
                  />
                  {nameErrorLast}
                </div>
              </div>

              <div className="row">
                <LabelInput className={'col-md-6'} label='Address Line 1' name='Line 1' value={this.state.line1} placeholder='Line 1' onChange={(e) => this.setState({line1: e.target.value})} onBlur={this.handleBlur}/>
                <LabelInput className={'col-md-6'} label='Address Line 2 (optional)' name='Line 2' value={this.state.line2} placeholder='Line 2' onChange={(e) => this.setState({line2: e.target.value})} onBlur={this.handleBlur}/>
              </div>

              <div className="row">
                <LabelInput className={'col-md-6'} label='City' name='City' value={this.state.city} placeholder='City' onChange={(e) => this.setState({city: e.target.value})} onBlur={this.handleBlur}/>

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
                      this.setState({ state: data.value }, this.handleBlur)
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
                    onBlur={this.handleBlur}
                  />
                </div>
              </div>

              <div className="row">
                <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                  {phone}
                  {phoneError}
                </div>

                <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                  {email}
                  {emailError}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">

                  <Button style={{marginLeft: 5}} color="teal" content='PHONE' icon='plus' labelPosition='left' onClick={(e, data) => {this.appendPhone()}}/>

                  {/* <RaisedButton
                    labelColor={"#fff"}
                    backgroundColor={" #00B1B3"}
                    label="Phone"
                    onTouchTap={this.appendPhone}
                    icon={<AddIcon />}
                    style={{marginLeft: 5}}
                  /> */}
                </div>
                <div className="col-md-6">
                  <Button style={{marginLeft: 5}} color="teal" content='EMAIL' icon='plus' labelPosition='left' onClick={(e, data) => {this.appendEmail()}}/>

                  {/* <RaisedButton
                    labelColor={"#fff"}
                    backgroundColor={" #00B1B3"}
                    label="Email"
                    onTouchTap={this.appendEmail}
                    icon={<AddIcon />}
                    style={{marginLeft: 5}}
                  /> */}
                </div>
              </div>
            </div>

      </div>
    )
  }
};

const PersonEditFormWithMutation = compose(
  graphql(updatePersonMutation, {
    name: "UpdatePerson",
    options: {
      fetchPolicy: "cache-and-network"
    }
  }),
  graphql(updatePhoneMutation, {
    name: "UpdatePhone",
    options: {
      fetchPolicy: "cache-and-network"
    }
  }),
  graphql(updateEmailMutation, {
    name: "UpdateEmail",
    options: {
      fetchPolicy: "cache-and-network"
    }
  }),
  graphql(createPhoneMutation, { name: "CreatePhone" }),
  graphql(deletePhoneMutation, {
    name: "DeletePhone"
  }),
  graphql(createEmailMutation, { name: "CreateEmail"}),
  graphql(deleteEmailMutation, {
    name: "DeleteEmail"
  }),
  graphql(AddAddressMutation, { name: "AddAddress" }),
  graphql(UpdateAddressMutation, {
    name: "UpdateAddress",
    options: {
      fetchPolicy: "cache-and-network"
    }
  })
  )(withRouter(PersonEditForm));

export default PersonEditFormWithMutation;
