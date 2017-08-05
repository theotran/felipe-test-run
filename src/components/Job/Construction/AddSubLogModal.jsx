

import React, { Component } from 'react';

import LabelInput from '../../LabelInput';

import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
//Material Modal
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
//GraphQL/Apollo
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';

class AddSubLogModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      workerCount: null,
      startTime: null,
      breakStartTime: null,
      breakEndTime: null,
      endTime: null,
      workPerformed: '',
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.AddSubLog({
    //   variables: {
    //     workerCount: this.state.workerCount,
    //     startTime: this.state.startTime,
    //     breakStartTime: this.state.breakStartTime,
    //     breakEndTime: this.state.breakEndTime,
    //     endTime: this.state.endTime,
    //     workPerformed: this.state.workPerformed,
    //     DailyLogId: this.props.dailyLogId
    //   }
    // }).then((value) => {
    //   console.log("Value from callback ", value);
    //   window.location.reload();
    // })
    this.props.addSubLog({
      workerCount: this.state.workerCount,
      startTime: this.state.startTime,
      breakStartTime: this.state.breakStartTime,
      breakEndTime: this.state.breakEndTime,
      endTime: this.state.endTime,
      workPerformed: this.state.workPerformed,
      DailyLogId: this.props.dailyLogId
    });
    this.setState({
      workerCount: null,
      startTime: null,
      breakStartTime: null,
      breakEndTime: null,
      endTime: null,
      workPerformed: '',
    }, this.handleClose())
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({safetyHeldTime: date});
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
        <Button color="teal" content='ADD SUB LOG' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        <Dialog
          title="Add Sub Log"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <LabelInput className={'col-md-6'} label='Worker Count' value={this.state.workerCount} placeholder='Worker Count' onChange={(e) => { this.setState({ workerCount: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-6'} label='Work Performed' value={this.state.workPerformed} placeholder='Work Performed' onChange={(e) => { this.setState({ workPerformed: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
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
            <div className="form-group col-md-6">
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
        </Dialog>
      </div>
    );
  }
}

const CreateSubLogMutation = gql`
  mutation createSubLog( $workerCount: Int, $startTime: DateTime, $breakStartTime: DateTime, $breakEndTime: DateTime, $endTime: DateTime, $workPerformed: String, $DailyLogId: ID ) {
    createSubLog(input: { workerCount: $workerCount, startTime: $startTime, breakStartTime: $breakStartTime, breakEndTime: $breakEndTime, endTime: $endTime, workPerformed: $workPerformed, DailyLogId: $DailyLogId }) {
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



const AddSubLogModalWithMutation = compose(
  graphql(CreateSubLogMutation, { name: 'AddSubLog' }),
)(AddSubLogModal);

export default AddSubLogModalWithMutation;
