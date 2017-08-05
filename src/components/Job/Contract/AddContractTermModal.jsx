

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class AddContractTermModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dueUpon: '',
      amount: '',
      status: ''
    }
  }

  render() {
    return (

      <div id="addContractTermModal" className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Add Contract Term</h4>
            </div>

            <div className="modal-body">

              <div className="row">
                <div className="form-group col-md-6">
                  <SelectField
                   floatingLabelText="Due Upon"
                   floatingLabelFixed={true}
                   value={this.state.dueUpon}
                   onChange={(e, key, value) => this.setState({ dueUpon: value })}
                  >
                    <MenuItem value="Contract Signed"primaryText="Contract Signed"></MenuItem>
                    <MenuItem value="Site Inspection Complete"primaryText="Site Inspection Complete"></MenuItem>
                    <MenuItem value="30% Drawings"primaryText="30% Drawings"></MenuItem>
                    <MenuItem value="60% Drawings"primaryText="60% Drawings"></MenuItem>
                    <MenuItem value="Utility Submittal"primaryText="Utility Submittal"></MenuItem>
                    <MenuItem value="Utility RFC Approval"primaryText="Utility RFC Approval"></MenuItem>
                    <MenuItem value="Utility Cond. Approval"primaryText="Utility Cond. Approval"></MenuItem>
                    <MenuItem value="Utility WVT Approval"primaryText="Utility WVT Approval"></MenuItem>
                    <MenuItem value="DPP IBPN"primaryText="DPP IBPN"></MenuItem>
                    <MenuItem value="DPP Permit Received"primaryText="DPP Permit Received"></MenuItem>
                    <MenuItem value="DPP Permit Closed"primaryText="DPP Permit Closed"></MenuItem>
                    <MenuItem value="Start Construction"primaryText="Start Construction"></MenuItem>
                    <MenuItem value="25% Construction"primaryText="25% Construction"></MenuItem>
                    <MenuItem value="50% Construction"primaryText="50% Construction"></MenuItem>
                    <MenuItem value="75% Construction"primaryText="75% Construction"></MenuItem>
                    <MenuItem value="100% Construction"primaryText="100% Construction"></MenuItem>
                    <MenuItem value="As-Builts Complete"primaryText="As-Builts Complete"></MenuItem>
                    <MenuItem value="Other"primaryText="Other"></MenuItem>
                  </SelectField>
                </div>



                <div className="form-group col-md-6">
                    <label>Amount</label>
                    <input
                      name="Amount"
                      className='form-control'
                      value={this.state.amount}
                      placeholder=""
                      onChange={(e) => this.setState({amount: e.target.value})}
                    />
                </div>
              </div>

              <div className="row">

                <div className="form-group col-md-6">
                    <label>Status</label>
                    <input
                      name="Status"
                      className='form-control'
                      value={this.state.status}
                      placeholder=""
                      onChange={(e) => this.setState({status: e.target.value})}
                    />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button className="btn btn-default" onClick={this.handleSave} data-dismiss="modal">Save</button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  handleSave = () => {
    this.props.CreateContractTerm({variables: { dueUpon: this.state.dueUpon, amount: this.state.amount, status: this.state.status, ContractId: this.props.job.contract.id }})
      .then((value) => {
        console.log(value)
        // browserHistory.push(`/commercial/project/${this.props.job.id}/contract`);
        window.location.reload();
        return value;
      });
  }

  handleCancel = () => {
    this.props.router.replace('/')
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
