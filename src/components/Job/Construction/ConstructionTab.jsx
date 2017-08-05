import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import client from './../../../index.js';
import { withRouter } from 'react-router';
import GetJobQuery from '../../../queries/GetJobQuery';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import update from 'immutability-helper';
import DailyLog from './DailyLog';
import AddDailyLogModal from './AddDailyLogModal';

const createConstructionMutation = gql`
  mutation createConstruction($targetMechStartDate: DateTime, $targetMechEndDate: DateTime, $targetElectricStartDate: DateTime, $targetElectricEndDate: DateTime, $startDate: DateTime, $completedDate: DateTime, $JobId: ID!) {
    createConstruction (input: { targetMechStartDate: $targetMechStartDate, targetMechEndDate: $targetMechEndDate, targetElectricStartDate: $targetElectricStartDate, targetElectricEndDate: $targetElectricEndDate, startDate: $startDate, completedDate: $completedDate, JobId: $JobId}) {
      id
      targetMechStartDate
      targetMechEndDate
      targetElectricStartDate
      targetElectricEndDate
      startDate
      completedDate
      dailyLogs {
        id
        type
        date
        minTemp
        maxTemp
        weather
        safetyHeldTime
        safetyLocation
        subLogs {
          id
          workerCount
          startTime
          breakStartTime
          breakEndTime
          endTime
          workPerformed
        }
      }
    }
  }
`;

const updateConstructionMutation = gql`
  mutation updateConstruction($id: ID!, $targetMechStartDate: DateTime, $targetMechEndDate: DateTime, $targetElectricStartDate: DateTime, $targetElectricEndDate: DateTime, $startDate: DateTime, $completedDate: DateTime, $JobId: ID!) {
    updateConstruction (input: {id: $id, targetMechStartDate: $targetMechStartDate, targetMechEndDate: $targetMechEndDate, targetElectricStartDate: $targetElectricStartDate, targetElectricEndDate: $targetElectricEndDate, startDate: $startDate, completedDate: $completedDate, JobId: $JobId}) {
      id
      targetMechStartDate
      targetMechEndDate
      targetElectricStartDate
      targetElectricEndDate
      startDate
      completedDate
      dailyLogs {
        id
        type
        date
        minTemp
        maxTemp
        weather
        safetyHeldTime
        safetyLocation
        subLogs {
          id
          workerCount
          startTime
          breakStartTime
          breakEndTime
          endTime
          workPerformed
        }
      }
    }
  }
`;

let cachedJobQuery;

class ConstructionTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dailyLogs: [
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
        {
          date: "2017-08-10T10:00:00.000Z",
          id: "eff9639a-5df8-4fbd-a7c2-8a64394c9c4f",
          maxTemp: 88,
          minTemp: 80,
          safetyHeldTime: "2017-08-04T08:50:35.501Z",
          safetyLocation: "Honolulu"
        },
      ]
    }
  }

  render() {

    return (
      <div className="panel panel-default">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">CONSTRUCTION</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Construction_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
            </div>
            <div className='row'>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
            </div>


            <div className="row">
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText=" Target Mechanical Start Date" id="1" onChange={(e, date) => {
                } }/>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">DAILY LOGS</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Construction_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {this.state.dailyLogs !== [] ?
                this.state.dailyLogs.map((log, index) => {
                  console.log(log)
                  return <DailyLog key={index} dailyLog={log} job={this.props.job}/>
                }) : ''
              }
            </div>
            <br />
            <div className='row'>
              <AddDailyLogModal  />
            </div>
        </div>
      </div>

    )
  }
}





export default ConstructionTab;
