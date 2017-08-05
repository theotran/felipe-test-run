

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import LabelInput from './../../LabelInput';
import { Dropdown, Button } from 'semantic-ui-react';

const createPaymentMutation = gql`
  mutation createPayment( $JobId: ID, $number: String, $method: String, $description: String, $amount: String, $receivedDate: DateTime, $receivedBy: String ) {
    createPayment(input: { JobId: $JobId, number: $number, method: $method, description: $description, amount: $amount, receivedDate: $receivedDate, receivedBy: $receivedBy }) {
      id
      amount
      receivedDate
      number
      method
      receivedBy
      description
    }
  }
`;

class AddPayment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      JobId: this.props.jobId
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.mutate({variables: {JobId: this.props.JobId, number: this.state.number, method: this.state.method, description: this.state.description, amount: this.state.amount, receivedDate: this.state.receivedDate, receivedBy: this.state.receivedBy}})
      .then((value) => {
        console.log("value", value.data.createPayment);
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
        <div className='row'>
        <Button color="teal" content='ADD PAYMENT' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        </div>
        <Dialog
          title="Add Payment"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
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
              />
              <LabelInput className="col-md-6"
                label='Amount'
                name='Amount'
                value={this.state.amount}
                type='number'
                placeholder='0.00'
                onChange={(e) => this.setState({amount: e.target.value})}
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
              />
            </div>

            <div className='row'>
              <div className='form-group col-md-12'>
                <label htmlFor="">Payment Memo (250 Character Limit)</label>
                <textarea rows="4" className="form-control"
                  value={this.state.description}
                  onChange={(e) => { this.setState({ description: e.target.value })}}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddPaymentWithMutation = graphql(createPaymentMutation)(AddPayment);

// export default AddPayment;

export default AddPaymentWithMutation;
