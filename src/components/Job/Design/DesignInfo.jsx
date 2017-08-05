import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import LabelInput from './../../LabelInput';
import AddNoteModal from './AddNoteModal';
import AddEngineeringModal from './AddEngineeringModal';
import AddDesignReviewModal from '../Review/AddDesignReviewModal';
import DesignReviewInfo from '../Review/DesignReviewInfo';
import EngineeringInfo from './EngineeringInfo';
import { Dropdown } from 'semantic-ui-react';
import update from 'immutability-helper';
import GetJobQuery from '../../../queries/GetJobQuery';
let engineering;
let notes;
let reviews;


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
        ...on Design {
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
        ...on Design {
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


class DesignInfo extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEngineeringChange = this.handleEngineeringChange.bind(this);
    this.handleReviewChange = this.handleReviewChange.bind(this);
    this.state = {
      customerApproved: this.props.design.customerApproved,
      notes: this.props.design.notes ? this.props.design.notes : [],
      engineering: this.props.design.engineering ? this.props.design.engineering : []
    }
  }

  toggleCheckbox(key) {
    const nextKeyState = !this.state.customerApproved;
    console.log("Toggling checkbox value! ", nextKeyState);
    this.setState({customerApproved: nextKeyState}, this.props.changeHandler(key, nextKeyState));
  }

  handleChange(key, value) {
    this.props.changeHandler(key, value);
    if(key === 'designer') {
      if(!this.props.design.tasks[0]){
        this.props.CreateTask({
          variables: {
            status: 'Assigned',
            endField: '',
            endValue: '',
            path: 'commercial/project/' + this.props.job.id + '/design',
            completedAt: null,
            belongsTo: 'Design',
            belongsToId: this.props.design.id,
            PersonId: value.id,
            JobId: this.props.job.id
          }
        }).then((value) => {
          console.log("value in the create task mutation callback ", value);
        })
      } else {
        this.props.UpdateTask({
          variables: {
            id: this.props.design.tasks[0].id,
            status: 'In-Progress',
            endField: '',
            endValue: '',
            path: 'commercial/project/' + this.props.job.id + '/design',
            completedAt: null,
            belongsTo: 'Design',
            belongsToId: this.props.design.id,
            PersonId: value.id,
            JobId: this.props.job.id
          }
        }).then((value) => {
          console.log("value in the create task mutation callback ", value);
        })
      }
    }
  }

  handleBlur() {
    this.props.blurHandler(this.props.design);
  }

  handleEngineeringChange(index, key, value){
    this.props.handleEngineeringChange(index, key, value);
  }

  handleReviewChange(index, key, value){
    console.log(index, key, value)
    this.props.handleReviewChange(index, key, value);
  }

  addNote = (noteInfo) => {
    console.log(noteInfo);
    this.props.CreateNote({
      variables: noteInfo,
      update: (proxy, result) => {
        console.log('PROXY', proxy);

        console.log('RESULT', result);

        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          }
        });
        console.log('data', data);
        console.log('create design note result', result);

        data.job.designs[this.props.designNumber].notes.push(result.data.createNote);

        console.log('data after adding design note', data);

        // Write our combined data back to the store cache
        proxy.writeQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          },
          data
        });
      }
    })
      .then((value) => {
        console.log("value in create note mutation! ", value);
        let newData = update(this.state, {
          notes: {$push: [value.data.createNote]}//then we get the full data value from the mutation and set that to state
        });
        this.setState(newData);
        return value;
      });
  }

  addEngineering = (engineering) => {
    this.props.CreateEngineering({
      variables: engineering
    })
    .then((value) => {
      console.log("value in create engineering mutation! ", value);
      let engineeringData = update(this.state, {
        engineering: {$push: [value.data.createEngineering]}//then we get the full data value from the mutation and set that to state
      });
      this.setState(engineeringData);
      this.props.CreateEngineeringTask({
        variables: {
          status: 'Assigned',
          endField: '',
          endValue: '',
          path: 'commercial/project/' + this.props.job.id + '/design',
          completedAt: null,
          belongsTo: 'Engineering',
          belongsToId: value.data.createEngineering.id,
          PersonId: this.state.engineer,
          JobId: this.props.job.id
        },
      })
      return value;
    })
  }

  render() {
    if(this.props.data.loading) {
      return(
        <div>loading...</div>
      )
    }

    if(this.props.data.error) {
      return (
        <div>Error</div>
      )
    }

    if(this.state.notes !== []){
     notes = this.state.notes.map((note, key) => {
      console.log(note)
        if(note.createdBy) {
          return (
            <div key={key} className="note">
              <div>
                <div className='col-md-3'>
                  <div>{moment(note.createdAt).format('lll')}</div>
                </div>
                <div className='col-md-3'>
                  <div>{note.createdBy.firstName + ' ' + note.createdBy.lastName}</div>
                </div>
                <div className='col-md-6'>
                  <div>{note.text}</div>
                </div>
              </div>
            </div>);
        }
      });
    } else {
      notes = null;
    }

    if(this.state.engineering !== []){
      engineering = this.state.engineering.map((engineeringMap, key) => {
        return (
          <div className='row' key={key}>
            <EngineeringInfo engineering={engineeringMap} designNumber={this.props.designNumber} engineeringNumber={key} job={this.props.job} designId={this.props.design.id} blurHandler={this.handleEngBlur}  handleEngineeringChange={this.handleEngineeringChange}/>
          </div>
        )
      })
    } else {
      engineering = null;
    }

    if(this.props.design.reviews) {
      reviews = this.props.design.reviews.map((reviewMap, key) => {
        return (
          <div className='row' key={key}>
            <DesignReviewInfo designNumber={this.props.designNumber} reviewNumber={key} job={this.props.job}  review={this.props.design.reviews[key]} blurHandler={this.handleReviewBlur} handleReviewChange={this.handleReviewChange} />
          </div>
        )
      })
    }

    return (
      <div>

        <div className="row">
          <LabelInput className={'col-md-6'} label='Design Name' name='Design Name' value={this.props.design.type} placeholder='Smith PV Design V1' onChange={(e, key, value) => this.handleChange('type', e.target.value)} onBlur={this.handleBlur} />

          <div className="form-group col-md-6">
            <label htmlFor="">Status</label>
            <Dropdown
              placeholder='Status'
              fluid selection options={[
                 { text: 'In Progress', value: 'In Progress' },
                 { text: 'In Review', value: 'In Review',},
                 { text: 'Approved', value: 'Approved',},
                 { text: 'Approved with comments', value: 'Approved with comments',},
                 { text: 'Rejected with comments', value: 'Rejected with comments',},
               ]}
              value={this.props.design.status  ? this.props.design.status : ''}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data)
                this.handleChange('status', data.value)
              }}
              onBlur={(e, data) => { this.handleBlur()}}
            />
          </div>

        </div>

        <div className='row'>
          <div className="form-group col-md-6">
            <label htmlFor="">Designer</label>
            <Dropdown
              placeholder='Designer'
              fluid selection options={this.props.data.getPeople.map((designer, index) => {
                return {
                  key: index,
                  text: designer.firstName + " " + designer.lastName,
                  value: designer.id
                }
              })}
              value={this.props.design.designer ? this.props.design.designer.id : ''}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data)
                for(let i=0; i < this.props.data.getPeople.length; i++) {
                  if(this.props.data.getPeople[i].id === data.value) {
                    return this.handleChange('designer', this.props.data.getPeople[i]);
                  }
                }


              }}
            />
          </div>

        </div>

        <div className="row">
          <div className='form-group col-md-6'>
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="1" value={this.props.design.startDate ? moment(this.props.design.startDate)._d : {}} disabled={this.props.design.designer ? false : true} onChange={
              (e, date) => {
                this.handleChange('startDate', moment(date)._d)
                if(this.props.design.tasks[0]){
                  this.props.UpdateTask({
                    variables: {
                      id: this.props.design.tasks[0].id,
                      status: 'In-Progress',
                      endField: '',
                      endValue: '',
                      path: 'commercial/project/' + this.props.job.id + '/design',
                      completedAt: null,
                      belongsTo: 'Design',
                      belongsToId: this.props.design.id,
                      PersonId: this.props.design.designer.id,
                      JobId: this.props.job.id
                    }
                  }).then((value) => {
                    console.log("value in the create task mutation callback ", value);
                  })
                }
              }}/>
          </div>
          <div className="form-group col-md-6">
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="As Built Complete Date" id="1" value={this.props.design.asBuiltCompleteDate ? moment(this.props.design.asBuiltCompleteDate)._d : {}} onChange={
              (e, date) => {
                this.handleChange('asBuiltCompleteDate', moment(date)._d)
                if(this.props.design.tasks[0]){
                  this.props.UpdateTask({
                    variables: {
                      id: this.props.design.tasks[0].id,
                      status: 'Complete',
                      endField: 'As-Built Complete Date',
                      endValue: this.props.design.asBuiltCompleteDate.toString(),
                      path: 'commercial/project/' + this.props.job.id + '/design',
                      completedAt: moment(),
                      belongsTo: 'Design',
                      belongsToId: this.props.design.id,
                      PersonId: this.props.design.designer.id,
                      JobId: this.props.job.id
                    }
                  }).then((value) => {
                    console.log("value in the create task mutation callback ", value);
                  })
                }
              }
            } />
          </div>
        </div>

        <div className='row'>
          <div className='form-group col-md-6'>
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="IFC Build Complete Date" id="1" value={this.props.design.ifcBuildCompleteDate ? moment(this.props.design.ifcBuildCompleteDate)._d : {}} onChange={(e, date) => this.handleChange('ifcBuildCompleteDate', moment(date)._d)} />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12 tabHeader">
            <h4 className="tabHeaderText">NOTES</h4>
            <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
          </div>
          <div className="form-group col-md-12">
            <div>
              <div className='col-md-3'>
                <label>Created On</label>
              </div>
              <div className='col-md-3'>
                <label>Created By</label>
              </div>
              <div className='col-md-6'>
                <label>Note</label>
              </div>
            </div>
            {notes}
          </div>
          <AddNoteModal addNote={this.addNote} design={this.props.design} jobId={this.props.job.id} belongsTo={"Design"} belongsToId={this.props.design.id}/>
        </div>
        <br />
        <div className="row">
          <div className="col-md-12 tabHeader">
            <h4 className="tabHeaderText">ENGINEERING</h4>
            <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
          </div>
        </div>
        {engineering}
        <br />
        <div className='row'>
          <AddEngineeringModal addEngineering={this.addEngineering} designId={this.props.design.id} job={this.props.job} design={this.props.design}/>
        </div>
        <br />
        <div className='row'>
          <div className="col-md-12 tabHeader">
            <h4 className="tabHeaderText">REVIEW</h4>
            <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
          </div>
        </div>
        {reviews}
        <br />
        <div className='row'>
          <AddDesignReviewModal designId={this.props.design.id} />
        </div>

      </div>
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

const createNoteMutation = gql`
  mutation createNote($text: String!, $type: String, $belongsTo: String, $belongsToId: ID) {
    createNote(input: {text: $text, type: $type, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      text
      type
      createdAt
      updatedAt
      createdBy{
        id
        firstName
        lastName
      }
    }
  }
`;

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

const CreateEngineeringTaskMutation = gql`
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

const DesignInfoWithData = compose(
  graphql(getPeopleQuery),
  graphql(CreateTaskMutation, { name: 'CreateTask' }),
  graphql(UpdateTaskMutation, { name: 'UpdateTask' }),
  graphql(createNoteMutation, { name: 'CreateNote' }),
  graphql(createEngineeringMutation, { name: 'CreateEngineering' }),
  graphql(CreateEngineeringTaskMutation, { name: 'CreateEngineeringTask' }),
)(DesignInfo)

export default DesignInfoWithData;
