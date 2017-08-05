import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react'
import { Dropdown } from 'semantic-ui-react';

import {StripeProvider} from 'react-stripe-elements';
import PaymentBox from './PaymentBox';
import scriptLoader from 'react-async-script-loader';

const submitStripeTokenMutation = gql`
  mutation submitStripeToken ($token: String) {
    submitStripeToken (input: {token: $token}) {
      success
      message
      field
    }
  }
`;
class AddPlanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      plan: '',
      billingType: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {

  }

  render() {
    const formStyle = {
      width: '100%'
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
        <Button centered color="teal" onClick={this.handleOpen} size="huge">Select a plan</Button>
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

          </div>
        </Dialog>
      </div>
    </div>
    );
  }
}



export default AddPlanModal;
