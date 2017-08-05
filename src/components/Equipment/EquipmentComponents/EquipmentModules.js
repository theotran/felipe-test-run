import React, {Component} from 'react';
import { graphql } from 'react-apollo';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { GetPanelsQuery } from '../../../queries/';


const options = {
  //afterSearch: afterSearch,  // define a after search hook
  defaultSortName: 'model',
  defaultSortOrder: 'asc'
};


//Sort
let order = 'desc';

class EquipmentModules extends Component {
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
         Please Wait While We Load The Modules List
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
    let clonedPanelData = this.props.data.getPanels.map((panel) => {
      let clonedPanel = { ...panel}
      clonedPanel.pdf = 'N/A';
      clonedPanel.dxf = 'N/A';
      return clonedPanel;
    });
    console.log('cloned panels', clonedPanelData)
    return(
      <div>
        <div className="panel panel-success">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">MODULES</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/equipment/Module_Icon.svg' height="35" width="50"/>
              </div>
            </div>
            <BootstrapTable ref='table' data={clonedPanelData} keyField='id' search={ true } options={ options } pagination >
              <TableHeaderColumn dataField='manufacturer' dataSort={ true } width='30%'>MAKE</TableHeaderColumn>
              <TableHeaderColumn dataField='model' dataSort={ true } width='25%'>MODEL</TableHeaderColumn>
              <TableHeaderColumn dataField='stcWatts' dataSort={ true } width='12.5%'>DC OUTPUT</TableHeaderColumn>
              <TableHeaderColumn dataField='cellCount' dataSort={ true } width='15%'>CELL COUNT</TableHeaderColumn>
              <TableHeaderColumn dataField='pdf' dataSort={ true } width='8.75%'>PDF</TableHeaderColumn>
              <TableHeaderColumn dataField='dxf' dataSort={ true } width='8.75%'>DXF</TableHeaderColumn>
            </BootstrapTable>

          </div>
        </div>
      </div>
    )
  }
}

const ModulesWithQuery = graphql(GetPanelsQuery, {
  options: () => ({
    fetchPolicy: 'cache-and-network'
  })
})(EquipmentModules)

export default ModulesWithQuery;
