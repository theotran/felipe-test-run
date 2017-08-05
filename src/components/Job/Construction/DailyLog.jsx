

import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/assignment';

//Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import TextField from 'material-ui/TextField';

import LabelInput from '../../LabelInput';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import TimePicker from 'material-ui/TimePicker';

import AddSubLogModal from './AddSubLogModal';
import SubLog from './SubLog';
import { Dropdown } from 'semantic-ui-react';
import update from 'immutability-helper';

class DailyLog extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    if(this.props.dailyLog) {
      this.state = {
        expanded: false,
        type: this.props.dailyLog.type ? this.props.dailyLog.type : '',
        date: this.props.dailyLog.date ? this.props.dailyLog.date : null,
        minTemp: this.props.dailyLog.minTemp ? this.props.dailyLog.minTemp : null,
        maxTemp: this.props.dailyLog.maxTemp ? this.props.dailyLog.maxTemp : null,
        weather: this.props.dailyLog.weather ? this.props.dailyLog.weather : '',
        safetyHeldTime: this.props.dailyLog.safetyHeldTime ? this.props.dailyLog.safetyHeldTime : '',
        safetyLocation: this.props.dailyLog.safetyLocation ? this.props.dailyLog.safetyLocation : '',
        mutatedTime: null,
        value24: null,
        subLogs: this.props.dailyLog.subLogs ? this.props.dailyLog.subLogs : []
      }
    } else {
      this.state = {
        expanded: false,
        type: '',
        date: null,
        minTemp: null,
        maxTemp: null,
        weather: '',
        safetyHeldTime: '',
        safetyLocation: '',
        mutatedTime: null,
        value24: null,
        subLogs: []
      }
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
    this.props.UpdateDailyLog({
      variables: {
        id: this.props.dailyLog.id,
        date: this.state.date,
        minTemp: this.state.minTemp,
        maxTemp: this.state.maxTemp,
        weather: this.state.weather,
        safetyHeldTime: this.state.safetyHeldTime,
        safetyLocation: this.state.safetyLocation,
      }
    }).then((value) => {
      console.log("value in the update log ", value)
    })
  }

  addSubLog = (subLog) => {
    this.props.CreateSubLog({variables: subLog})
      .then((value) => {
        console.log("value in create sublog mutation ", value)
        let newData = update(this.state, {
          subLogs: {$push: [value.data.createSubLog]}
        });
        this.setState(newData);
        return value;
      })
  }

  render() {
    console.log("DailyLogs PROPS ", this.props);
    console.log("DailyLogs STATE ", this.state);
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={"Daily Log"}
          subtitle={moment(this.state.date).format('lll')}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className="row">
            <div className='form-group col-md-6'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Date" id="1" value={this.state.date ? moment(this.state.date)._d : {}} onChange={(e, date) => {
                this.setState({ date: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
            <div className="form-group col-md-6">
             <label htmlFor="">Weather</label>
             <Dropdown
               placeholder='Weather'
               fluid selection options={[
                  { text: 'Mostly Sunny', value: 'Mostly Sunny',},
                  { text: 'Partly Cloudy', value: 'Partly Cloudy',},
                  { text: 'Overcast', value: 'Overcast',},
                  { text: 'Rain', value: 'Rain',},
                  { text: 'Hail', value: 'Hail',},
                  { text: 'Other', value: 'Other',},
                ]}
               value={this.state.weather}
               onChange={(e, data) => {
                 console.log("VALUE IN DROPDOWN ", data)
                 this.setState({ weather: data.value }, this.handleBlur)
               }}
             />
            </div>
          </div>
          <div className="row">
            <LabelInput className={'col-md-6'} label='Min Temp' value={this.state.minTemp ? this.state.minTemp : ''} placeholder='Min Temp' onChange={(e) => { this.setState({ minTemp: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-6'} label='Max Temp' value={this.state.maxTemp ? this.state.maxTemp : ''} placeholder='Max Temp' onChange={(e) => { this.setState({ maxTemp: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
            {/* <div className={"form-group col-md-2"}>
                <label>Time</label>
                <input
                  type="time"
                  className='form-control'
                  value={this.state.safetyHeldTime ? this.state.safetyHeldTime : ''}
                  onChange={(e, target, value) => { this.setState({ safetyHeldTime: e.target.value })}}
                  onBlur={this.handleBlur}
                />
            </div> */}
            <div className="col-md-6">
              <TimePicker
                floatingLabelText="Safety Held Time"
                floatingLabelFixed={true}
                autoOk={true}
                format="ampm"
                hintText="12hr Format"
                value={this.state.safetyHeldTime ? moment(this.state.safetyHeldTime)._d : null}
                onChange={(e, date) => {
                  this.setState({safetyHeldTime: date}, this.handleBlur)
                }}
              />
            </div>
            <LabelInput className={'col-md-6'} label='Safety Location' value={this.state.safetyLocation} placeholder='Safety Location' onChange={(e) => { this.setState({ safetyLocation: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>

          <div className="row">
            {
              this.state.subLogs !== [] ? this.state.subLogs.map((subLog, index) => {
                return <SubLog key={index} subLogIndex={index}  subLog={subLog} job={this.props.job} />
              }) : ''
            }
          </div>
          <br />
          <div className='row'>
            <AddSubLogModal addSubLog={this.addSubLog} dailyLogId={this.props.dailyLog ? this.props.dailyLog.id : ''}/>
          </div>

        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    );
  }
}

const UpdateDailyLogMutation = gql`
  mutation updateDailyLog( $id: ID, $type: String, $date: DateTime, $minTemp: Float, $maxTemp: Float, $weather: String, $safetyHeldTime: DateTime, $safetyLocation: String ) {
    updateDailyLog(input: { id: $id , type: $type, date: $date, minTemp: $minTemp, maxTemp: $maxTemp, weather: $weather, safetyHeldTime: $safetyHeldTime, safetyLocation: $safetyLocation }) {
      id
      type
      date
      minTemp
      maxTemp
      weather
      safetyHeldTime
      safetyLocation
    }
  }
`;

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

const DailyLogWithMutation = compose(
  graphql(UpdateDailyLogMutation, { name: 'UpdateDailyLog' }),
  graphql(CreateSubLogMutation, { name: 'CreateSubLog' }),
)(DailyLog);

export default DailyLogWithMutation;
