
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import FlatButton from 'material-ui/FlatButton';

import AddNoteModal from './../Job/Design/AddNoteModal';

import GetPersonQuery from './../../queries/GetPersonQuery';

import client from './../../index.js';

const DeleteNoteMutation = gql`
  mutation deleteNote($id: ID!){
    deleteNote(id: $id) {
      success
      message
      field
    }
  }
`;

class EmployeeNotes extends Component {

  constructor(props) {
    super(props);

    this.deleteNote = this.deleteNote.bind(this);

    this.state = {
      firstName: this.props.person.firstName,
      lastName: this.props.person.lastName,
      field: "",
      error: null
    }
  }

  deleteNote(note, index) {
    let cachedPersonQuery;

    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    client.mutate({
      mutation: DeleteNoteMutation,
      variables: {
        id: note.id
      },
      update: (proxy, result) => {
        console.log('DELETE NOTE PROXY', proxy)
        console.log('DELETE NOTE RESULT', result)

         // Read data from cache
        const data = proxy.readQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          }
        });

        console.log('DELETE DATA', data)

        if("deleteNote" in result.data){
          if(result.data.deleteNote.success === false){
            this.setState({
              field: result.data.deleteNote.field,
              error: result.data.deleteNote.message
            });
          }
        }

        proxy.writeQuery({
          query: GetPersonQuery,
          variables: {
            id: this.props.person.id
          },
          data
        });
      }
    })
    // Update the variable
    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });
    window.location.reload();
  }

  render() {
    let notes;

    if(this.props.person.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.person.error) {
      console.log(this.props.person.error);
      return (<div>An unexpected error occurred</div>);
    }

    if(this.props.person.notes){
     notes = this.props.person.notes.map((note, key) => {
      return (
        <div key={key} className="note">
          <div className='row'>
            <div className='col-md-3'>
              <div>{moment(note.createdOn).format('lll')}</div>
            </div>
            <div className='col-md-3'>
              <div>{note.createdBy.firstName + ' ' + note.createdBy.lastName}</div>
            </div>
            <div className='col-md-6'>
              <div>{note.text}</div>
            </div>
          </div>
          <div className="row">
            <FlatButton
              label="Delete Note"
              onTouchTap={this.deleteNote.bind(this, note)}
              style={{marginRight: 5}}
            />
          </div>
        </div>);
      });
    } else {
      notes = null;
    }

    return (
      <div>
        <div className="col-md-12 tabHeader" style={{marginBottom: 15}}>
          <h4 className="tabHeaderText">Employee Notes - {this.state.firstName} {this.state.lastName}</h4>
          <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
        </div>
        <div className="row">
          <div className="col-md-12" style={{marginBottom: 15}}>
            <div className='row'>
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
          <AddNoteModal type="person" belongsTo={"person"} belongsToId={this.props.person.id}/>
        </div>

      </div>
    )
  }
};

const EmployeeNotesWithMutation = compose(
  graphql(DeleteNoteMutation, { name: "DeleteNote" })
  )(withRouter(EmployeeNotes));

export default EmployeeNotesWithMutation;
