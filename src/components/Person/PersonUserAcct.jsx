import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import update from 'react-addons-update';
import client from './../../index.js';
import equal from 'deep-equal';

import FlatButton from 'material-ui/FlatButton';
import { Dropdown,Button } from 'semantic-ui-react'
import InputMask from 'react-input-mask';
import InviteUserModal from './InviteUserModal';

import validator from 'validator';

import GetPersonQuery from './../../queries/GetPersonQuery';

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

const AddToGroup = gql`
  mutation addToGroup($GroupId: ID!, $MemberId: ID!){
    addToGroup(input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

const RemoveFromGroup = gql`
  mutation removeFromGroup($GroupId: ID!, $MemberId: ID!){
    removeFromGroup(input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

let cachedPersonQuery;

class PersonUserAcct extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: this.props.person.firstName,
      middleName: this.props.person.middleName,
      lastName: this.props.person.lastName,
      phones: this.props.person.phones,
      emails: this.props.person.emails,
      field: "",
      roles: this.props.person.user.groups.filter((group)=>{
                  console.log(group);
                    return group.name !== 'Customer' && group.name !== 'Subcontractor';
                }).map((group) => {
                  console.log(group.id);
                  return group.id;
                }),
      error: null
    }
  }
  setUserGroups = (e,data) => {
    console.log(data.value, this.state.roles);
    this.setState((prevState,props) =>{
      if(data.value.length === 0){
        return {roles: prevState.roles}
      }
      if(prevState.roles.length < data.value.length){
        for(let z=data.value.length - 1; z >= 0; z--){
          if(prevState.roles.indexOf(data.value[z]) === -1){
            console.log(data.value[z]);
            return this.props.AddToGroup({
              variables: {
                GroupId: data.value[z],
                MemberId: this.props.person.user.id
              }
            }).then((response)=>{
              if(response.success){
                return {roles: data.value}
              }
            }) 
            
          }
        }
      }
      if(prevState.roles.length > data.value.length){
        for(let x=prevState.roles.length - 1; x >= 0; x--){
          if(data.value.indexOf(prevState.roles[x]) === -1){
            console.log(data.value[x]);
            return this.props.RemoveFromGroup({
              variables: {
                GroupId: prevState.roles[x],
                MemberId: this.props.person.user.id
              }
            }).then((response)=>{
              if(response.success){
                return {roles: data.value}
              }
            })
            
          }
        }
      }
    })
    console.log(e,data);
  }

  render() {
    let inviteUser;
    let groupSelect;
    console.log(this.props);
    if(this.props.data.loading) {
      return <div>Loading...</div>
    }
    if(this.props.data.error) {
      return <div>Error...</div>
    }
    if(this.props.person.user && this.props.person.user.username && this.props.person.user.active){
      inviteUser = null;
      groupSelect = (()=>{
        return (
          <div className="row">
            <div className="form-group col-md-9">
              <label htmlFor="">Select Permission Groups</label>
              <Dropdown
                className="dropdown-multiple"
                placeholder='Groups'
                fluid
                multiple
                selection
                options={this.props.data.company.groups.filter((group)=>{
                    return group.type === 'User' && group.name !== 'Customer' && group.name !== 'Subcontractor';
                }).map((group)=>{
                  console.log(group.id);
                  return {key: group.id, text: group.name, value: group.id};
                })}
                value={this.state.roles}
                onChange={this.setUserGroups}
              />
            </div>
          </div>
        )
      })();
    } else {
      inviteUser = <InviteUserModal type={"Employee"} person={this.props.person}/>
    }
    

    return (

      <div className="panel panel-default">
        <div className="panel-heading">User Account Settings - {this.state.firstName} {this.state.lastName}     {inviteUser}</div>
        <div className="panel-body">
          {groupSelect}
        </div>
        <Button color="teal" content='DEACTIVATE USER' icon='remove user' labelPosition='left' onClick={(e, data) => {} } data-content="Deactivate this user account"/>
      </div>
    )
  }
};

const PersonUserAcctWithMutation = compose(
  graphql(RemoveFromGroup, {
    name: "RemoveFromGroup",
    options: {
      fetchPolicy: "cache-and-network"
    }
  }),
  graphql(AddToGroup, {
    name: "AddToGroup",
    options: {
      fetchPolicy: "cache-and-network"
    }
  }),
  graphql(GetCompanyInfo, {
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network'
    })
  })
  )(withRouter(PersonUserAcct));

export default PersonUserAcctWithMutation;
