import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
// import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import gql from 'graphql-tag';
import equal from 'deep-equal';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

import client from './../../index.js';

import GetUserQuery from './../../queries/GetUserQuery';
import GetCompanyInfoQuery from './../../queries/GetCompanyInfoQuery';

const AddToGroupMutation = gql`
  mutation addToGroup ($GroupId: ID!, $MemberId: ID!) {
    addToGroup (input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

const removeFromGroupMutation = gql`
  mutation removeFromGroup($GroupId: ID!, $MemberId: ID!){
    removeFromGroup (input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

let cachedUserQuery;

class UserEditForm extends Component {

  constructor(props) {
    super(props);

    console.log('USER EDIT PROPS', this.props)

    this.handleSave = this.handleSave.bind(this);
    this.cancel = this.cancel.bind(this);

    this.state = {
      username: this.props.user.username,
      disabled: false,
      toggled: false,
      roles: [],
      initialRolesID: [],
      field: "",
      error: null
    }
  }

  componentWillMount() {
    this.props.user.groups.forEach((group, index) => {
      if(this.state.roles.indexOf(group.name) === -1){
        this.state.roles.push(group.name);
        this.state.initialRolesID.push(group.id);
        if(this.state.roles.indexOf('SuperAdmin') !== -1){
          this.setState({
            disabled: true
          })
        }
      }
    })
  }

  onToggle = (e, toggle) => {

    if(toggle && this.state.roles.indexOf(e.target.value) === -1){
      const newRoles = update(this.state, {roles: {$push: [e.target.value]}})
      if(newRoles.roles.indexOf('SuperAdmin') !== -1){
        newRoles.roles = ["SuperAdmin"];
        this.setState({
          roles: newRoles.roles,
          disabled: true
        })
      } else {
        this.setState({
          roles: newRoles.roles
        })
      }
    } else {
      const newRoles = update(this.state, { roles: {$splice: [[this.state.roles.indexOf(e.target.value), 1]]}})

      if(newRoles.roles.indexOf('SuperAdmin') === -1){
        this.setState({
          roles: newRoles.roles,
          toggled: false,
          disabled: false
        })
      }
    }
  }

  handleSave = () => {
    cachedUserQuery = client.readQuery({
      query: GetUserQuery,
      variables: {
        id: this.props.user.id
      }
    })

    console.log('CACHED USER QUERY', cachedUserQuery);

    let cachedUserRoles = {
      roles: []
    };
    cachedUserQuery.user.groups.map((group, index) => {
      cachedUserRoles.roles.push(group.name)
      cachedUserRoles[group.name] = {
        'id': group.id
      }
      console.log('cachedUserRoles', cachedUserRoles)
      return cachedUserRoles;
    })

    // Update User Permissions
    if(equal(cachedUserRoles.roles, this.state.roles) === false){
      console.log('CACHE AND STATE DIFFER', this.state.roles)

      // REMOVE USER FROM GROUPS NOT IN STATE
      cachedUserRoles.roles.forEach((cachedRole) => {

        if(this.state.roles.indexOf(cachedRole) === -1){
          client.mutate({
            mutation: removeFromGroupMutation,
            variables: {
              GroupId: cachedUserRoles[cachedRole].id,
              MemberId: this.props.user.id
            },
            optimisticResponse: {
              GroupId: cachedUserRoles[cachedRole].id,
              MemberId: this.props.user.id
            },
            update: (proxy, result) => {
              console.log('REMOVE PROXY', proxy)
              console.log('REMOVE RESULT', result)

              // READ DATA FROM CACHE
              const data = proxy.readQuery({
                query: GetUserQuery,
                variables: {
                  id: this.props.user.id
                }
              });

              console.log('DATA FROM REMOVE UPDATE', data)

              if("removeFromGroup" in result.data){
                console.log('RESULT DATA', result.data)
                if(result.data.removeFromGroup.success === false){
                  this.setState({
                    field: result.data.removeFromGroup.field,
                    error: result.data.removeFromGroup.message
                  });
                } else {
                  console.log('REMOVE FROM GROUP SUCCESS', result.data)
                }
              }
            }
          });
        }
      })

      let roleID = [];
      this.state.initialRolesID.forEach((role, index) => {
        roleID.push(role);
      })
      this.props.data.company.groups.forEach((group) => {
        if(this.state.roles.indexOf(group.name) !== -1 && group.type === "User"){
          if(roleID.indexOf(group.id) === -1){
            roleID.push(group.id);
            console.log('DEEZ ROLE IDS', roleID)
          }
        }
      })

      // ADD USER TO GROUPS IN STATE
      this.state.roles.forEach((role, index) => {
        if(cachedUserRoles.roles.indexOf(role) === -1){
          console.log('CONDITIONAL ROLE', role)
          console.log('CONDITIONAL ROLE INDEX', index)
          console.log('CORRESPONDING ROLE ID', roleID[index])

          client.mutate({
            mutation: AddToGroupMutation,
            variables: {
              GroupId: roleID[index],
              MemberId: this.props.user.id
            },
            optimisticResponse: {
              GroupId: roleID[index],
              MemberId: this.props.user.id
            },
            update: (proxy, result) => {
              console.log('ADD PROXY', proxy)
              console.log('ADD RESULT', result)

              // Read data from cache
              const data = proxy.readQuery({
                query: GetUserQuery,
                variables: {
                  id: this.props.user.id
                }
              });
              console.log('ADD GROUPS DATA', data)

              // Combine original query data with mutation result
              if("addToGroup" in result.data){
                if(result.data.addToGroup.success === false){
                  this.setState({
                    field: result.data.addToGroup.field,
                    error: result.data.addToGroup.message
                  });
                } else {
                  console.log('ADD TO GROUP SUCCESS', result.data)

                }
              }
            }
          })
        }
      })
    }
  }

  cancel = () => {
    this.props.router.replace('/admin/permissions/' + this.props.user.id)
  }

  render() {

    console.log('USER EDIT STATE', this.state);

    let roleCard;
    let error;
    let errorStyle = {
      color: 'red'
    }

    if(this.props.user.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.user.error) {
      console.log(this.props.user.error);
      return (<div>An unexpected error occurred</div>);
    }

    switch(this.state.field){
      case 'group':
        error = <div style={errorStyle}>{this.state.error}</div>;
        break;
      default:
        error = null
        break;
    }

    if(this.props.data.company){
        roleCard =  <Card>
                      <CardHeader
                        title={this.state.username}
                        titleStyle={{fontSize: '25px'}}
                        subtitle={"User Roles"}
                        subtitleColor="teal"
                        subtitleStyle={{fontSize: '18px'}}
                      />
                      {this.props.data.company.groups.map((group, index) => {
                        if(group.type === "User" && group.name !== "Customer" && group.name !== "Subcontractor"){
                          if(group.members.indexOf(this.state.username) !== -1){
                            this.state.roles.push(group.name);
                          }
                          for(let x = 0; x < group.members.length; x++){
                            if(group.members[x].username === this.state.username && group.name === "SuperAdmin"){
                              return (<CardText key={index}>
                                        <Toggle
                                          label={group.name}
                                          labelStyle={{fontSize: '15px'}}
                                          defaultToggled={!this.state.toggled}
                                          style={{width: '50%'}}
                                          trackStyle={{backgroundColor: '#00B1B3'}}
                                          trackSwitchedStyle={{backgroundColor: '#612a60'}}
                                          thumbStyle={{backgroundColor: '#e2eceb'}}
                                          thumbSwitchedStyle={{backgroundColor: '#00B1B3'}}
                                          value={group.name}
                                          onToggle={this.onToggle}
                                        />
                                      </CardText>
                                      )
                            } else if(group.members[x].username === this.state.username){
                              return (<CardText key={index}>
                                        <Toggle
                                          label={group.name}
                                          labelStyle={{fontSize: '15px'}}
                                          defaultToggled={!this.state.toggled}
                                          style={{width: '50%'}}
                                          trackStyle={{backgroundColor: '#00B1B3'}}
                                          trackSwitchedStyle={{backgroundColor: '#612a60'}}
                                          thumbStyle={{backgroundColor: '#e2eceb'}}
                                          thumbSwitchedStyle={{backgroundColor: '#00B1B3'}}
                                          value={group.name}
                                          onToggle={this.onToggle}
                                          disabled={this.state.roles.indexOf("SuperAdmin") === -1 ? false : true }
                                        />
                                      </CardText>
                                      )
                            }
                          }
                          return (
                            <CardText key={index}>
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
                                disabled={this.state.roles.indexOf("SuperAdmin") === -1 ? false : group.name === "SuperAdmin" ? false : true }
                              />
                            </CardText>
                          )
                        }
                      })}
                      <CardActions>
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
                      </CardActions>
                    </Card>
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body">
            <div className="form-group">
              <div className="row">
                {roleCard}
                {error}
              </div>
            </div>
        </div>
      </div>
    )
  }
};

const UserEditFormWithMutation = compose(
  graphql(GetCompanyInfoQuery, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.params.id
      },
      fetchPolicy: 'cache-and-network'
    })
  }),
  graphql(removeFromGroupMutation, { name: "RemoveFromGroup" }),
  graphql(AddToGroupMutation, { name: "AddToGroup" })
  )(withRouter(UserEditForm));

export default UserEditFormWithMutation;
