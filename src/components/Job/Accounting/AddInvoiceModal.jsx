

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import { Dropdown, Button } from 'semantic-ui-react';
import LabelInput from './../../LabelInput';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const createInvoiceMutation = gql`
  mutation createInvoice($JobId: ID, $number: String, $type: String, $amount: Float, $date: DateTime, $due: DateTime, $description: String) {
    createInvoice(input: {JobId: $JobId, number: $number, type: $type, amount: $amount, date: $date, due: $due, description: $description}) {
      id
      number
      type
      date
      due
      description
    }
  }
`;

class AddInvoiceModal extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)

    this.state = {
      open: false,
      date: moment(Date.now()),
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.mutate({variables: {JobId: this.props.JobId, type: this.state.type, number: this.state.number, amount: this.state.amount, date: this.state.date, due: this.state.due, description: this.state.description}})
      .then((value) => {
        console.log("value", value.data.createInvoice);
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

    let typeOther;
    if (this.state.type === 'Other') {
      typeOther = <div className='row'>
                    <LabelInput className="col-md-12"
                      label='Description'
                      name='Description'
                      value={this.state.description}
                      placeholder='Description'
                      onChange={(e) => this.setState({description: e.target.value})}
                    />
                  </div>
    }

    return (
      <div>
        <div className='row'>
        <Button color="teal" content='ADD INVOICE REQUEST' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        </div>
        <Dialog
          title="Add Invoice Request"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
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
              <div className='col-md-6'>
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
            <div className="row">
              <LabelInput className="col-md-6"
                label='Invoice Number'
                name='Invoice'
                value={this.state.number}
                placeholder='123456'
                onChange={(e) => this.setState({number: e.target.value})}
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
              {typeOther}
            </div>
            <div className='row'>
              <LabelInput className="col-md-12"
                label='Amount (No $ or Comma)'
                name='Amount'
                value={this.state.amount}
                placeholder='0.00'
                onChange={(e) => this.setState({amount: e.target.value})}
              />
            </div>

          </div>
        </Dialog>
      </div>
    );
  }
}

const AddInvoiceWithMutation = graphql(createInvoiceMutation)(AddInvoiceModal);

export default AddInvoiceWithMutation;
