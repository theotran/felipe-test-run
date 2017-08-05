

import React, {Component} from 'react';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown, Button } from 'semantic-ui-react';
import AddIcon from 'material-ui/svg-icons/content/add';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import GetJobQuery from '../../../queries/GetJobQuery';


const createEngineeringMutation = gql `
  mutation createEngineering($type: String!, $DesignId: ID!, $isTPR: Boolean, $EngineerId: ID, $sentDate: DateTime, $dueDate: DateTime, $status: String, $receivedDate: DateTime, $completedDate: DateTime) {
    createEngineering(input: {type: $type, DesignId: $DesignId, isTPR: $isTPR, EngineerId: $EngineerId, sentDate: $sentDate, dueDate: $dueDate, status: $status, receivedDate: $receivedDate, completedDate: $completedDate}) {
      id
      type
      isTPR
      engineer {
        id
      }
      sentDate
      dueDate
      receivedDate
      completedDate
      status
    }
  }
`;

const CreateTaskMutation = gql`
  mutation createTask($status: String, $endField: String, $endValue: String, $fields: String, $path: String, $assignedAt: DateTime, $dueAt: DateTime, $completedAt: DateTime, $belongsTo: String, $belongsToId: ID, $PersonId: ID, $JobId: ID){
    createTask(input: {status: $status, endField: $endField, endValue: $endValue, fields: $fields, path: $path, assignedAt: $assignedAt, dueAt: $dueAt, completedAt: $completedAt, belongsTo: $belongsTo, belongsToId: $belongsToId, PersonId: $PersonId, JobId: $JobId}) {
      id
      status
      endField
      endValue
      fields
      path
      assignedAt
      dueAt
      completedAt
      belongsTo {
        ...on Engineering {
          id
        }
      }
      job {
        id
        name
      }
    }
  }
`;

const UpdateTaskMutation = gql`
  mutation updateTask($id: ID, $status: String, $endField: String, $endValue: String, $fields: String, $path: String, $assignedAt: DateTime, $dueAt: DateTime, $completedAt: DateTime, $belongsTo: String, $belongsToId: ID, $PersonId: ID, $JobId: ID){
    updateTask(input: {id: $id, status: $status, endField: $endField, endValue: $endValue, fields: $fields, path: $path, assignedAt: $assignedAt, dueAt: $dueAt, completedAt: $completedAt, belongsTo: $belongsTo, belongsToId: $belongsToId, PersonId: $PersonId, JobId: $JobId}) {
      id
      status
      endField
      endValue
      fields
      path
      assignedAt
      dueAt
      completedAt
      belongsTo {
        ...on Engineering {
          id
        }
      }
      job {
        id
        name
      }
    }
  }
`;

class AddEngineering extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      type: '',
      DesignId: this.props.designId,
      customerApproved: false,
      isTPR: false,
      engineer: {},
      sentDate: null,
      dueDate: null,
      status: '',
      receivedDate: null,
      completedDate: null
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  toggleCheckbox(key) {
    const nextKeyState = !this.state.isTPR;
    console.log("Toggling checkbox value! ", nextKeyState);
    this.setState({isTPR: nextKeyState})
  }

  handleSave = () => {
    // this.props.CreateEngineering({
    //   variables: {
    //     type: this.state.type,
    //     DesignId: this.props.designId,
    //     customerApproved: this.state.customerApproved,
    //     isTPR: this.state.isTPR,
    //     EngineerId: this.state.engineer,
    //     sentDate: this.state.sentDate,
    //     dueDate: this.state.dueDate,
    //     status: this.state.status,
    //     receivedDate: this.state.receivedDate,
    //     completedDate: this.state.completedDate
    //   },
    //   refetchQueries: [{
    //     query: GetJobQuery,
    //     variables: { id: this.props.job.id }
    //   }],
    // })
    // .then((value) => {
    //   console.log("value", value.data.createEngineering);
    // });
    this.props.addEngineering({
      type: this.state.type,
      DesignId: this.props.designId,
      customerApproved: this.state.customerApproved,
      isTPR: this.state.isTPR,
      EngineerId: this.state.engineer,
      sentDate: this.state.sentDate,
      dueDate: this.state.dueDate,
      status: this.state.status,
      receivedDate: this.state.receivedDate,
      completedDate: this.state.completedDate
    });
    this.setState({
      type: '',
      DesignId: this.props.designId,
      customerApproved: false,
      isTPR: false,
      engineer: {},
      sentDate: null,
      dueDate: null,
      status: '',
      receivedDate: null,
      completedDate: null
    }, this.handleClose());

  }

  render() {
    if(this.props.data.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.data.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    const actions=[ < FlatButton label="Cancel" primary={
        true
      }
      onTouchTap={
        this.handleClose
      } />, < RaisedButton backgroundColor={
        "#00B1B3"
      }
      labelColor={
        "#fff"
      }
      label="Submit" onTouchTap={
        this.handleSave
      } />
    ];

    return (
      <div>
        <Button color="teal" content='ADD ENGINEERING' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        {/* <RaisedButton icon={< AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD ENGINEERING" onTouchTap={this.handleOpen}/> */}
        <Dialog title="Add Engineering" actions={actions} modal={true} open={this.state.open} onRequestClose={this.handleClose}>
          <div className="modal-body">

            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="">Engineering Type</label>
                <Dropdown placeholder='Engineering Type' fluid selection options={[
                  {
                    key: 0,
                    text: 'Structural',
                    value: 'Structural'
                  }, {
                    key: 1,
                    text: 'Electrical',
                    value: 'Electrical'
                  }, {
                    key: 2,
                    text: 'Civil',
                    value: 'Civil'
                  }
                ]} onChange={(e, data) => {this.setState({
                    type: data.value})
                }}/>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="">Status</label>
                <Dropdown placeholder='Status' fluid selection options={[
                  {
                    key: 0,
                    text: 'In Review',
                    value: 'In Review'
                  }, {
                    key: 1,
                    text: 'Approved',
                    value: 'Approved'
                  }, {
                    key: 2,
                    text: 'Approved with Comments',
                    value: 'Approved with Comments'
                  }, {
                    key: 3,
                    text: 'Rejected with Comments',
                    value: 'Rejected with Comments'
                  }
                ]} onChange={(e, data) => {this.setState({status: data.value})}}
              />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-6'>
                <label htmlFor="">Engineer</label>
                <Dropdown
                  placeholder='Engineer'
                  fluid selection options={this.props.data.getPeople.map((person, index) => {
                    return {
                      key: index,
                      text: person.firstName + " " + person.lastName,
                      value: person.id
                    }
                  })}
                  onChange={(e, data) => {
                    this.setState({
                      engineer: data.value,
                    }, this.handleBlur);
                  }}
                />
              </div>
              {/* <div className="form-group col-md-6">
                <div className="ui checkbox">
                  <input id={this.state.isTPR} checked={ this.state.isTPR } type="checkbox" onChange={() => { this.toggleCheckbox('isTPR') }}/>
                  <label htmlFor={this.state.isTPR}>Is Third Party Review</label>
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Date Sent to Engineer" id="1" onChange={(e, date) => {this.setState({sentDate: moment(date)._d})}} />
              </div>
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Due Date" id="1" onChange={(e, date) => {this.setState({dueDate: moment(date)._d})}} />
              </div>
            </div>

            <div className='row'>
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true}
                  floatingLabelText="Date Received from Engineer" id="1"
                  onChange={(e, date) => {this.setState({receivedDate: moment(date)._d})}} />
              </div>
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true}
                  floatingLabelText="Completed Date" id="1"
                  onChange={(e, date) => {this.setState({completedDate: moment(date)._d})}} />
              </div>
            </div>

          </div>
        </Dialog>
      </div>
    );
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Employee" type:"Person"){
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

const AddEngineeringWithMutation = compose(
  graphql(getPeopleQuery),
  graphql(createEngineeringMutation, { name: 'CreateEngineering' }),
  graphql(CreateTaskMutation, { name: 'CreateTask' }),
  graphql(UpdateTaskMutation, { name: 'UpdateTask' }),
)(withRouter(AddEngineering));

export default AddEngineeringWithMutation;
