

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import { Dropdown, Button } from 'semantic-ui-react';
import LabelInput from './../../LabelInput';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const createCostMutation = gql`
  mutation createCost($JobId: ID!, $type: String, $description: String, $amount: Float, $billTo: String, $isPaid: Boolean, $belongsTo: String, $belongsToId: ID) {
    createCost(input: {JobId: $JobId, type: $type, description: $description, amount: $amount, billTo: $billTo, isPaid: $isPaid, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      type
      description
      amount
      billTo
      isPaid
    }
  }
`;

class AddCostModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      type: this.props.type,
      belongsTo: this.props.belongsTo,
      belongsToId: this.props.belongsToId,
      isPaid: false,
      paidOn: {},
      amount: '',
      description: '',
      billTo: '',
      date: moment(Date.now())._d,
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.mutate({variables: {JobId: this.props.JobId, type: this.state.type, isPaid: this.state.isPaid, amount: this.state.amount, description: this.state.description, billTo: this.state.billTo, belongsTo: this.props.belongsTo, belongsToId: this.props.belongsToId}})
      .then((value) => {
        console.log("value", value.data.createCost);
        window.location.reload();
        return value;
      });
  }

  render() {
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
      <div>
        <Button color="teal" content='ADD COST' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        <Dialog
          title={'Add Cost'}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {/* <div className="modal-body"> */}

            <div className='row'>
              <div className='form-group col-md-6'>
                <DatePicker
                  autoOk={true}
                  floatingLabelFixed={true}
                  floatingLabelText="Date (YYYY-MM-DD)"
                  id="2"
                  value={this.state.date}
                  onChange={(e, date) => this.setState({ date: moment(date)._d} )}
                />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-6'>
                <label htmlFor="">Bill To</label>
                <Dropdown
                  placeholder='Select One'
                  fluid selection options={[
                     { text: 'Customer', value: 'Customer', },
                     { text: 'Company', value: 'Company', },
                   ]}
                  value={this.state.billTo}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ billTo: data.value })
                  }}
                />
              </div>
              <LabelInput className="col-md-6"
                label='Amount (No $ or Comma)'
                name='Amount'
                value={this.state.amount}
                placeholder='0.00'
                onChange={(e, key, value) => this.setState({ amount: e.target.value })}
              />

            </div>

            <div className='row'>
              <div className='form-group col-md-12'>
                <label htmlFor="">Description</label>
                <textarea rows="4" className="form-control"
                  value={this.state.description}
                  onChange={(e) => { this.setState({ description: e.target.value })}}
                />
              </div>
            </div>

            {/* <div className='row'>
              <div className='form-group col-md-6'>
                <label htmlFor="">Paid</label>
                <Dropdown
                  placeholder='Select One'
                  fluid selection options={[
                     { text: 'No', value: false, },
                     { text: 'Yes', value: true, }
                   ]}
                  value={this.state.paidOn}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ isPaid: data.value })
                  }}
                />
              </div>
              <div className='form-group col-md-6'>
                <DatePicker
                  autoOk={true}
                  floatingLabelFixed={true}
                  floatingLabelText="Paid On (YYYY-MM-DD)"
                  id="2"
                  value={this.state.paidOn}
                  onChange={(e, date) => this.setState({ paidOn: moment(date)._d})}
                />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-6'>
                <label htmlFor="">Payment Method</label>
                <Dropdown
                  placeholder='Select One'
                  fluid selection options={[
                     { text: 'Credit / Debit Card', value: 'Credit / Debit Card', },
                     { text: 'Cash', value: 'Cash', },
                     { text: 'Check', value: 'Check', }
                   ]}
                  value={this.state.paymentMethod}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ paymentMethod: data.value })
                  }}
                />
              </div>
              <LabelInput className="col-md-6"
                label='Check #'
                name='Check #'
                value={this.state.checkNumber}
                placeholder='000656'
                onChange={(e, key, value) => this.setState({ checkNumber: e.target.value })}
              />
            </div> */}

          {/* </div> */}
        </Dialog>
      </div>
    );
  }
}

const AddCostModalWithMutation = graphql(createCostMutation)(AddCostModal);

export default AddCostModalWithMutation;
