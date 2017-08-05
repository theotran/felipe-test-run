import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LabelInput from '../LabelInput';
import { Button } from 'semantic-ui-react'

class AddPhoneModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      phone: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.CreatePhone({
      variables: {
        number: this.state.phone,
        belongsTo: "Person",
        belongsToId: this.props.belongsToId
      }
    }).then((val) => {
      console.log("value in add phone modal ", val);
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
          title="Add Phone"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <LabelInput label='Phone' name='Phone' value={this.state.phone} placeholder='800-000-0000' onChange={(e) => this.setState({ phone: e.target.value })} />
        </Dialog>
      </div>
    );
  }
}

const CreatePhoneMutation = gql`
  mutation createPhone($number: String!, $belongsTo: String!, $belongsToId: ID!) {
    createPhone(input: {number: $number, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      number
    }
  }
`;

const AddPhoneModalWithMutations = compose(
  graphql(CreatePhoneMutation, { name: 'CreatePhone' })
)(AddPhoneModal);

export default AddPhoneModalWithMutations;
