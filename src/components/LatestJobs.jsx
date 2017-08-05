import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import { Button } from 'semantic-ui-react';

class JobTable extends Component {

  nameFormatter(cell, row) {
    return <Link to={`/commercial/project/${row.id}/site`}>{cell}</Link>;
  }

  render() {
    if(this.props.data.loading) {
      return (
        <div className="load-div">
          Loading
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
    // console.log("jobSlice" , this.props.data.getJobs.slice(0, 5));
    let firstFive = null;
    if(this.props.jobs && this.props.jobs.length > 0){
      firstFive = [];
      let sliceTo;
      this.props.jobs.length >= 5 ? sliceTo = 5 : sliceTo = this.props.jobs.length;
      this.props.jobs.slice(0, sliceTo).map((job) =>{
        let amount = 0;
        if(job.contract && job.contract.amount){
          amount = parseFloat(job.contract.amount.toFixed(2)).toLocaleString();
        }
        amount.toString().indexOf('.') === -1 ? amount+= '.00' : amount+= '';
        firstFive.push({
          id: job.id,
          name: job.name,
          number: job.number,
          type: job.type,
          contract: '$ ' + amount,
          date: (job.contract && job.contract.startDate) ? moment(job.contract.startDate).format("MMMM Do YYYY") : "Unsigned"
        })

        return job;

      })
    }
    return (
      <div>
        <div className="panel panel-success">

          {/* <div className="panel-heading">Latest Jobs</div> */}
          <div className="row">
            <div className="col-md-3 latestJobsHeader">
              <h4 className="tabHeaderText">Latest Jobs</h4>
            </div>
          </div>
          <div className="panel-body">
            <div>
              <BootstrapTable ref='table' data={ firstFive } keyField='id' >
                <TableHeaderColumn dataField='name' dataFormat={ this.nameFormatter }>Name</TableHeaderColumn>
                <TableHeaderColumn dataField='number'>Number</TableHeaderColumn>
                <TableHeaderColumn dataField='date'>Contract Date</TableHeaderColumn>
                <TableHeaderColumn dataField='contract'>Contract Amount</TableHeaderColumn>
              </BootstrapTable>
              {/* <Link to="/projects" type="button" className="btn btn-secondary pull-right">View All</Link> */}

            <div className="latestJobsViewAll">
              <Button color="teal" content='VIEW ALL' icon='unhide' labelPosition='left' onClick={(e, data) => {browserHistory.push('/projects')}}/>
              {/* <RaisedButton
                labelColor={"#fff"}
                backgroundColor={"#00b1b3"}
                label={'View All'}
                onTouchTap={(e) => { browserHistory.push('/projects') }}
              /> */}
            </div>
            </div>
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
        startDate
      }
    }
  }`;

const JobTableWithData = graphql(getJobsQuery, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(JobTable);

export default JobTableWithData;
