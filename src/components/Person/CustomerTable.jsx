import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

import AddPersonModal from './AddPersonModal';

let order = 'desc';

let options = {
  defaultSortName: 'firstName',
  defaultSortOrder: 'asc'
}

class CustomerTable extends Component {



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
    return <Link to={`/customers/${row.id}`}>{cell}</Link>;
  }

  render() {
    console.log(this.props.data.getPeople)
    if(this.props.data.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/customers.gif'/>
         <br />
         Please Wait While We Load Your Customer List
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

    return (
      <div>
        <div className="panel panel-success">

        <div className="col-md-12 pageHeader">
                  <h4 className="pageHeaderText">CUSTOMERS</h4>
                  <img className="customIconsSidebar" role="presentation" src='/images/Customers_Icon.svg' height="35" width="50"/>
              </div>

          <div className="panel-body">

            <div className="tableAddButton">
              <AddPersonModal />
            </div>

            <BootstrapTable ref='table' data={ this.props.data.getPeople } keyField='id' search={ true } pagination options={options}>
                <TableHeaderColumn dataField='firstName' dataSort={ true } dataFormat={ this.nameFormatter }>First Name</TableHeaderColumn>
                <TableHeaderColumn dataField='lastName' dataSort={ true }>Last Name</TableHeaderColumn>
            </BootstrapTable>

          </div>
        </div>
      </div>
    );
  }
}


const getPeopleQuery = gql`
  query {
    getPeople(group: "Customer", type: "Person"){
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

const CustomerTableWithData = graphql(getPeopleQuery, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(CustomerTable);

export default CustomerTableWithData;
