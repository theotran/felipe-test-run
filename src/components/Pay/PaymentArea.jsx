import React, { Component } from 'react';
import {injectStripe} from 'react-stripe-elements';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddressSection from './AddressSection';
import CardSection from './CardSection';

import { Dropdown, Button } from 'semantic-ui-react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const stripeCreateCustomerMutation = gql`
  mutation stripeCreateCustomer($source: ID) {
    stripeCreateCustomer (input: {source: $source}) {
      stripe
      success
      message
      object
    }
  }
`;

const stripeCreateSubscriptionMutation = gql`
  mutation stripeCreateSubscription($customer: ID, $plan: ID) {
    stripeCreateSubscription (input: {customer: $customer, plan: $plan}) {
      stripe
      success
      message
      object
    }
  }
`;

class PaymentArea extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      // plan: '',
      // billingType: '',
    }
  }




  handleSave = (ev) => {

  console.log("stripe is", this.props.stripe);

  function stripePlanId(name, interval){
    switch((name+interval).toLowerCase()){
        // test plan
        case "startermonthly":
            return "1000-101";
        case "starterannual":
            return "1000-201";
        // livemode plans
        case "personalmonthly":
            return "1002";
        case "personalannual":
            return "1003";
        case "professionalmonthly":
            return "2002";
        case "professionalannual":
            return "2003";
        case "enterprisemonthly":
            return "3002";
        case "enterpriseannual":
            return "3003";
        default:
            return null;
    }
  }
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken().then(({token}) => {
      console.log('Received Stripe token:', token);
      if(token){
        this.props.CreateCustomer({
          variables: {
            source: token.id
          }
        }).then((data) => {
          console.log("STRIPEDATA", data);
          let acctData = {customerId: data.data.stripeCreateCustomer.stripe.id, planId: stripePlanId(this.state.plan, this.state.billingType)};
          this.props.CreateSubscription({
            variables: {
              customer: data.data.stripeCreateCustomer.stripe.id,
              plan: stripePlanId(this.state.plan, this.state.billingType)
            }
          }).then((subscription)=>{
            console.log("STRIPESUBSCRIPTION", subscription);
            if(subscription.data.stripeCreateSubscription.success){
              return acctData;
            }
          }).then((val) => {
            this.props.handleSubmit(ev, val);
          });
          console.log("MUTATION RESULT", data);
        })
      }
    })

  }

  render() {

    console.log("payment areas props ", this.props)
    const formStyle2 = {
      width: '400px'
    }

    return (
      <div>
            {/* <div className="row">
              <div className="form-group col-md-6">
                <label className="stripelabel" htmlFor="">Plan Type</label>
                <Dropdown
                  placeholder='Plan Type'
                  fluid selection options={[
                     { text: 'Starter', value: 'Starter', },
                     { text: 'Personal', value: 'Personal', },
                     { text: 'Professional', value: 'Professional', },
                     { text: 'Enterprise', value: 'Enterprise', },
                   ]}
                  value={this.state.plan ? this.state.plan : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    // this.handleChange(data.value, this.props.billingType)
                    this.setState({ plan: data.value })
                  }}
                />
              </div>
              <div className="form-group col-md-6">
                <label className="stripelabel" htmlFor="">Billing Type</label>
                <Dropdown
                  placeholder='Billing Type'
                  fluid selection options={[
                     { text: 'Monthly', value: 'Monthly', },
                     { text: 'Annual', value: 'Annual', },
                   ]}
                  value={this.state.billingType ? this.state.billingType : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ billingType: data.value})
                  }}
                />
              </div>
            </div> */}
            <div className="row">
                <CardSection />
              <Button color="teal" onClick={this.handleSave}>Submit</Button>
            </div>
      </div>
    );
  }
}


const PaymentAreaWithMutation = compose(
  graphql(stripeCreateCustomerMutation, {name: "CreateCustomer"}),
  graphql(stripeCreateSubscriptionMutation, {name: "CreateSubscription"})
)(PaymentArea);

export default injectStripe(PaymentAreaWithMutation);
