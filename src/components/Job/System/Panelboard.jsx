import React, {Component} from 'react';
import { compose } from 'react-apollo';
// import gql from 'graphql-tag';
// import client from './../../../index.js';
// import GetJobQuery from '../../../queries/GetJobQuery';

import { withRouter } from 'react-router';
import LabelInput from '../../LabelInput';
import Dropdown from '../../Dropdown';
// import FormActionButton from '../../FormActionButton';
// import SystemInverterSet from './SystemInverterSet';
// import update from 'immutability-helper';



// let cachedJobQuery;

class Panelboard extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);  
  }
  addPanelboard(){

  }
  handleChange() {
    console.log("panelboard handleChange");
  }
  render() {
    console.log("PanelBoard", this);
    if(this.props.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    let DistanceToInput;
    if(this.props.panelboards.length > 0){
      let DistanceTo = this.props.index === 0 ? 'Disconnect' : 'Master Panelboard';
      DistanceToInput = <LabelInput label={"Distance to " + DistanceTo} name='distance' placeholder={"Distance to " + DistanceTo} className="col-md-6" type="number"/>
    }

    let Inverters = null;
    if(this.props.panelboard.inverter){
      // Inverters = (this.props.panelboard.inverters.map((panelboard, index, array) => {

      // }))();
    }

    return (
        <div className="panel-body">
          <div className="row">
            <Dropdown label={this.props.panelboards[this.props.index].name} defaultOption="--Default Panelboard--"  menuItems={["--Default Panelboard--"]} className="col-md-3"/>
            {DistanceToInput}
            {Inverters}
          </div>
        </div>
    )
  }
}





const PanelboardWithMutation = compose(
  // graphql(createConstructionMutation, {
  //   name: 'createConstruction',//naming the mutation so you can call it
  //   options: {
  //     fetchPolicy: 'cache-and-network'
  //   }
  // }),
  // graphql(updateConstructionMutation, {
  //   name: 'updateConstruction',//naming the mutation so you can call it
  //   options: {
  //     fetchPolicy: 'cache-and-network'
  //   }
  // })
)(withRouter(Panelboard));

export default PanelboardWithMutation;
