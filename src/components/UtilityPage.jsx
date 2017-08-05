import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';

import { utilities } from '../UniqueUtilities';
let clonedUtilities = utilities.map((utility) => {
  for (let prop in utility) {
    if (utility[prop] === null) {
      utility[prop] = 'N/A';
    }
  }
  utility.phone = 'N/A';
  utility.link = 'N/A';
  return utility;
})
const options = {
  //afterSearch: afterSearch,  // define a after search hook
  defaultSortName: 'name',
  defaultSortOrder: 'asc'
};


//Sort
let order = 'desc';

class UtilityPage extends Component {

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

  render() {
    if (this.props.loading) {
      return (
        <div className="load-div">
          <CircularProgress color={"#00B1B3"} size={30} thickness={1} />
        </div>
        );
    }

    if (this.props.error) {
      console.log(this.props.error);
      return (
        <div className="load-div">
          Error
        </div>
        );
    }
    // let utilitiesData = null;
    // if (this.props.getUtilities && this.props.getUtilities.length > 0){
    //   utilitiesData = []
    //   this.props.getUtilities.map((utility) =>{
    //     utilitiesData.push({
    //       id: utility.id,
    //       name: utility.name,
    //       state: utility.state,
    //       zip: utility.zip,
    //       ownership: utility.ownership,
    //       link: utility.link,
    //     })
    //     return utility;
    //   })
    // }

    return (
      <div>
        <div className="panel panel-success">
          <div className="col-md-12 pageHeader">
              <h4 className="pageHeaderText">UTILITIES</h4>
              <img className="customIconsSidebar" role="presentation" src='/images/Utility_Icon.svg' height="35" width="50"/>
          </div>
          <div className="panel-body">

            <BootstrapTable ref='table' data={clonedUtilities} keyField='id' search={ true } options={ options } pagination >
                <TableHeaderColumn dataField='name' dataSort={ true } width='30%'>NAME</TableHeaderColumn>
                <TableHeaderColumn dataField='state' dataSort={ true } width='10%'>STATE</TableHeaderColumn>
                <TableHeaderColumn dataField='zip' dataSort={ true } width='30%'>ZIP</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='status' dataSort={ true }>SIZE</TableHeaderColumn> */}
                <TableHeaderColumn dataField='phone' dataSort={ true } width='15%'>PHONE</TableHeaderColumn>
                <TableHeaderColumn dataField='link' dataSort={ true } width='15%'>WEBSITE</TableHeaderColumn>
            </BootstrapTable>

          </div>
        </div>
      </div>
    );
  }
}

// const getUtilitiesQuery = gql`
//   query {
//     getUtilities {
//       id
//       name
//       state
//       zip
//       ownership
//       link
//     }
//   }`;

// const UtilityPageWithData = graphql(getUtilitiesQuery, {
//   options: {
//     fetchPolicy: 'cache-and-network'
//   }
// })(UtilityPage);

export default UtilityPage;
