import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'react-addons-update';
import { withRouter } from 'react-router';
import { browserHistory } from 'react-router';
import gql from 'graphql-tag';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import { Dropdown, Button } from 'semantic-ui-react'; 

import LabelInput from './../../LabelInput';

const InviteNewUserMutation = gql`
  mutation inviteNewUser ($email: String!, $PersonId: ID!, $companyName: String!, $GroupIdArr: [String!], $username: String!) {
    invite (email: $email, PersonId: $PersonId, companyName: $companyName, GroupIdArr: $GroupIdArr, username: $username) {
      success
      message
      field
    }
  }
`;

class InviteUserToGroup extends Component {
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
      email: '',
      disabled: false,
      toggled: false,
      field: '',
      username: '',
      error: null
    };

  }

  onToggle = (e, toggle) => {
    if(toggle && this.state.roles.indexOf(e.target.value) === -1){
      const newRoles = update(this.state, {roles: {$push: [e.target.value]}})
      if(newRoles.roles.indexOf("SuperAdmin") !== -1){
        newRoles.roles = ["SuperAdmin"];
        this.setState({
          roles: newRoles.roles,
          disabled: true
        }, () => {console.log('NEW ROLES', newRoles)})
      } else {
        this.setState({
          roles: newRoles.roles
        }, () => {console.log('NEW ROLES NO SUPERADMIN', newRoles)})
      }
    } else {
      const newRoles = update(this.state, { roles: {$splice: [[this.state.roles.indexOf(e.target.value), 1]]}})

      if(newRoles.roles.indexOf("SuperAdmin") === -1){
        this.setState({
          roles: newRoles.roles,
          toggled: false,
          disabled: false
        }, () => {console.log('ON TOGGLE', this.state)})
      }
    }
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
    let GroupIdArr = [];

    this.state.groups.map((group, index) => {
      if(this.state.roles.indexOf(group.name) !== -1 && group.type === "User"){
        GroupIdArr.push(group.id);
        return GroupIdArr;
      }
    })

    this.props.InviteNewUser({
      variables: {
        PersonId: this.state.PersonId,
        email: this.state.email,
        companyName: this.state.companyName,
        GroupIdArr: GroupIdArr,
        username: this.state.username
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
    let roleCard;
    let adminRoleCard

    if(this.state.groups.length !== 0){
        adminRoleCard = <CardText>
                          {this.state.groups.map((group, index) => {
                            if(group.name === "SuperAdmin"){
                              return (<Toggle
                                key={index}
                                label={group.name}
                                labelStyle={{fontSize: '15px'}}
                                defaultToggled={this.state.toggled}
                                style={{width: '50%'}}
                                trackStyle={{backgroundColor: '#00B1B3'}}
                                trackSwitchedStyle={{backgroundColor: '#612a60'}}
                                thumbStyle={{backgroundColor: '#e2eceb'}}
                                thumbSwitchedStyle={{backgroundColor: '#00B1B3'}}
                                value={group.name}
                                onToggle={this.onToggle}
                              />)
                            }
                          })}
                        </CardText>

        roleCard =  <Card>
                      <CardHeader
                        title={this.state.username}
                        titleStyle={{fontSize: '25px'}}
                        subtitle="User Groups"
                        subtitleColor="teal"
                        subtitleStyle={{fontSize: '18px'}}
                      />
                      <div className="row">
                        <div className="form-group col-md-6">
                          {adminRoleCard}
                        </div>
                        {this.state.groups.map((group, index) => {
                          if(group.type === "User" && group.name !== "SuperAdmin" && group.name !== "Customer" && group.name !== "Subcontractor"){
                            return (<div className="form-group col-md-6" key={index}>
                                      <CardText>
                                        <Toggle
                                          label={group.name}
                                          labelStyle={{fontSize: '15px'}}
                                          defaultToggled={this.state.toggled}
                                          style={{width: '50%'}}
                                          trackStyle={{backgroundColor: '#00B1B3'}}
                                          trackSwitchedStyle={{backgroundColor: '#612a60'}}
                                          thumbStyle={{backgroundColor: '#e2eceb'}}
                                          thumbSwitchedStyle={{backgroundColor: '#00B1B3'}}
                                          value={group.name}
                                          onToggle={this.onToggle}
                                          disabled={this.state.disabled}
                                        />
                                      </CardText>
                                    </div>
                                    )
                          }
                        })}
                      </div>
                      {/*<CardActions>
                        <FlatButton
                          label="Cancel"
                          primary={true}
                          onTouchTap={this.cancel}
                        />
                        <RaisedButton
                          backgroundColor={"#00B1B3"}
                          labelColor={"#fff"}
                          label="Save"
                          onTouchTap={this.handleSave}
                        />
                      </CardActions>*/}
                    </Card>
    }

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
    return (
      <div>

        <Button color="teal" content='INVITE USER' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>

        <Dialog
          title="Invite a User"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row customModalBody">
            <div className="form-group col-md-12">
              <label htmlFor="">Select Permission Groups</label>
              <Dropdown
                placeholder='Person'
                fluid
                selection
                options={this.props.data.getPeople.map((person, index) => {
                  return person.user === null ? {key: index, text: person.firstName + " " + person.lastName, value: person} : {text: null, value: null}
                })}
                value={this.state.id}
                onChange={(e, data) => {
                  this.setState({
                    PersonId: data.value.id,
                    username: `${data.value.firstName} ${data.value.lastName}`
                  }, () => {console.log('STATE', this.state)});
                }}
              />
            </div>
          </div>
          <div className="row">
            <LabelInput className="col-md-6"
              label='Email'
              name='Email'
              value={this.state.email}
              onChange={(e) => this.setState({email: e.target.value})}
              placeholder='Email'
            />
          </div>

          <div className="row">
            {roleCard}
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

const InviteUserToGroupWithMutations = compose(
  graphql(InviteNewUserMutation, { name: "InviteNewUser" }),
  graphql(getPeopleQuery, {
    options: (ownProps) => ({
      fetchPolicy: 'cache-and-network'
    })
  })
)(withRouter(InviteUserToGroup));

export default InviteUserToGroupWithMutations;
