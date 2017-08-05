import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LabelInput from '../LabelInput';
import { Button } from 'semantic-ui-react'

class AddEmailModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.CreateEmail({
      variables: {
        address: this.state.email,
        belongsTo: "Person",
        belongsToId: this.props.belongsToId
      }
    }).then((val) => {
      console.log("value in add email modal ", val);
      window.location.reload()
    })
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
      <div className="col-md-6">
        <Button color='teal' onClick={this.handleOpen}>+</Button>
        {/* <RaisedButton backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD PHONE" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Email"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <LabelInput label='Email' name='Email' value={this.state.email} placeholder='you@email.com' onChange={(e) => this.setState({ email: e.target.value })} />
        </Dialog>
      </div>
    );
  }
}

const CreateEmailMutation = gql`
  mutation createEmail($address: String!, $belongsTo: String!, $belongsToId: ID!) {
    createEmail(input: {address: $address, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      address
    }
  }
`;

const AddEmailModalWithMutations = compose(
  graphql(CreateEmailMutation, { name: 'CreateEmail' })
)(AddEmailModal);

export default AddEmailModalWithMutations;
