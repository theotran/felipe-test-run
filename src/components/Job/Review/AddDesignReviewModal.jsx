import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import AddIcon from 'material-ui/svg-icons/content/add';

import { Dropdown, Button } from 'semantic-ui-react';


const createReviewMutation = gql`
  mutation createReview( $belongsTo: String, $belongsToId: ID, $type: String, $ReviewerId: ID, $isTPR: Boolean ) {
    createReview(input: { belongsTo: $belongsTo, belongsToId: $belongsToId, type: $type, ReviewerId: $ReviewerId, isTPR: $isTPR}) {
      id
      createdAt
      reviewer {
        id
        firstName
        lastName
      }
      isTPR
    }
  }
`;

class AddReview extends Component {

  constructor(props) {
    super(props)
    console.log(this)

    this.state = {
      open: false,
      type: '',
      DesignId: this.props.designId
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.mutate({variables: {type: this.state.type, belongsToId: this.props.designId, belongsTo: 'Design', isTPR: false}})
      .then((value) => {
        console.log("value", value.data.createReview);
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
        <Button color="teal" content='ADD DESIGN REVIEW' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        <Dialog
          title="Add Review"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
           <div className='row'>
              <div className="form-group col-md-6">
               <label htmlFor="">Review Type</label>
               <Dropdown
                 placeholder='Review Type'
                 fluid selection options={[
                    { text: 'In House', value: 'In House',},
                    { text: 'Customer', value: 'Customer',},
                  ]}
                 value={this.state.type}
                 onChange={(e, data) => {
                   console.log("VALUE IN DROPDOWN ", data)
                   this.setState({ type: data.value })
                 }}
               />
              </div>
             <div className="emptySpace">
               {
                 "      "
               }
             </div>
           </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddReviewWithMutation = graphql(createReviewMutation)(AddReview);

export default AddReviewWithMutation;
