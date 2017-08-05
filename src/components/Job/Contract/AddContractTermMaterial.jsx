

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Dropdown, Button } from 'semantic-ui-react';

class AddContractTermModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      dueUpon: '',
      amount: 0,
      status: '',
      contractAmount: this.props.contractAmount ? this.props.contractAmount : '',
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.CreateContractTerm({variables: { dueUpon: this.state.dueUpon, amount: this.state.amount, status: this.state.status, ContractId: this.props.job.contract.id }})
    //   .then((value) => {
    //     console.log(value)
    //
    //     return value;
    //   });
    this.props.addTerm({
      dueUpon: this.state.dueUpon,
      amount: this.state.amount,
      status: this.state.status,
      ContractId: this.props.job.contract.id
    });
    this.setState({
      dueUpon: '',
      amount: 0,
      status: '',
    }, this.handleClose());
  }

  render() {
    console.log("CONTACT TERM MODALS STATE ", this.state.contractAmount)
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        backgroundColor={"#00B1B3"}
        labelColor={"#fff"}
        label="Add Term"
        onTouchTap={this.handleSave}
      />
    ];

    let button;
    if(this.props.contractAmount) {
      // button = <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD ANOTHER TERM" onTouchTap={this.handleOpen} />;
      button = <Button color="teal" content='ADD ANOTHER TERM' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
    } else {
      button = <Button color="teal" content='ADD ANOTHER TERM' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} disabled/>
    }

    return (
      <div>
        {button}
        <Dialog
          title="Add Contract Term"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="">Due Upon</label>
                <Dropdown
                  placeholder='Due Upon'
                  fluid selection options={[
                     { text: 'Contract Signed', value: 'Contract Signed', },
                     { text: 'Site Inspection Complete', value: 'Site Inspection Complete', },
                     { text: '30% Drawings', value: '30% Drawings', },
                     { text: '60% Drawings', value: '60% Drawings', },
                     { text: 'Utility Submittal', value: 'Utility Submittal', },
                     { text: 'Utility RFC Approval', value: 'Utility RFC Approval', },
                     { text: 'Utility Cond. Approval', value: 'Utility Cond. Approval', },
                     { text: 'Utility WVT Approval', value: 'Utility WVT Approval', },
                     { text: 'DPP IBPN', value: 'DPP IBPN', },
                     { text: 'DPP Permit Received', value: 'DPP Permit Received', },
                     { text: 'DPP Permit Closed', value: 'DPP Permit Closed', },
                     { text: 'Start Construction', value: 'Start Construction', },
                     { text: '25% Construction', value: '25% Construction', },
                     { text: '50% Construction', value: '50% Construction', },
                     { text: '75% Construction', value: '75% Construction', },
                     { text: '100% Construction', value: '100% Construction', },
                     { text: 'As-Builts Complete', value: 'As-Builts Complete', },
                     { text: 'Other', value: 'Other', },
                  ]}
                  value={this.state.dueUpon ? this.state.dueUpon : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ dueUpon: data.value }, this.handleBlur)
                  }}
                />
              </div>

              <div className="form-group col-md-6">
                  <label>Amount (No $ or Commas)</label>
                  <input
                    type="number"
                    name="Amount"
                    className='form-control'
                    value={this.state.amount}
                    placeholder=""
                    onChange={(e) => this.setState({amount: parseFloat(e.target.value)})}
                  />
              </div>
            </div>

        </Dialog>
      </div>
    );
  }
}

const CreateContractTermMutation = gql`
  mutation createContractTerm( $dueUpon: String, $amount: Float, $status: String, $ContractId: ID! ) {
    createContractTerm( input: { dueUpon: $dueUpon, amount: $amount, status: $status, ContractId: $ContractId } ) {
      id
      dueUpon
      amount
      status
    }
  }
`;



const AddContractTermModalWithGraphQL = compose(
  graphql(CreateContractTermMutation, {
    name: "CreateContractTerm"
  })
)(AddContractTermModal);

export default AddContractTermModalWithGraphQL;
