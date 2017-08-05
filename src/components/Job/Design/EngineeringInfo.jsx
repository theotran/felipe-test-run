

import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import AddCommentModal from '../AddCommentModal';
import RevisionDateEdit from '../RevisionDateEdit';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import { Dropdown } from 'semantic-ui-react';


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

class EngineeringInfo extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEngineeringChange = this.handleEngineeringChange.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);

    this.state = {
      expanded: false,
      cardIndex: this.props.engineeringNumber + 1
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleChange(key, value) {
    this.props.handleEngineeringChange(this.props.engineeringNumber, key, value)
  }

  handleBlur() {
    this.props.blurHandler(this.props.engineering, this.props.engineeringNumber);
  }

  handleEngineeringChange(key, value){
    this.props.handleEngineeringChange(this.props.engineeringNumber, key, value);
    if(key === 'engineer') {
      this.props.UpdateTask({
        variables: {
          id: this.props.engineering.tasks[0].id,
          status: 'Assigned',
          endField: '',
          endValue: '',
          completedAt: null,
          belongsTo: 'Engineering',
          PersonId: value.id,
        }
      }).then((value) => {
        console.log("value in the create task mutation callback ", value);
      })
    }
    if(key === 'status' && (value === 'Approved' || value === 'Approved with comments')) {
      this.props.UpdateTask({
        variables: {
          id: this.props.engineering.tasks[0].id,
          status: 'Complete',
          endField: '',
          endValue: '',
          completedAt: moment(),
          belongsTo: 'Engineering',
        }
      }).then((value) => {
        console.log("value in the create task mutation callback ", value);
      })
    }
  }

  toggleCheckbox(key) {
    const nextKeyState = !this.props.engineering[key];
    this.handleChange(key, nextKeyState)
  }

  render() {
    const comments = this.props.engineering.comments ? this.props.engineering.comments.map((comment, key) => {
      return (
        <div key={key} className='comment'>
          <div className='row'>
            <div className='col-md-3'>
              <div>
                <label>Title: </label>
                <p>{comment.title}</p>
              </div>
            </div>
            <div className='col-md-3'>
              <div>
                <label>Created By: </label>
                <p>{this.props.engineering.engineer ? this.props.engineering.engineer.firstName : ' '} {this.props.engineering.engineer ? this.props.engineering.engineer.lastName : ' '}</p>
              </div>
            </div>
            <div className='col-md-3'>
              <div>
                <label>Date: </label>
                <p>{moment(comment.date).format('lll')}</p>
              </div>
            </div>
            <RevisionDateEdit comments={comment} />
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <label>Description</label>
              <div>{comment.description}</div>
            </div>
          </div>
        </div>
      )
    }) : '';

    if(this.props.data.loading) {
      return <div>loading</div>;
    }

    if(this.props.data.error) {
      return <div>Error</div>;
    }

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={"Engineering # " + this.state.cardIndex + " - " + this.props.engineering.type}
          subtitle={"Status : " + this.props.engineering.status}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            <div className="panel-heading comm-jobs-panel-heading">{this.props.engineering.type}</div>

            <div className="row">

              <div className='form-group col-md-6'>
                <label htmlFor="">Engineer</label>
                <Dropdown
                  placeholder='Engineer'
                  value={this.props.engineering.engineer ? this.props.engineering.engineer.id : null}
                  fluid selection options={this.props.data.getPeople.map((person, index) => {
                    return {
                      key: index,
                      text: person.firstName + " " + person.lastName,
                      value: person.id
                    }
                  })}
                  onChange={(e, data) => {
                    for(let i=0; i < this.props.data.getPeople.length; i++) {
                      if(this.props.data.getPeople[i].id === data.value) {
                        return this.handleEngineeringChange('engineer', this.props.data.getPeople[i]);
                      }
                    }

                  }}
                />
              </div>
              {/* <div className="form-group col-md-6">
                <div className="ui checkbox">
                  <input id={this.props.engineering.type} checked={ this.props.engineering.isTPR } type="checkbox" onChange={() => { this.toggleCheckbox('isTPR') }}/>
                  <label htmlFor={this.props.engineering.type}>Is Third Party Review</label>
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Date Sent to Engineer" id="1" value={this.props.engineering.sentDate ? moment(this.props.engineering.sentDate)._d : {}} onChange={(e, date) => this.handleChange('sentDate', moment(date)._d)} />
              </div>
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Due Date" id="1" value={this.props.engineering.dueDate ? moment(this.props.engineering.dueDate)._d : {}} onChange={(e, date) => this.handleChange('dueDate', moment(date)._d)} />
              </div>
            </div>

            <div className='row'>
              <div className="form-group col-md-6">
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Date Received from Engineer" id="1" value={this.props.engineering.receivedDate ? moment(this.props.engineering.receivedDate)._d : {}} onChange={(e, date) => this.handleChange('receivedDate', moment(date)._d)} />
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
                ]}
                value={this.props.engineering ? this.props.engineering.status : ''}
                onChange={(e, data) => { this.handleEngineeringChange('status', data.value) }}
              />
              </div>

            </div>

            <div className="row">
              <div className="panel-heading comm-jobs-panel-heading">Comments</div>
              {comments}
              <br />
              <div>
                <AddCommentModal belongsToId={this.props.engineering.id} belongsTo='Engineering' />
              </div>
            </div>

          </div>
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    )
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Employee" type:"Person"){
      id
      firstName
      lastName
    }
  }
`;

const EngineeringInfoWithData = compose(
  graphql(getPeopleQuery),
  graphql(CreateTaskMutation, { name: 'CreateTask' }),
  graphql(UpdateTaskMutation, { name: 'UpdateTask' }),
)(EngineeringInfo)

export default EngineeringInfoWithData;
