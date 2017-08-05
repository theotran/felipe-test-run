import React, {Component} from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import CircularProgress from 'material-ui/CircularProgress';
import { GetInvertersQuery } from '../../../queries/';

const options = {
  //afterSearch: afterSearch,  // define a after search hook
  defaultSortName: 'model',
  defaultSortOrder: 'asc',
  noDataText: 'N/A'
};


//Sort
let order = 'desc';

class EquipmentInverters extends Component {
  constructor(props) {
    super(props);
  }

  handleBtnClick = () => {
    if (order === 'desc') {
      this.refs.table.handleSort('asc', 'model');
      order = 'asc';
    } else {
      this.refs.table.handleSort('desc', 'model');
      order = 'desc';
    }
  }

  render() {
    if (this.props.data.loading) {
      return (
       <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Equipment.gif'/>
         <br />
         Please Wait While We Load The Inverter List
        </div>
        );
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (
        <div className="load-div">
          Error
        </div>
        );
    }
    let clonedInverterData = this.props.data.getInverters.map((inverter) => {
      let clonedInverter = { ...inverter}
      clonedInverter.pdf = 'N/A';
      clonedInverter.dxf = 'N/A';
      return clonedInverter;
    });
    return(
      <div>
        <div className="panel panel-success">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">INVERTERS</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/equipment/Inverter_Icon.svg' height="35" width="50"/>
              </div>
            </div>
            <BootstrapTable ref='table'
              data={
                clonedInverterData
              }
              keyField='id' search={ true } options={ options } pagination >
              <TableHeaderColumn dataField='manufacturer' dataSort={ true } width='20%'>MAKE</TableHeaderColumn>
              <TableHeaderColumn dataField='model' dataSort={ true } width='35%'>MODEL</TableHeaderColumn>
              <TableHeaderColumn dataField='acNominalVoltage' dataSort={ true } width='12.5%'>VOLTAGE</TableHeaderColumn>
              <TableHeaderColumn dataField='acWattsMaxOut' dataSort={ true } width='15%'>AC OUTPUT</TableHeaderColumn>
              <TableHeaderColumn dataField='pdf' dataSort={ true } width='8.75%'>PDF</TableHeaderColumn>
              <TableHeaderColumn dataField='dxf' dataSort={ true } width='8.75%'>DXF</TableHeaderColumn>
            </BootstrapTable>

          </div>
        </div>
      </div>
    )
  }
}

const InvertersWithQuery = graphql(GetInvertersQuery, {
  options: () => ({
    fetchPolicy: 'cache-and-network'
  })
})(EquipmentInverters)

export default InvertersWithQuery;
