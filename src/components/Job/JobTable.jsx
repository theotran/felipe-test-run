import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

import AddJobModal from './AddJobModal';

// function afterSearch(searchText, result) {
//   console.log('Your search text is ' + searchText);
//   console.log('Result is:');
//   for (let i = 0; i < result.length; i++) {
//     console.log('Fruit: ' + result[i].id + ', ' + result[i].name);
//   }
// }

const options = {
  //afterSearch: afterSearch,  // define a after search hook
  defaultSortName: 'name',
  defaultSortOrder: 'asc'
};


//Sort
let order = 'desc';

class JobTable extends Component {

  handleBtnClick = () => {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'name');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'name');
      order = 'desc';
    }
  }

  onRowClick(row) {
    alert(`You clicked this row: ${row}`);
  }

  nameFormatter(cell, row) {
    return <Link to={`/commercial/project/${row.id}/site`}>{cell}</Link>;
  }

  render() {


    if(this.props.data.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Projects
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
    console.log(this.props);

    let jobData = null;
    if(this.props.data.getJobs && this.props.data.getJobs.length > 0){
      jobData = []
      this.props.data.getJobs.map((job) =>{
        jobData.push({
          id: job.id,
          name: job.name,
          number: job.number,
          type: job.type,
          contract: job.contract ? job.contract.amount ? '$' + job.contract.amount.toFixed(2) : '$0.00' : '$0.00',
          status: job.status
        })
        return job;
      })
    }
    return (
      <div>
        <div className="panel panel-success">

          <div className="col-md-12 pageHeader">
              <h4 className="pageHeaderText">PROJECTS</h4>
              <img className="customIconsSidebar" role="presentation" src='/images/Projects_Icon.svg' height="35" width="50"/>
          </div>
          <div className="panel-body">

            <div className="tableAddButton">
              <AddJobModal />
            </div>

            <BootstrapTable ref='table' data={jobData} keyField='id' search={ true } options={ options } pagination >
                <TableHeaderColumn dataField='name' dataSort={ true } dataFormat={ this.nameFormatter }>NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='number' dataSort={ true }>NUMBER</TableHeaderColumn>
                <TableHeaderColumn dataField='type' dataSort={ true }>TYPE</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='status' dataSort={ true }>SIZE</TableHeaderColumn> */}
                <TableHeaderColumn dataField={'contract'} dataSort={ true }>AMOUNT</TableHeaderColumn>
                <TableHeaderColumn dataField='status' dataSort={ true }>STATUS</TableHeaderColumn>
            </BootstrapTable>

          </div>
        </div>
      </div>
    );
  }
}


const getJobsQuery = gql`
  query {
    getJobs {
      id
      name
      number
      type
      status
      contract {
        id
        amount
      }
    }
  }`;

const JobTableWithData = graphql(getJobsQuery, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(JobTable);

export default JobTableWithData;
