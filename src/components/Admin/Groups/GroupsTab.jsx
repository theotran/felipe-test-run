import React, { Component } from 'react';
import { Link } from 'react-router';
import AddGroupModal from './AddGroupModal';

import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Dropdown } from 'semantic-ui-react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import AddPersonToGroupModal from './AddPersonToGroupModal';
import InviteUserToGroupModal from './InviteUserToGroupModal';

let optionsUser = {
  defaultSortName: 'username',
  defaultSortOrder: 'asc'
}
let options = {
  defaultSortName: 'firstName',
  defaultSortOrder: 'asc'
}

class GroupsTab extends Component {
  constructor(props) {
    super(props);

    console.log(this.props)

    this.state = {
      selected: '',
      group: {}
    }
  }

  userFormatter(cell, row) {
    return <Link to={`/admin/permissions/${row.id}`}>{cell}</Link>;
  }

  nameFormatter(cell, row) {
    return <Link to={`/people/${row.id}`}>{cell}</Link>;
  }

  render() {
    console.log(this.props)
    console.log("Groups Tabs State", this.state)

    let groupInfo;
    let userGroupRow;
    let personGroupRow;
    let userGroupHeader;
    let personGroupHeader;

    if(this.state.group.type === 'Person'){
          groupInfo = <Card>
                        <CardHeader
                          title={this.state.group.name}
                          subtitle={"Members"}
                        />
                        <CardText>
                          {this.state.group.members ? this.state.group.members.map((member, index) => {
                            return (
                              <div key={index}>
                                <p>{member.firstName + " " + member.lastName}</p>
                              </div>
                            )
                          }) : ''}
                        </CardText>
                        <CardActions>
                        </CardActions>
                      </Card>
    }

    if(this.state.group.type === 'User'){
          groupInfo = <Card>
                        <CardHeader
                          title={this.state.group.name}
                          subtitle={"Members"}
                        />
                        <CardText>
                          {this.state.group.members ? this.state.group.members.map((member, index) => {
                            return (
                              <div key={index}>
                                <p>{member.username}</p>
                              </div>
                            )
                          }) : ''}
                        </CardText>
                        <CardActions>
                        </CardActions>
                      </Card>
    }

    if(this.state.group.type === "User"){
      let userData = [];
      this.state.group.members.map((user, index) => {
        userData.push({
          id: user.id,
          username: user.username,
          firstName: user.person.firstName,
          lastName: user.person.lastName
        })
        return user;
      })

      userGroupHeader = <h3 className="adminTableHeader">{this.state.group.name} Members - Users</h3>;
      userGroupRow =  <BootstrapTable ref='table' data={ userData } keyField='id' search={ true } pagination options={optionsUser}>
                        <TableHeaderColumn dataField='username' dataSort={ true } dataFormat={ this.userFormatter }>User Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='firstName' dataSort={ true }>First Name</TableHeaderColumn>
                      </BootstrapTable>
    } else {
      userGroupRow = null;
      userGroupHeader = null;
    }
    if(this.state.group.type === "Person"){
      personGroupHeader = <h3 className="adminTableHeader">{this.state.group.name} Members - People</h3>;
      personGroupRow =  <BootstrapTable ref='table' data={ this.state.group.members } keyField='id' search={ true } pagination options={options}>
                          <TableHeaderColumn dataField='firstName' dataSort={ true } dataFormat={ this.nameFormatter }>First Name</TableHeaderColumn>
                          <TableHeaderColumn dataField='lastName' dataSort={ true }>Last Name</TableHeaderColumn>
                        </BootstrapTable>
    } else {
      personGroupRow = null;
      personGroupHeader = null;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">USER GROUPS</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Groups_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <div className='row'>
            <InviteUserToGroupModal GroupId={this.state.group.id} CompanyName={this.props.company.name}  CompanyGroups={this.props.company.groups}/>
          </div>
          <div className="row">
            <div className="col-md-3">
              <label htmlFor="">Groups</label>
              <Dropdown
                placeholder='Groups'
                fluid selection options={this.props.company.groups.filter((group)=>{
                    return group.type === 'User' && group.name !== 'Customer' && group.name !== 'Subcontractor';
                }).map((group)=>{
                  return {key: group.id, text: group.name, value: group.id};
                })}
                value={this.state.selected}
                onChange={(e, data) => {
                  for(let i=0; i < this.props.company.groups.length; i++) {
                    if(this.props.company.groups[i].id === data.value) {
                      this.setState({
                        selected: data.value,
                        group: this.props.company.groups[i]
                      })
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* <div className="row">
            <div className="col-md-12">
              {groupInfo}
            </div>
          </div> */}

          <div >
            <div >
              {userGroupHeader}
              {personGroupHeader}
              {userGroupRow}
              {personGroupRow}
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default GroupsTab;
