import React from 'react';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

import { Label } from 'semantic-ui-react'

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class TimeLog extends React.Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this)

    this.state = {
      startTime: this.props.log.start ? this.props.log.start : null,
      endTime: this.props.log.end ? this.props.log.end : null,
      totalHours: this.props.log.start ? moment(this.props.log.end).diff(this.props.log.start, 'hours', true) : null,
    }
  }

  handleBlur() {
    this.props.UpdateLog({
      variables: {
        id: this.props.log.id,
        start: this.state.startTime,
        end: this.state.endTime,
      }
    }).then((value) => {
      this.setState({ totalHours: moment(this.state.endTime).diff(this.state.startTime, 'hours', true)})
      console.log("value from callback ", value)
    })
  }

  render() {
    console.log("TimeLog components state ", this.state)
    console.log("Moment test ", moment(this.props.log.start))
    return (
    <div>
      <div className="row">
        <div className="form-group col-md-2">
          <Label>Job Name</Label>
        </div>
        <div className="form-group col-md-2">
          <Label>{"Total Hours: " + this.state.totalHours}</Label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">
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
        <div className="col-md-2">
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
      </div>
    </div>
    )
  }
}

const UpdateLogMutation = gql`
  mutation updateLog($id: ID, $category: String, $role: String, $description: String, $rate: String, $start: DateTime, $end: DateTime, $PersonId: ID, $JobId: ID){
    updateLog(input: {id: $id, category: $category, role: $role, description: $description, rate: $rate, start: $start, end: $end, PersonId: $PersonId, JobId: $JobId }) {
      id
      category
      role
    	description
      rate
      start
      end
      person {
        id
        firstName
        lastName
      }
      job {
        id
      }
    }
  }
`;

const TimeLogWithMutation = compose(
  graphql(UpdateLogMutation, { name: 'UpdateLog' }),
)(TimeLog)

export default TimeLogWithMutation;
