import React, { Component } from 'react';
import LabelInput from './../../LabelInput';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const CreateInterconnectionMutation = gql`
  mutation createInterconnection( $DesignId: ID!, $reviewStartDate: DateTime, $number: String, $inHouse: Boolean, $conditionalDate: DateTime, $executedDate: DateTime, $ManagerId: ID, $ProgramID: ID, $UtilityId: ID ) {
    createInterconnection(input: {DesignId: $DesignId, reviewStartDate: $reviewStartDate, number: $number, inHouse: $inHouse, conditionalDate: $conditionalDate, executedDate: $executedDate, ManagerId: $ManagerId, ProgramId: $ProgramId, UtilityId: $UtilityId}) {
      id
      reviewStartDate
      number
      inHouse
      conditionalDate
      executedDate
      Manager { 
        id
        firstName
        lastName
      }
      Program {
        id
      }
      Utility {
        id
      }
    }
  }
`;

const UpdateInterconnectionMutation = gql`
  mutation updateInterconnection( $id: ID!, $reviewStartDate: DateTime, $number: String, $inHouse: Boolean, $conditionalDate: DateTime, $executedDate: DateTime, $ManagerId: ID, $ProgramId: ID, $UtilityId: ID  ) {
    updateInterconnection(input: {id: $id, reviewStartDate: $reviewStartDate, number: $number, inHouse: $inHouse, conditionalDate: $conditionalDate, executedDate: $executedDate, ManagerId: $ManagerId, ProgramId: $ProgramId, UtilityId: $UtilityId}) {
      id
      reviewStartDate
      number
      inHouse
      conditionalDate
      executedDate
      Manager {
        id
        firstName
        lastName
      }
      Program {
        id
      }
      Utility {
        id
      }
    }
  }
`;

class UtilityInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // inHouseInstallManager:
      // subcontractedInstallManager
      // utilityCompany
      // interconnectionType
      // circuitCheckPerformed
      // utilityAgreementNumber
      // circuitPenitration
      // circuitCheckDate
      // utilityPreApproval
      // dueNoLaterThan
      // costBilledTo326
      // costPaidForBy326
      // inspectionRequestedOn
      // inspectionDate
      // inspectionTime
      // executedAgreementDate
    }
  }

  handleBlur() {
    if (this.props.job.name !== this.state.name || this.props.job.number !== this.state.number || this.props.job.type !== this.state.type || this.props.job.status !== this.state.status){
      this.props.JobUpdateMutation({
        variables: {
          id: this.props.job.id,
          name: this.state.name,
          number: this.state.number,
          type: this.state.type,
          status: this.state.status
        }
      });
    }

    if(this.props.job.site.parcelNumber !== this.state.parcelNumber || this.props.job.site.sunHours !== this.state.sunHours) {
      this.props.UpdateSite({
        variables: {
          id: this.props.job.site.id,
          type: "JobSite",
          number: this.state.parcelNumber,
          sunHours: this.state.sunHours,
        }
      });
    }
  }

  // render() {
  //   return (
  //     <div className='panel-body'>
  //
  //       <div className="panel panel-default">
  //
  //         <div className="row">
  //           <div className="form-group col-md-6">
  //             <SelectField
  //              floatingLabelText="In-House Installation Manager"
  //              floatingLabelFixed={true}
  //              value={this.state.inHouseInstallManager}
  //              onChange={(e, key, value) => this.setState({ inHouseInstallManager: value }, this.handleBlur)}
  //             >
  //               <MenuItem value="Install Manager 1"primaryText="Install Manager 1"></MenuItem>
  //               <MenuItem value="Install Manager 2"primaryText="Install Manager 2"></MenuItem>
  //               <MenuItem value="Install Manager 3"primaryText="Install Manager 3"></MenuItem>
  //             </SelectField>
  //           </div>
  //
  //           <div className="form-group col-md-6">
  //             <SelectField
  //              floatingLabelText="Subcontracted Installation Manager"
  //              floatingLabelFixed={true}
  //              value={this.state.subcontractedInstallManager}
  //              onChange={(e, key, value) => this.setState({ subcontractedInstallManager: value }, this.handleBlur)}
  //             >
  //               <MenuItem value="Subcontracted Manager 1"primaryText="Subcontracted Manager 1"></MenuItem>
  //               <MenuItem value="Subcontracted Manager 2"primaryText="Subcontracted Manager 2"></MenuItem>
  //               <MenuItem value="Subcontracted Manager 3"primaryText="Subcontracted Manager 3"></MenuItem>
  //             </SelectField>
  //           </div>
  //         </div>
  //         <div className='row'>
  //           <div className="form-group col-md-6">
  //             <SelectField
  //              floatingLabelText="Utility Company"
  //              floatingLabelFixed={true}
  //              value={this.state.utilityCompany}
  //              onChange={(e, key, value) => this.setState({ utilityCompany: value }, this.handleBlur)}
  //             >
  //               <MenuItem value="HECO"primaryText="HECO"></MenuItem>
  //               <MenuItem value="HELCO"primaryText="HELCO"></MenuItem>
  //               <MenuItem value="KIUC"primaryText="KIUC"></MenuItem>
  //               <MenuItem value="MECO"primaryText="MECO"></MenuItem>
  //               <MenuItem value="OTHER"primaryText="OTHER"></MenuItem>
  //             </SelectField>
  //           </div>
  //
  //           <div className="form-group col-md-6">
  //             <SelectField
  //              floatingLabelText="Interconnection Type"
  //              floatingLabelFixed={true}
  //              value={this.state.interconnectionType}
  //              onChange={(e, key, value) => this.setState({ interconnectionType: value }, this.handleBlur)}
  //             >
  //               <MenuItem value="NEM (Appendix 1)"primaryText="NEM (Appendix 1)"></MenuItem>
  //               <MenuItem value="NEM (Appendix 2)"primaryText="NEM (Appendix 2)"></MenuItem>
  //               <MenuItem value="NEM Pilot (Kauai)"primaryText="NEM Pilot (Kauai)"></MenuItem>
  //               <MenuItem value="FIT (TIER 1)"primaryText="FIT (TIER 1)"></MenuItem>
  //               <MenuItem value="FIT (TIER 2)"primaryText="FIT (TIER 2)"></MenuItem>
  //               <MenuItem value="FIT (TIER 3)"primaryText="FIT (TIER 3)"></MenuItem>
  //               <MenuItem value="SIA"primaryText="SIA"></MenuItem>
  //               <MenuItem value="NUG"primaryText="NUG"></MenuItem>
  //               <MenuItem value="Schedule Q"primaryText="Schedule Q"></MenuItem>
  //               <MenuItem value="OTHER"primaryText="OTHER"></MenuItem>
  //             </SelectField>
  //           </div>
  //         </div>
  //
  //         <div className="row">
  //           <div className='col-md-6'>
  //             <div className="ui checkbox">
  //               <input id="circuitCheckPerformed" type="checkbox" onChange={() => { this.toggleCheckbox("circuitCheckPerformed") }}/>
  //               <label htmlFor="circuitCheckPerformed">Circuit Check Performed</label>
  //             </div>
  //           </div>
  //           <div className='col-md-6'>
  //             <LabelInput label='Utility Agreement Nubmer' name='Utility Agreement Number' value={this.state.utilityAgreementNumber} placeholder='Utility Agreement Number' onChange={(e) => this.setState({ utilityAgreementNumber: e.target.value })} />
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <LabelInput label='Circuit Penitration (Pen (%) Range By Circuit Daytime Min*)' name='Circuit Penitration' value={this.state.circuitPenitration} placeholder='50-75%' onChange={(e) => this.setState({ circuitPenitration: e.target.value })} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Circuit Check Date" id="2" value={this.state.circuitCheckDate ? moment(this.state.circuitCheckDate)._d : {}} onChange={(e, date) => this.setState({ circuitCheckDate: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <div className="ui checkbox">
  //               <input id="utilityPreApproval" type="checkbox" onChange={() => { this.toggleCheckbox("utilityPreApproval") }}/>
  //               <label htmlFor="utilityPreApprovaaaal">Utility Pre-Approval</label>
  //             </div>
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Utility Pre-Approval Date" id="2" value={this.state.utilityPreApprovalDate ? moment(this.state.utilityPreApprovalDate)._d : {}} onChange={(e, date) => this.setState({ utilityPreApprovalDate: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //         {/* <div className="panel-heading comm-jobs-panel-heading">REVIEW FOR COMPLETENESS</div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Paperwork Completed On (YYYY-MM-DD)" id="2" value={this.state.paperworkCompletedOn ? moment(this.state.paperworkCompletedOn)._d : {}} onChange={(e, date) => this.setState({ paperworkCompletedOn: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Submitted to Utility On (YYYY-MM-DD)" id="2" value={this.state.submittedToUtilityOn ? moment(this.state.submittedToUtilityOn)._d : {}} onChange={(e, date) => this.setState({ submittedToUtilityOn: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Due No Later Than (YYYY-MM-DD)" id="2" value={this.state.dueNoLaterThan ? moment(this.state.dueNoLaterThan)._d : {}} onChange={(e, date) => this.setState({ dueNoLaterThan: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Actual Date Out (YYYY-MM-DD)" id="2" value={this.state.actualDateOut ? moment(this.state.actualDateOut)._d : {}} onChange={(e, date) => this.setState({ actualDateOut: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div> */}
  //
  //         {/* <div className="panel-heading comm-jobs-panel-heading">APPROVAL FROM UTILITY</div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Approved On (YYYY-MM-DD)" id="2" value={this.state.approvedOn ? moment(this.state.approvedOn)._d : {}} onChange={(e, date) => this.setState({ approvedOn: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //           <div className='col-md-6'>
  //
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <LabelInput label='Cost' name='Cost' value={this.state.title} placeholder='Cost' onChange={(e) => this.setState({ cost: e.target.value })} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Utility Cost Paid On (YYYY-MM-DD)" id="2" value={this.state.utilityCostPaidOn ? moment(this.state.utilityCostPaidOn)._d : {}} onChange={(e, date) => this.setState({ utilityCostPaidOn: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <div className="ui checkbox">
  //               <input id="costBilledTo326" type="checkbox" onChange={() => { this.toggleCheckbox("costBilledTo326") }}/>
  //               <label htmlFor="costBilledTo326">Cost Billed To 326</label>
  //             </div>
  //           </div>
  //           <div className='col-md-6'>
  //             <div className="ui checkbox">
  //               <input id="costPaidForBy326" type="checkbox" onChange={() => { this.toggleCheckbox("costPaidForBy326") }}/>
  //               <label htmlFor="costPaidForBy326">Cost Paid For By 326</label>
  //             </div>
  //           </div>
  //         </div> */}
  //
  //         {/* TODO Requirements */}
  //
  //         <div className="panel-heading comm-jobs-panel-heading">INSPECTION</div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Inspection Requested On (YYYY-MM-DD)" id="2" value={this.state.inspectionRequestedOn ? moment(this.state.inspectionRequestedOn)._d : {}} onChange={(e, date) => this.setState({ inspectionRequestedOn: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Inspection Date (YYYY-MM-DD)" id="2" value={this.state.inspectionDate ? moment(this.state.inspectionDate)._d : {}} onChange={(e, date) => this.setState({ inspectionDate: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //         <div className='row'>
  //           <div className='col-md-6'>
  //             <LabelInput label='Inspection Time' name='Inspection Time' value={this.state.inspectionTime} placeholder='Inspection Time (9:00 AM)' onChange={(e) => this.setState({ cost: e.target.value })} />
  //           </div>
  //           <div className='col-md-6'>
  //             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Executed Agreement Date (YYYY-MM-DD)" id="2" value={this.state.executedAgreementDate ? moment(this.state.executedAgreementDate)._d : {}} onChange={(e, date) => this.setState({ executedAgreementDate: moment(date)._d}, this.handleBlur)} />
  //           </div>
  //         </div>
  //
  //       </div>
  //
  //     </div>
  //   )
  // }
}

const getPeopleQuery = gql`
  query {
    getPeople {
      id
      firstName
      lastName
      user {
        id
        username
        password
      }
    }
  }
`;

const UtilityInfoWithData = compose(graphql(getPeopleQuery))(withRouter(UtilityInfo))

export default UtilityInfoWithData;
