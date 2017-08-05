import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown } from 'semantic-ui-react';

class AddPersonToGroup extends Component {
  constructor(props) {
    super(props)

    this.handleClose = this.handleClose.bind(this);

    this.state = {
      open: false,
      id: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      id: ''
    });
  };

  handleSave = () => {
    this.props.AddToGroup({
      variables: {
        GroupId: this.props.GroupId,
        MemberId: this.state.id
      }
    }).then((value) => {
      console.log("value in callback ", value);
      window.location.reload()
    })
  }

  render() {

    if(this.props.data.loading) {
      return <div>Loading...</div>
    }
    if(this.props.data.error) {
      return <div>Error...</div>
    }
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
        <FlatButton label="Add Person" onTouchTap={this.handleOpen} />
        <Dialog
          title="Add to group"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row customModalBody">
            <div className="form-group col-md-6">
              <label htmlFor="">Type</label>
              <Dropdown
                placeholder='Person'
                fluid selection options={this.props.data.getPeople.map((person, index) => {
                  return {
                    key: index,
                    text: person.firstName + " " + person.lastName,
                    value: person.id
                  }
                })}
                value={this.state.id}
                onChange={(e, data) => {
                  console.log(data)
                  this.setState({
                    id: data.value,
                  });
                }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

const AddToGroup = gql`
  mutation addToGroup($GroupId: ID!, $MemberId: ID!){
    addToGroup(input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

const getPeopleQuery = gql`
  query {
    getPeople(group: "Employee", type:"Person"){
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



const AddPersonToGroupWithMutations = compose(
  graphql(getPeopleQuery),
  graphql(AddToGroup, { name: 'AddToGroup' })
)(AddPersonToGroup);

export default AddPersonToGroupWithMutations;
