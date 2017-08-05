

import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import { Dropdown } from 'semantic-ui-react';
import LabelInput from './../../LabelInput';
import client from './../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';
import gql from 'graphql-tag';

let cachedJobQuery;

const UpdateInvoiceMutation = gql`
  mutation updateInvoice($id: ID, $amount: Float, $date: DateTime, $description: String, $due: DateTime, $number: String, $type: String) {
    updateInvoice(input: {id: $id, amount: $amount, date: $date, description: $description, due: $due, number: $number, type: $type}) {
      id
      amount
      date
      description
      due
      number
      type
    }
  }
`;

class InvoiceDisplay extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      invoiceId: this.props.invoice.id,
      amount: this.props.invoice.amount,
      date: this.props.invoice.date,
      description: this.props.invoice.description,
      due: this.props.invoice.due,
      number: this.props.invoice.number,
      type: this.props.invoice.type,
      invoiceKey: this.props.invoiceKey,
    }
  }

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.JobId
      }
    });

    const cachedIndex = cachedJobQuery.job.invoices[this.state.invoiceKey];

    if(cachedIndex.date !== this.state.date || cachedIndex.amount !== this.state.amount || cachedIndex.description !== this.state.description || cachedIndex.due !== this.state.due || cachedIndex.number !== this.state.number || cachedIndex.type !== this.state.type) {

      client.mutate({
        mutation: UpdateInvoiceMutation,
        variables: {
          id: this.state.invoiceId,
          date: this.state.date,
          amount: this.state.amount,
          description: this.state.description,
          due: this.state.due,
          number: this.state.number,
          type: this.state.type
        },
        optimisticResponse: {
          id: this.state.invoiceId,
          date: this.state.date,
          amount: this.state.amount,
          description: this.state.description,
          due: this.state.due,
          number: this.state.number,
          type: this.state.type
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            }
          });

          console.log("proxy", proxy);
          console.log("result", result);
          console.log("data", data);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.JobId
        }
      });
      console.log(cachedJobQuery)
    }
  }

  render() {
    // if(this.props.data.loading) {
    //   return (<div>Loading</div>);
    // }
    //
    // if(this.props.data.error) {
    //   console.log(this.props.job.error);
    //   return (<div>An unexpected error occurred</div>);
    // }

    let typeOther;
    if (this.state.type === 'Other') {
      typeOther = <div className='row'>
                    <LabelInput className="col-md-12"
                      label='Description'
                      name='Description'
                      value={this.state.description}
                      placeholder='Description'
                      onChange={(e) => this.setState({description: e.target.value})}
                      onBlur={this.handleBlur}
                    />
                  </div>
    }

    return (

      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={'Invoice # ' + this.state.number}
          subtitle={"Amount : " + this.state.amount}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className='row'>
            <div className='form-group col-md-6'>
              <DatePicker
                autoOk={true}
                floatingLabelFixed={true}
                floatingLabelText="Date Sent (YYYY-MM-DD)"
                id="2"
                value={this.state.date ? moment(this.state.date)._d : {}}
                onChange={(e, date) => this.setState({ date: moment(date)._d}, this.handleBlur)}
              />
            </div>
            <LabelInput className="col-md-6"
              label='Invoice Number'
              name='Invoice'
              value={this.state.number}
              placeholder='123456'
              onChange={(e) => this.setState({number: e.target.value})}
              onBlur={this.handleBlur}
            />
          </div>
          <div className='row'>
            <div className="form-group col-md-12">
              <label htmlFor="">Request For</label>
              <Dropdown
                placeholder='Select One'
                fluid selection options={[
                   { text: 'Deposit', value: 'Deposit' },
                   { text: 'Contract Signed', value: 'Contract Signed', },
                   { text: 'Site Inspection Complete', value: 'Site Inspection Complete', },
                   { text: 'Start Drawings', value: 'Start Drawings', },
                   { text: '30% Drawings', value: '30% Drawings', },
                   { text: '60% Drawings', value: '60% Drawings', },
                   { text: '90% Drawings', value: '90% Drawings', },
                   { text: 'IFC Drawings', value: 'IFC Drawings', },
                   { text: 'As-Built Drawings', value: 'As-Built Drawings', },
                   { text: 'Electrical Engineering Approval', value: 'Electrical Engineering Approval', },
                   { text: 'Structural Engineering Approval', value: 'Structural Engineering Approval', },
                   { text: 'Civil Engineering Approval', value: 'Civil Engineering Approval', },
                   { text: 'Utility Submittal', value: 'Utility Submittal', },
                   { text: 'Utility Approved to Build', value: 'Utility Approved to Build', },
                   { text: 'Utility Closeout', value: 'Utility Closeout', },
                   { text: 'Permit Submittal', value: 'Permit Submittal', },
                   { text: 'Permit Received', value: 'Permit Received', },
                   { text: 'Permit Closeout', value: 'Permit Closeout', },
                   { text: 'Material Purchase', value: 'Material Purchase', },
                   { text: 'Material Delivery to Site', value: 'Material Delivery to Site', },
                   { text: 'Start Electrical Work', value: 'Start Electrical Work', },
                   { text: '25% Electrical Work', value: '25% Electrical Work', },
                   { text: '50% Electrical Work', value: '50% Electrical Work', },
                   { text: '75% Electrical Work', value: '75% Electrical Work', },
                   { text: 'Mechanical Work Complete', value: 'Mechanical Work Complete', },
                   { text: 'Start Construction', value: 'Start Construction', },
                   { text: '25% Construction', value: '25% Construction', },
                   { text: '50% Construction', value: '50% Construction', },
                   { text: '75% Construction', value: '75% Construction', },
                   { text: 'Construction Complete', value: 'Construction Complete', },
                   { text: 'Monitoring Setup', value: 'Monitoring Setup', },
                   { text: 'Other', value: 'Other', },
                 ]}
                value={this.state.type ? this.state.type : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ type: data.value }, this.handleBlur)
                }}
              />
            </div>
          </div>
          <div className='row'>
            <LabelInput className="col-md-12"
              label='Amount (No $ or Comma)'
              name='Amount'
              value={this.state.amount}
              placeholder='0.00'
              onChange={(e) => this.setState({amount: e.target.value})}
              onBlur={this.handleBlur}
            />
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <DatePicker
                autoOk={true}
                floatingLabelFixed={true}
                floatingLabelText="Due On (YYYY-MM-DD)"
                id="2"
                value={this.state.due ? moment(this.state.due)._d : {}}
                onChange={(e, date) => this.setState({ due: moment(date)._d}, this.handleBlur)}
              />
            </div>
          </div>
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    )
  }
}

export default InvoiceDisplay;
