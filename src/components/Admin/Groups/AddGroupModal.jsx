import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown } from 'semantic-ui-react';
import AddIcon from 'material-ui/svg-icons/content/add';

class AddGroupModal extends Component {
  constructor(props) {
    super(props)

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      open: false,
      type: '',
      name: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      type: '',
      name: ''
    });
  };

  handleSave = () => {
    this.props.CreateGroup({
      variables: {
        type: this.state.type,
        name: this.state.name
      }
    }).then((value) => {
      console.log("value in callback from mutation", value);
      this.handleClose()
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
      <div>
        <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="CREATE GROUP" onTouchTap={this.handleOpen} />
        <Dialog
          title="Create Group"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          style={{ overflowY: "visible" }}
        >
          <div className="row customModalBody">
            <div className="form-group col-md-6">
              <label htmlFor="">Type</label>
              <Dropdown
                placeholder='Type'
                fluid selection options={[
                   { text: 'User', value: 'User',},
                   { text: 'Person', value: 'Person',},
                 ]}
                value={this.state.type}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ type: data.value })
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="">Name</label>
              <input
                name='Name'
                className="form-control"
                value={this.state.name}
                placeholder='Name'
                onChange={(e) => this.setState({name: e.target.value})}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

const CreateGroupMutation = gql`
  mutation createGroup($type: String, $name: String){
    createGroup(input: {type: $type, name: $name}) {
      id
      type
      name
    }
  }
`;

const AddGroupModalWithMutations = compose(
  graphql(CreateGroupMutation, {name: 'CreateGroup'}),
)(AddGroupModal);

export default AddGroupModalWithMutations;
