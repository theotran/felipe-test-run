import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import CardSection from './CardSection';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Button } from 'semantic-ui-react'
import { Dropdown } from 'semantic-ui-react';


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

// const createAccountMutation = gql`
//   mutation createAccount($CompanyId: ID, $PlanId: ID, $stripeId: ID) {
//     createAccount (input: {CompanyId: $CompanyId, PlanId: $PlanId, stripeId: $stripeId}) {
//       id
//       leads
//       projects
//       teamUsers
//       customerUsers
//       subUsers
//       dataUsage
//       nonStampSLDUsed
//       nonStampSLD
//       nonStampRevUsed
//       nonStampRev
//       stampSLDUsed
//       stampSLD
//       stampRevUsed
//       stampRev
//       company
//       stripe
//       createdAt
//       updatedAt
//       stripe
//       success
//       message
//       field
//     }
//   }
// `;

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      plan: '',
      billingType: ''
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = (ev) => {
  // We don't want to let default form submission happen here, which would refresh the page.
  // ev.preventDefault();
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
      console.log('planId function', stripePlanId(this.state.plan, this.state.billingType))
      if(token){
        this.props.CreateCustomer({
          variables: {
            source: token.id
          }
        }).then((data) => {
          console.log(data);
          this.props.CreateSubscription({
            variables: {
              customer: data.data.stripeCreateCustomer.stripe.id,
              plan: stripePlanId(this.state.plan, this.state.billingType)
            }
          })
          console.log("MUTATION RESULT", data);
        })
      }
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', owner: {name: 'Jenny Rosen'}});
  }

  render() {
    const formStyle2 = {
      width: '400px'
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        backgroundColor={"#00B1B3"}
        labelColor={"#fff"}
        label="Submit"
        onTouchTap={this.handleSave}
      />
    ];
    return (
    <div className="row">
      <div className="selectPlanButton">
        {/* <Button color='teal' onClick={this.handleOpen}>Select</Button> */}
        <Button color="teal" onClick={this.handleOpen} size="huge">Select a plan</Button>
        {/* <RaisedButton backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD PHONE" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Select a plan"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="">Plan Type</label>
              <Dropdown
                placeholder='Plan Type'
                fluid selection options={[
                   { text: 'Personal', value: 'Personal', },
                   { text: 'Professional', value: 'Professional', },
                   { text: 'Enterprise', value: 'Enterprise', },
                 ]}
                value={this.state.plan ? this.state.plan : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ plan: data.value })
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="">Billing Type</label>
              <Dropdown
                placeholder='Billing Type'
                fluid selection options={[
                   { text: 'Monthly', value: 'Monthly', },
                   { text: 'Annual', value: 'Annual', },
                 ]}
                value={this.state.billingType ? this.state.billingType : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ billingType: data.value }, this.handleBlur)
                }}
              />
            </div>
          </div>
          <div className="row">
            <form onSubmit={this.handleSubmit} style={formStyle2}>
              <CardSection style={formStyle2}/>
            </form>
          </div>
        </Dialog>
      </div>
    </div>
    );
  }
}


const PaymentFormWithMutation = compose(
  graphql(stripeCreateCustomerMutation, {name: "CreateCustomer"}),
  graphql(stripeCreateSubscriptionMutation, {name: "CreateSubscription"})
  )(PaymentForm);

export default injectStripe(PaymentFormWithMutation);
