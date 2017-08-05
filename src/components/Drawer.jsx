import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class DrawerOpenRight extends Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      clockedIn: false,
      punchInTime: null,
      punchOutTime: null,
      timeDifference: null,
      weekDay: moment().weekday(),
      logCategory: '',
      logRole: '',
      logRate: '',
      logPersonId: null,
      logJobId: null,
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    console.log("DRAWER STATE ", this.state)

    if(this.props.data.loading) {
      return (
        <div className="load-div"></div>
        );
    }

    if(this.props.data.error) {
      console.log(this.props.data.error);
      return (
        <div className="load-div">
          Error
        </div>
        );
    }

    return (
      <div>
        <RaisedButton
          label="Time Tracker"
          onTouchTap={this.handleToggle}
        />

        <Drawer width={200} openSecondary={true} open={this.state.open}>
          <div className="timeButtons">
            <Dropdown
              placeholder='Select a job'
              fluid selection options={this.props.data.getJobs.map((job, index) => {
                return ({
                  key: index,
                  text: job.name,
                  value: job.id
                })
              })}
              value={this.state.jobId}
              onChange={(e, data) => {
                console.log(data)
                this.setState({
                  logJobId: data.value,
                });
              }}
            />
            <RaisedButton
              disabled={this.state.clockedIn ? true : false}
              label="Clock In"
              onTouchTap={(e) => {
                let punchIn = moment();
                this.setState({
                  clockedIn: !this.state.clockedIn,
                  punchInTime: punchIn
                })
              }}
            />
            <RaisedButton
              disabled={this.state.clockedIn ? false : true}
              label="Clock Out"
              onTouchTap={(e) => {
                let punchOut = moment();
                this.setState({
                  clockedIn: !this.state.clockedIn,
                  punchOutTime: punchOut,
                }, () => {
                  let momentB = moment(this.state.punchOutTime);
                  let momentDiff = momentB.diff(this.state.punchInTime, 'hours', true)
                  this.setState({
                    timeDifference: momentDiff,
                  });

                  this.props.CreateLog({
                    variables: {
                      category: "Time Log",
                      role: "Designer",
                      description: "Doing some design work",
                      rate: "$35.00 / hourly",
                      start: this.state.punchInTime._d,
                      end: this.state.punchOutTime._d,
                      JobId: this.state.logJobId,
                    }
                  }).then((value) => {
                    console.log("value from  CREATE LOG mutation ", value)
                  })
                })
              }}
            />
          </div>
        </Drawer>
      </div>
    );
  }
}

const getJobsQuery = gql`
  query {
    getJobs {
      id
      name
      number
      type
      status
    }
  }
`;

const CreateLogMutation = gql`
  mutation createLog($category: String, $role: String, $description: String, $rate: String, $start: DateTime, $end: DateTime, $PersonId: ID, $JobId: ID){
    createLog(input: { category: $category, role: $role, description: $description, rate: $rate, start: $start, end: $end, PersonId: $PersonId, JobId: $JobId }) {
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
`

const DrawerWithData = compose(
  graphql(getJobsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  }),
  graphql(CreateLogMutation, { name: 'CreateLog' })
)(DrawerOpenRight);

export default DrawerWithData;
