import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LabelInput from '../LabelInput';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

const createCommentMutation = gql`
  mutation createComment( $id: ID, $refNumber: String, $title: String, $description: String, $CommenterId: ID, $date: DateTime, $belongsTo: String, $belongsToId: ID) {
    createComment(input: { id: $id, refNumber: $refNumber, title: $title, description: $description, CommenterId: $CommenterId, date: $date, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      refNumber
      title
      description
      commenter {
        id
        firstName
        lastName
      }
      date
    }
  }
`;

class AddComment extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      refNumber: '',
      title: '',
      description: '',
      date: (moment())
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.mutate({variables: { refNumber: this.state.refNumber, title: this.state.title, description: this.state.description, CommenterId: this.state.CommenterId, date: this.state.date, belongsTo: this.props.belongsTo, belongsToId: this.props.belongsToId }})
      .then((value) => {
        console.log(value)
        window.location.reload();
        return value;
      });
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
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD Comment" onTouchTap={this.handleOpen} /> */}
        <Button color="teal" content={'Add Comment'} icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
        <Dialog
          title="Add Comment"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
           <div className="row">
             <div className="form-group col-md-6">
               <LabelInput label='Title' name='Title' value={this.state.title} placeholder='Title' onChange={(e) => this.setState({ title: e.target.value })} />
             </div>
             <div className="form-group col-md-6">
               <LabelInput label='Reference Number' name='Reference Number' value={this.state.refNumber} placeholder='Reference Number' onChange={(e) => this.setState({ refNumber: e.target.value })} />
             </div>
           </div>

           <div className="row">
             <div className="form-group col-md-12">
               <LabelInput label='Description' name='Description' value={this.state.description} placeholder='Description' onChange={(e) => this.setState({ description: e.target.value })} />
             </div>
           </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddCommentWithMutation = compose(
  graphql(createCommentMutation),
)(AddComment);

export default AddCommentWithMutation;
