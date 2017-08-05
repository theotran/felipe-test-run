

import React, { Component } from 'react';
import LabelInput from '../../LabelInput';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import TimePicker from 'material-ui/TimePicker';

import AddIncidentModal from './AddIncidentModal';
import Incident from './Incident';


class SubLog extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      workerCount: this.props.subLog.workerCount ? this.props.subLog.workerCount : null,
      startTime: this.props.subLog.startTime ? this.props.subLog.startTime : null,
      breakStartTime: this.props.subLog.breakStartTime ? this.props.subLog.breakStartTime : null,
      breakEndTime: this.props.subLog.breakEndTime ? this.props.subLog.breakEndTime : null,
      endTime: this.props.subLog.endTime ? this.props.subLog.endTime : null,
      workPerformed: this.props.subLog.workPerformed ? this.props.subLog.workPerformed : '',
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  handleBlur() {
    this.props.UpdateSubLog({
      variables: {
        id: this.props.subLog.id,
        workerCount: this.state.workerCount,
        startTime: this.state.startTime,
        breakStartTime: this.state.breakStartTime,
        breakEndTime: this.state.breakEndTime,
        endTime: this.state.endTime,
        workPerformed: this.state.workPerformed
      }
    })
  }

  render() {
    console.log("SUB LOGS PROPS ", this.props)
    return (
      <div>
        <div className="row">
          <div className="col-md-12 tabHeader">
            <h4 className="tabHeaderText">SUB LOG # {this.props.subLogIndex + 1}</h4>
            <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Construction_Icon_p.svg' height="35" width="50"/>
          </div>
        </div>
        <div className="row form-group">
          <LabelInput className={'col-md-6'} label='Worker Count' value={this.state.workerCount} placeholder='Worker Count' onChange={(e) => { this.setState({ workerCount: e.target.value }) }} onBlur={this.handleBlur}/>
          <LabelInput className={'col-md-6'} label='Work Performed' value={this.state.workPerformed} placeholder='Work Performed' onChange={(e) => { this.setState({ workPerformed: e.target.value }) }} onBlur={this.handleBlur}/>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TimePicker
              floatingLabelText="Start Time"
              floatingLabelFixed={true}
              autoOk={true}
              format="ampm"
              hintText="12hr Format"
              value={this.state.startTime ? moment(this.state.startTime)._d : null}
              onChange={(e, date) => {
                this.setState({startTime: date}, this.handleBlur)
              }}
            />
          </div>
          <div className="col-md-6">
            <TimePicker
              floatingLabelText="Break Start Time"
              floatingLabelFixed={true}
              autoOk={true}
              format="ampm"
              hintText="12hr Format"
              value={this.state.breakStartTime ? moment(this.state.breakStartTime)._d : null}
              onChange={(e, date) => {
                this.setState({breakStartTime: date}, this.handleBlur)
              }}
            />
          </div>
        </div>
        <div className='row'>
          <div className="col-md-6">
            <TimePicker
              floatingLabelText="End Time"
              floatingLabelFixed={true}
              autoOk={true}
              format="ampm"
              hintText="12hr Format"
              value={this.state.endTime ? moment(this.state.endTime)._d : null}
              onChange={(e, date) => {
                this.setState({endTime: date}, this.handleBlur)
              }}
            />
          </div>
          <div className="col-md-6">
            <TimePicker
              floatingLabelText="Break End Time"
              floatingLabelFixed={true}
              autoOk={true}
              format="ampm"
              hintText="12hr Format"
              value={this.state.breakEndTime ? moment(this.state.breakEndTime)._d : null}
              onChange={(e, date) => {
                this.setState({breakEndTime: date}, this.handleBlur)
              }}
            />
          </div>
      </div>
      <br />
        {
          this.props.subLog.incidents ? this.props.subLog.incidents.map((incident, index) => {
            return <Incident key={index} incident={incident} job={this.props.job}/>
          }) : ''
        }
        <br />
        <AddIncidentModal subLogId={this.props.subLog.id}/>
      </div>

    );
  }
}

const UpdateSubLogMutation = gql`
  mutation updateSubLog( $id: ID  $workerCount: Int, $startTime: DateTime, $breakStartTime: DateTime, $breakEndTime: DateTime, $endTime: DateTime, $workPerformed: String ) {
    updateSubLog(input: { id: $id,  workerCount: $workerCount, startTime: $startTime, breakStartTime: $breakStartTime, breakEndTime: $breakEndTime, endTime: $endTime, workPerformed: $workPerformed }) {
      id
      workerCount
      startTime
      breakStartTime
      breakEndTime
      endTime
      workPerformed
    }
  }
`;

const SubLogWithMutation = compose(
  graphql(UpdateSubLogMutation, { name: 'UpdateSubLog' }),
)(SubLog);

export default SubLogWithMutation;
