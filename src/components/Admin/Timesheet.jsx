import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
// import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

import { Segment } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import { Divider } from 'semantic-ui-react'

import TimeLog from './TimeLog';

export default class CardExampleControlled extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedWeekNum: moment().isoWeek(),
      selectedWeekMonday: moment().isoWeekday(1)._d,
      selectedWeekSunday: moment().isoWeekday(7)._d,
    };
  }


  render() {
    console.log("Timesheets Props ", this.props);
    console.log("Timesheets State ", this.state)
    return (
      <div>
        <Segment clearing>
          <div className="timesheet-control">
            <Button.Group>
              <Button color="teal" labelPosition='left' icon='left chevron'
                onClick={(event, data) => {
                  this.setState({ selectedWeekNum: this.state.selectedWeekNum - 1 })
                }}
              />
                <Button content={JSON.stringify(moment().isoWeek(this.state.selectedWeekNum).isoWeekday(1)._d).slice(6, 11) + " - " + JSON.stringify(moment().isoWeek(this.state.selectedWeekNum).isoWeekday(7)._d).slice(6, 11)} />
              <Button color="teal" labelPosition='right' icon='right chevron'
                onClick={(event, data) => {
                  this.setState({ selectedWeekNum: this.state.selectedWeekNum + 1 })
                }}
              />
            </Button.Group>
          </div>
        </Segment>
        <Card expanded={true}>
          <CardHeader
            title="Time Sheet"
            subtitle="Logged Hours"
            subtitleColor={"#00B1B3"}
          />
          <CardText>
            <div>Monday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 1) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Tuesday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 2) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Wednesday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 3) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Thursday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 4) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Friday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 5) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Saturday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 6) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
            <Divider />
            <div>Sunday: </div>
            {this.props.person.logs ? this.props.person.logs.map((log, index) => {
              //getting the week number of the year for the log
              let logWeekNumber = moment(log.start).isoWeek();
              let logDayNumber = moment(log.start).isoWeekday();
              // console.log(logDayNumber);

              if(logWeekNumber === this.state.selectedWeekNum) {
                if(logDayNumber === 6) {
                  return (
                    <TimeLog key={index} log={log}/>
                  )
                }
              }
              // return log;
            }) : ''}
          </CardText>
          <CardActions>

          </CardActions>
        </Card>
      </div>
    );
  }
}
