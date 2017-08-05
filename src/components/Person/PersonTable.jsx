import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';
import client from './../../index.js';

import AddEmployeeModal from './AddEmployeeModal';

let order = 'desc';

let options = {
  defaultSortName: 'firstName',
  defaultSortOrder: 'asc'
}

class PersonTable extends Component {


  componentWillMount() {
    client.resetStore();
  }

  handleBtnClick = () => {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'name');
      order = 'desc';
    }
  }

  nameFormatter(cell, row) {
    return <Link to={`/employees/${row.id}`}>{cell}</Link>;
  }

  render() {
    let peopleArr;

    console.log(this.props.data.getPeople)
    if(this.props.data.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Employees.gif'/>
         <br />
         Please Wait While We Load Your Employee List
        </div>
        );
    }

    if(this.props.data.error) {
      console.log(this.props.data.error);
      return (
        <div className="load-div">
          Error
        </div>
      );
    }

    peopleArr = this.props.data.getPeople.map(person => {return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      // title: person.employeeInfo.title,
      // employeeStatus: person.employeeInfo.employeeStatus
    }});

    return (
      <div>
        <div className="panel panel-success">

        <div className="col-md-12 pageHeader">
                  <h4 className="pageHeaderText">EMPLOYEES</h4>
                  <img className="customIconsSidebar" role="presentation" src='/images/Customers_Icon.svg' height="35" width="50"/>
              </div>

          <div className="panel-body">


            <div className="tableAddButton">
              <AddEmployeeModal />
            </div>

            <BootstrapTable ref='table' data={ peopleArr } keyField='id' search={ true } pagination options={options}>
                <TableHeaderColumn dataField='firstName' dataSort={ true } dataFormat={ this.nameFormatter }>First Name</TableHeaderColumn>
                <TableHeaderColumn dataField='lastName' dataSort={ true }>Last Name</TableHeaderColumn>
                <TableHeaderColumn dataField='title' dataSort={ true } >Title</TableHeaderColumn>
                <TableHeaderColumn dataField='employeeStatus' dataSort={ true }>Employee Status</TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
      </div>
    );
  }
}


const getPeopleQuery = gql`
  query {
    getPeople(group: "Employee", type: "Person"){
      id
      firstName
      lastName
      user {
        id
        username
      }
      employeeInfo {
        title
        employeeStatus
      }
    }
  }
`;

const PersonTableWithData = graphql(getPeopleQuery, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(PersonTable);

export default PersonTableWithData;
