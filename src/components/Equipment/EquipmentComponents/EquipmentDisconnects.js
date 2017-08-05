import React, {Component} from 'react';
import { graphql } from 'react-apollo';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { GetPanelsQuery } from '../../../queries/';

import UnderConstructionPage from '../../UnderConstruction';

console.log(UnderConstructionPage)

const options = {
  //afterSearch: afterSearch,  // define a after search hook
  defaultSortName: 'model',
  defaultSortOrder: 'asc'
};


//Sort
let order = 'desc';

class EquipmentDisconnects extends Component {
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
    /*if (this.props.data.loading) {
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
    }*/
    return(
      <div>
        <div className="panel panel-success">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">DISCONNECTS</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/equipment/Disconnect_Icon.svg' height="35" width="50"/>
              </div>
            </div>
            <UnderConstructionPage />
          </div>
        </div>
      </div>
    )
  }
}

// const DisconnectsWithQuery = graphql(GetPanelsQuery, {
//   options: () => ({
//     fetchPolicy: 'cache-and-network'
//   })
// })(EquipmentDisconnects)

// export default DisconnectsWithQuery;
export default EquipmentDisconnects;
