

import React, { Component } from 'react';
import gql from 'graphql-tag';
import client from './../../../index.js';
import AddContractTermMaterial from './AddContractTermMaterial';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import LabelInput from './../../LabelInput';
import GetJobQuery from '../../../queries/GetJobQuery';
import ConversionInput from './ConversionInput';
import { Dropdown } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import FlatButton from 'material-ui/FlatButton';

import update from 'immutability-helper';

const createContractMutation = gql`
  mutation createContract( $JobId: ID!, $amount: Float, $taxId: String, $billingType: String, $startDate: DateTime, $endDate: DateTime, $CustomerId: ID) {
    createContract(input: { JobId: $JobId, amount: $amount, taxId: $taxId, billingType: $billingType, startDate: $startDate, endDate: $endDate, CustomerId: $CustomerId }) {
      id
      amount
      taxId
      billingType
      startDate
      endDate
      terms {
        id
        dueUpon
        amount
        status
      }
      customer{
        id
        firstName
        lastName
      }
    }
  }
`;


const UpdateContractMutation = gql`
  mutation updateContract( $id: ID!, $JobId: ID!, $amount: Float, $taxId: String, $billingType: String, $startDate: DateTime, $endDate: DateTime, $CustomerId: ID) {
    updateContract( id: $id, input: { JobId: $JobId, amount: $amount, taxId: $taxId, billingType: $billingType,  startDate: $startDate, endDate: $endDate, CustomerId: $CustomerId }) {
      id
      amount
      taxId
      billingType
      startDate
      endDate
      terms {
        id
        dueUpon
        amount
        status
      }
      customer{
        id
        firstName
        lastName
      }
    }
  }
`;

const getPeopleQuery = gql`
  query {
    getPeople(group: "Customer", type: "Person"){
      id
      firstName
      lastName
      user {
        id
        username
        password
      }
    }
  }
`;

let cachedJobQuery;

class ContractTab extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    if(this.props.job.contract) {
      this.state = {
        name: this.props.job.name,
        number: this.props.job.number,
        amount: this.props.job.contract.amount ? this.props.job.contract.amount : '',
        taxId: this.props.job.contract.taxId ? this.props.job.contract.taxId : '',
        billingType: this.props.job.contract.billingType ? this.props.job.contract.billingType : '',
        startDate: this.props.job.contract.startDate ? this.props.job.contract.startDate : null,
        endDate: this.props.job.contract.endDate ? this.props.job.contract.endDate : null,
        terms: this.props.job.contract.terms ? this.props.job.contract.terms : [],
        CustomerId: this.props.job.contract.CustomerId ? this.props.job.contract.CustomerId : null,
        controlledDate: this.props.job.contract.startDate ? this.props.job.contract.startDate : null,
      }
    } else {
      this.state = {
        name: this.props.job.name,
        number: this.props.job.number,
        amount: '',
        taxId: '',
        billingType: '',
        startDate: null,
        endDate: null,
        terms: [],
        CustomerId: null,
        controlledDate: null,
      }
    }
  }

  handleBlur() {

    console.log("hit on blur");

    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    console.log('cached job query is: ', cachedJobQuery);

    if(!cachedJobQuery.job.contract) {

      console.log("no contract, creating contract");
      console.log(this.state);
      console.log(this.props);

      client.mutate({
        mutation: createContractMutation,
        variables: {
          JobId: this.props.job.id,
          amount: this.state.amount ? this.state.amount : null,
          taxId: this.state.taxId ? this.state.taxId : null,
          billingType: this.state.billingType ? this.state.billingType : null,
          startDate: this.state.startDate ? this.state.startDate : null,
          endDate: this.state.endDate ? this.state.endDate : null,
          CustomerId: this.state.CustomerId ? this.state.CustomerId : null
        },
        optimisticResponse: {
          id: 'tempContract1',
          amount: this.state.amount,
          taxId: this.state.taxId,
          billingType: this.state.billingType,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          terms: []
        },
        update: (proxy, result) => {
         console.log('PROXY', proxy);

         console.log('RESULT', result);

         // Read the data from our cache for this query.
         const data = proxy.readQuery({
           query: GetJobQuery,
           variables: {
             id: this.props.job.id
           }
         });
         console.log('data', data);
         console.log('onBlur result', result);

         data.job.contract = result.data.createContract;

         console.log('data after adding contract info', data);

         // Write our combined data back to the store cache
         proxy.writeQuery({
           query: GetJobQuery,
           variables: {
             id: this.props.job.id
           },
           data
         });
        }
      });

      //updating the variable after we change it
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id,
        }
      });
    } else {

      if(cachedJobQuery.job.contract && (this.state.amount !== cachedJobQuery.job.contract.amount || this.state.taxId !== cachedJobQuery.job.contract.taxId || this.state.billingType !== cachedJobQuery.job.contract.billingType || this.state.startDate !== cachedJobQuery.job.contract.startDate || this.state.endDate !== cachedJobQuery.job.contract.endDate)) {
        console.log("Update Mutation Hitting");
        client.mutate({
          mutation: UpdateContractMutation,
          variables: {
            id: cachedJobQuery.job.contract.id,
            JobId: this.props.job.id,
            amount: this.state.amount ? this.state.amount : null,
            taxId: this.state.taxId ? this.state.taxId : null,
            billingType: this.state.billingType ? this.state.billingType : null,
            startDate: this.state.startDate ? this.state.startDate : null,
            endDate: this.state.endDate ? this.state.endDate : null,
            CustomerId: this.state.CustomerId ? this.state.CustomerId : null

          },
          optimisticResponse: {
            id: 'tempUpdateContractId',
            amount: this.state.amount,
            taxId: this.state.taxId,
            billingType: this.state.billingType,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: null,
            terms: []
          },
          update: (proxy, result) => {
           console.log('PROXY', proxy);

           console.log('RESULT', result);

           // Read the data from our cache for this query.
           const data = proxy.readQuery({
             query: GetJobQuery,
             variables: {
               id: this.props.job.id
             }
           });
           console.log('data', data);
           console.log('onBlur result', result);

           data.job.contract = result.data.updateContract;

           console.log('data after adding contract info', data);

           // Write our combined data back to the store cache
           proxy.writeQuery({
             query: GetJobQuery,
             variables: {
               id: this.props.job.id
             },
             data
           });

          }
        })
        //end client mutate
        //updating the variable after we change it
        cachedJobQuery = client.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id,
          }
        });
      }
    }

  }

  clearEndDate = () => {
    this.setState({
      endDate: null
    })
    this.handleBlur()
  }

  clearSignedDate = () => {
    this.setState({
      startDate: null
    })
    this.handleBlur()
  }

  handleChange = (key, value) => {

  };

  addTerm = (termInfo) => {

    this.props.CreateTerm({
      variables: termInfo,
      update: (proxy, result) => {
        console.log('PROXY', proxy);

        console.log('RESULT', result);

        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          }
        });
        console.log('data', data);
        console.log('create term result', result);

        data.job.contract.terms.push(result.data.createContractTerm);

        console.log('data after adding contract term', data);

        // Write our combined data back to the store cache
        proxy.writeQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          },
          data
        });
      }
    })
    .then((value) => {
      console.log(value)
      let newData = update(this.state, {
        terms: {$push: [value.data.createContractTerm]}
      });
      this.setState(newData, console.log(this.state))//passing an entire new state
      return value;
    });

  }

  render() {
    console.log(this.state.terms)
    if(this.props.data.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
        );
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }
    // let contracteeDropdown = null;
    // if(this.props.data.getPeople){
    //   contracteeDropdown = (()=>{
    //     return (
    //       <Dropdown
    //         placeholder='Customer Name'
    //         fluid selection options={this.props.data.getPeople.map((person, index) => {
    //           return {
    //             key: person.id,
    //             text: person.firstName + " " + person.lastName,
    //             value: person.id
    //           }
    //         })}
    //         value={this.state.CustomerId ? this.state.CustomerId : ''}
    //         onChange={(e, data) => {
    //           console.log("VALUE IN DROPDOWN ", data)
    //           this.setState({ CustomerId: data.value }, this.handleBlur)
    //         }}
    //       />
    //     )
    //   })();
    // }
    return (
      <div className="panel panel-default">
          <div className="panel-body">
            {/* <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">CUSTOMER INFO</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Contract_Icon_p.svg' height="30"/>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="">**Customer Name**</label>
                {contracteeDropdown}
              </div>
            </div>
            <div className="row">
            <div className="col-md-5 form-group">
                <label>**Customer Phone**</label>
               <input
                  name='Customer Phone'
                  className="form-control"
                  value={this.state.customerPhone ? this.state.customerPhone: ''}
                  placeholder='(***) ***-****'
                  onChange={(e) => this.setState({ customerPhone: e.target.value })}
                  onBlur={this.handleBlur}
                  readOnly
                />
            </div>
            <div className="col-md-1 form-group">
              <label>Add</label>
              <Button color='teal' onClick={this.handleOpen}>+</Button>
            </div>

            <div className="col-md-5 form-group">
                <label>**Customer Email**</label>
               <input
                  name='Customer Email'
                  className="form-control"
                  value={this.state.customerEmail ? this.state.customerEmail: ''}
                  placeholder='you@email.com'
                  onChange={(e) => this.setState({ customerEmail: e.target.value })}
                  onBlur={this.handleBlur}
                  readOnly
                />
            </div>
            <div className="col-md-1 form-group">
              <label>Add</label>
              <Button color='teal' onClick={this.handleOpen}>+</Button>
            </div>
          </div> */}
{/* <br /><br /> */}
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">CONTRACT INFO</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Contract_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              <LabelInput className={'col-md-6'} label='Tax ID' name='TaxId' value={this.state.taxId} placeholder='Tax ID' onChange={(e) => this.setState({taxId: e.target.value})} onBlur={this.handleBlur}/>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="">Billing Type</label>
                <Dropdown
                  placeholder='Billing Type'
                  fluid selection options={[
                     { text: 'Fee', value: 'Fee',},
                     { text: 'Hourly', value: 'Hourly',},
                     { text: 'Other', value: 'Other',},
                   ]}
                  value={this.state.billingType ? this.state.billingType : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ billingType: data.value }, this.handleBlur)
                  }}
                />
              </div>
               <div className="col-md-6 form-group">
                <label>Contract Amount (No $ or Commas)</label>
               <input
                  name='Contract Amount'
                  className="form-control"
                  value={this.state.amount ? this.state.amount: ''}
                  placeholder='32909.08'
                  onChange={(e) => this.setState({ amount: e.target.value })}
                  onBlur={this.handleBlur}
                  type="number"
                />
            </div>
            </div>
            {/* <div className="row">
              <div className="col-md-6 form-group">
                <p>IF HOURLY</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label>**Hour Estimate**</label>
               <input
                  name='Hour Estimate'
                  className="form-control"
                  value={this.state.hourEstimate ? this.state.hourEstimate: ''}
                  placeholder='80'
                  onChange={(e) => this.setState({ hourEstimate: e.target.value })}
                  onBlur={this.handleBlur}
                />
              </div>
            </div> */}
            <div className="row">
            <div className="form-group col-md-6">
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Contract Signed Date" id="1" value={this.state.startDate ? moment(this.state.startDate)._d : {}} onChange={(e, date) => this.setState({ startDate: moment(date)._d}, this.handleBlur)} />

              <Button onClick={this.clearSignedDate}>CLEAR DATE</Button>
            </div>
            <div className="form-group col-md-6">
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Project Complete Date" id="2" value={this.state.endDate ? moment(this.state.endDate)._d : {}} onChange={(e, date) => this.setState({ endDate: moment(date)._d}, this.handleBlur)} />
              <Button onClick={this.clearEndDate}>CLEAR DATE</Button>
            </div>
            </div>
<br /> <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">CONTRACT TERMS</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Contract_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>

            <div className="row">
              {
                this.state.terms ? this.state.terms.map((term, index) => {
                    console.log("term in map", term)
                    return (
                      <div key={index}>
                        <ConversionInput job={this.props.job} contractAmount={this.state.amount} term={term}/>
                      </div>
                    )
                  }) : <div className="comm-jobs-message">No terms to display</div>
              }
            </div>
<br /><br />
            <div className="row">
              <div className="col-md-3">
                <AddContractTermMaterial addTerm={this.addTerm} contractAmount={this.state.amount} job={this.props.job}/>
                </div>
            </div>

        </div>
      </div>
    )
  }
}

const CreateContractTermMutation = gql`
  mutation createContractTerm( $dueUpon: String, $amount: Float, $status: String, $ContractId: ID! ) {
    createContractTerm( input: { dueUpon: $dueUpon, amount: $amount, status: $status, ContractId: $ContractId } ) {
      id
      dueUpon
      amount
      status
      __typename
    }
  }
`;

const ContractTabWithData = compose(
  graphql(getPeopleQuery),
  graphql(CreateContractTermMutation, { name: "CreateTerm" }),
  )(ContractTab);

export default ContractTabWithData;
