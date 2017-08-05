

import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import LabelInput from './../../LabelInput';
import { Dropdown } from 'semantic-ui-react';
import client from './../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';
import gql from 'graphql-tag';

let cachedJobQuery;

const UpdatePaymentMutation = gql`
  mutation updatePayment($id: ID, $amount: String, $description: String, $method: String, $number: String, $receivedBy: String, $receivedDate: DateTime) {
    updatePayment(input: {id: $id, amount: $amount, description: $description, method: $method, number: $number, receivedBy: $receivedBy, receivedDate: $receivedDate}) {
      id
      amount
      description
      method
      number
      receivedBy
      receivedDate
    }
  }
`;

class PaymentDisplay extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      paymentId: this.props.payment.id,
      amount: this.props.payment.amount,
      description: this.props.payment.description,
      method: this.props.payment.method,
      number: this.props.payment.number,
      receivedBy: this.props.payment.receivedBy,
      receivedDate: this.props.payment.receivedDate,
      paymentKey: this.props.paymentKey
    }
  }

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.JobId
      }
    });

    const cachedIndex = cachedJobQuery.job.payments[this.state.paymentKey];

    if(cachedIndex.amount !== this.state.amount || cachedIndex.description !== this.state.description || cachedIndex.method !== this.state.method || cachedIndex.number !== this.state.number || cachedIndex.receivedBy !== this.state.receivedBy || cachedIndex.receivedDate !== this.state.receivedDate) {

      client.mutate({
        mutation: UpdatePaymentMutation,
        variables: {
          id: this.state.paymentId,
          amount: this.state.amount,
          description: this.state.description,
          method: this.state.method,
          number: this.state.number,
          receivedBy: this.state.receivedBy,
          receivedDate: this.state.receivedDate
        },
        optimisticResponse: {
          id: this.state.paymentId,
          amount: this.state.amount,
          description: this.state.description,
          method: this.state.method,
          number: this.state.number,
          receivedBy: this.state.receivedBy,
          receivedDate: this.state.receivedDate
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

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={'Invoice # ' + this.state.number}
          subtitle={"Payment Amount : $" + this.state.amount}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className='row'>
            <div className='col-md-6'>
              <DatePicker
                autoOk={true}
                floatingLabelFixed={true}
                floatingLabelText="Payment Date Paid (YYYY-MM-DD)"
                id="2"
                value={this.state.receivedDate ? moment(this.state.receivedDate)._d : {}}
                onChange={(e, date) => this.setState({ receivedDate: moment(date)._d}, this.handleBlur)}
              />
            </div>
          </div>

          <div className='row'>
            <LabelInput className="col-md-6"
              label='Invoice Number'
              name='Invoice Number'
              value={this.state.number}
              placeholder='Invoice Number'
              onChange={(e) => this.setState({number: e.target.value})}
              onBlur={this.handleBlur}
            />
            <LabelInput className="col-md-6"
              label='Amount'
              name='Amount'
              value={this.state.amount}
              placeholder='0.00'
              onChange={(e) => this.setState({amount: e.target.value})}
              onBlur={this.handleBlur}
            />
          </div>

          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor="">Payment Method</label>
              <Dropdown
                placeholder='Select One'
                fluid selection options={[
                  { text: 'Cash', value: 'Cash' },
                  { text: 'Check', value: 'Check' },
                  { text: 'Credit Card', value: 'Credit Card' },
                ]}
                value={this.state.method ? this.state.method : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ method: data.value }, this.handleBlur)
                }}
              />
            </div>
            <LabelInput className="col-md-6"
              label='Received By'
              name='Received By'
              value={this.state.receivedBy}
              placeholder='Received By'
              onChange={(e) => this.setState({receivedBy: e.target.value})}
              onBlur={this.handleBlur}
            />
          </div>

          <div className='row'>
            <div className='form-group col-md-12'>
              <label htmlFor="">Payment Memo (250 Character Limit)</label>
              <textarea rows="4" className="form-control"
                value={this.state.description}
                onChange={(e) => { this.setState({ description: e.target.value })}}
                onBlur={this.handleBlur}
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

export default PaymentDisplay;
