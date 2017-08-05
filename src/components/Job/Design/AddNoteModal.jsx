

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Button } from 'semantic-ui-react';

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

class AddNote extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      type: this.props.type ? this.props.type : '',
      text: '',
      JobId: this.props.jobId ? this.props.jobId : ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.mutate({variables: {text: this.state.text, type: this.state.type, belongsTo: this.props.belongsTo, belongsToId: this.props.belongsToId}})
    //   .then((value) => {
    //     window.location.reload();
    //     return value;
    //   });
    this.props.addNote({
      text: this.state.text,
      type: this.state.type,
      belongsTo: this.props.belongsTo,
      belongsToId: this.props.belongsToId
    })
    this.setState({
      text: '',
      type: ''
    }, this.handleClose());
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
        <div className='form-group'>
          <Button color="teal" content='ADD NOTE' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        </div>
        <Dialog
          title="Add Note"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="">Notes</label>
                <textarea
                  autoFocus={true}
                  name='Text'
                  className="form-control"
                  value={this.state.text}
                  placeholder='Your Note Here'
                  onChange={(e) => this.setState({text: e.target.value}, () => console.log('MODAL STATE', this.props))}
                  rows="5"
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddNoteWithMutation = graphql(createNoteMutation)(AddNote);

export default AddNoteWithMutation;
