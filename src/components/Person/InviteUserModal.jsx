import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { withRouter } from 'react-router';
import { browserHistory } from 'react-router';
import gql from 'graphql-tag';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import { Dropdown, Button } from 'semantic-ui-react'; 

import LabelInput from './../LabelInput';

const InviteNewUserMutation = gql`
  mutation inviteNewUser ($email: String!, $PersonId: ID!, $companyName: String!, $GroupIdArr: [String!], $firstName: String!) {
    invite (email: $email, PersonId: $PersonId, companyName: $companyName, GroupIdArr: $GroupIdArr, firstName: $firstName) {
      success
      message
      field
    }
  }
`;

class InviteUserModal extends Component {
  constructor(props) {
    super(props)

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      groups: this.props.CompanyGroups,
      companyName: this.props.CompanyName,
      roles: [],
      open: false,
      PersonId: '',
      field: '',
      error: null
    };

  }

  

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      PersonId: '',
      email: '',
    });
  };

  handleSubmit = (e) => {

    this.props.InviteNewUser({
      variables: {
        PersonId: this.props.person.id,
        email: this.state.email,
        companyName: this.props.data.company.name,
        GroupIdArr: this.state.roles,
        firstName: this.props.person.firstName
      }
    }).then(invitation => {
      console.log('INVITE', invitation);
      if(invitation.data.invite.success === false){
        this.setState({
          field: invitation.data.invite.field,
          error: invitation.data.invite.message
        })
      } else {
        browserHistory.push('/verify');
      }
    })
    e.preventDefault();
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
        label="Invite"
        onTouchTap={this.handleSubmit}
      />
    ];
    let groupSelect = null;
    if(this.props.type === 'Employee'){
      groupSelect = (()=>{
        return (
          <div className="row customModalBody">
            <div className="form-group col-md-12">
              <label htmlFor="">Select Permission Groups</label>
              <Dropdown
                placeholder='Groups'
                fluid
                multiple
                selection
                options={this.props.data.company.groups.filter((group)=>{
                    return group.type === 'User' && group.name !== 'Customer' && group.name !== 'Subcontractor';
                }).map((group)=>{
                  return {key: group.id, text: group.name, value: group.id};
                })}
                value={this.state.roles}
                onChange={(e, data) => {
                  console.log(e, data);
                  this.setState({
                    roles: data.value,
                  })}}
              />
            </div>
          </div>
        )
      })();
    }
   console.log(this.props, this.props.type, this.props.type === 'Employee');
    return (
      <div>

        <Button color="teal" content='INVITE USER' icon='add user' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>

        <Dialog
          title="Invite a User"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {groupSelect}
          <div className="row">
            <LabelInput className="col-md-6"
              label='Email'
              name='Email'
              value={this.state.email}
              onChange={(e) => this.setState({email: e.target.value})}
              placeholder='Email'
            />
          </div>
        </Dialog>
      </div>
    )
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Employee", type:"Person"){
      id
      firstName
      lastName
      emails {
        id
        address
      }
      user {
        id
        username
      }
    }
  }
`;

let GetCompanyInfo = gql`
  query company($id: ID){
    company(id: $id) {
      id
      name
      account {
        teamUsers
        plan{
          teamUsers
        }
      }
      groups {
        id
        type
        name
      }
    }
  }
`;

const InviteUserModalWithMutations = compose(
  graphql(InviteNewUserMutation, { name: "InviteNewUser" }),
  graphql(GetCompanyInfo, {
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network'
    })
  })
)(withRouter(InviteUserModal));

export default InviteUserModalWithMutations;
