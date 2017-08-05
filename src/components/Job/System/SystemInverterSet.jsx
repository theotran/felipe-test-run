import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
// import update from 'immutability-helper';
// import client from './../../../index.js';
// import { withRouter } from 'react-router';
import GetInvertersQuery from '../../../queries/GetInvertersQuery';
// import GetCombinersQuery from '../../../queries/GetCombinersQuery';
// import Dropdown from '../../Dropdown';
import _ from 'lodash';
import { Dropdown, Search, Label } from 'semantic-ui-react';
import LabelInput from '../../LabelInput';
import FormActionButton from '../../FormActionButton';
import PanelArray from './PanelArray';
import withSelectQuery from '../../DropdownWithSelectQueryHOC';

// let cachedJobQuery;

// const DropdownWithInverters = withSelectQuery(Dropdown, GetInvertersQuery, 'getInverters', ['model']);
// const DropdownWithCombiners = withSelectQuery(Dropdown, GetCombinersQuery, 'getCombiners', ['id']);

const resultRenderer = ({ id, model }) => (
  <Label key={id} content={model} />
)

class SystemInverterSet extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleInverterSet = this.handleInverterSet.bind(this);
    this.handleLocationSet = this.handleLocationSet.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleCombinerSelect = this.handleCombinerSelect.bind(this);
    this.handlePanelboardSet = this.handlePanelboardSet.bind(this);


    if(this.props.inverter){
      this.state = {
        id: this.props.inverter.id ? this.props.inverter.id : '',
        inverterNumber: this.props.inverterNumber,
        location: this.props.inverter.location ? this.props.inverter.location : '',
        count: this.props.inverter.count ? this.props.inverter.count : '',
        isMicro: this.props.inverter.isMicro ? this.props.inverter.isMicro : false,
        panels: this.props.inverter.panels ? this.props.inverter.panels : [],
        isLoading: false,
        value: '',
        results: [],
        testRun: null
      }
    }

  }
  // update state on inverter select
  handleInverterSet(value) {
    console.log(value);
    this.props.changeInverter(this.props.inverterNumber, 'id', value);
  }
  handlePanelboardSet(value) {
    console.log(value);
    this.props.changeInverter(this.props.inverterNumber, 'panelboard', value);
  }
  handleLocationSet(value) {
    this.props.changeInverter(this.props.inverterNumber, 'location', value);
  }
  handleCountSet(value) {
    this.props.changeInverter(this.props.inverterNumber, 'count', value);
  }
  handleDistanceFromSet(value) {
    this.props.changeInverter(this.props.inverterNumber, 'distanceFrom', value);
  }
  handleOptimizerToggle(value){
    this.props.changeInverter(this.props.inverterNumber, 'hasOptimizers', !this.props.inverter.hasOptimizers);
  }
  handleCombinerSelect(value){
    this.props.changeInverter(this.props.inverterNumber, 'combiner', value);
  }
  handleBlur(value) {
    this.props.changeInverter(this.props.inverterNumber, 'id', value);
  }
  handleChange() {
    this.props.changeInverter();
  }
  handlePanelChange(index, key, value) {
    // let newValue;
    // key === 'id' ? newValue = value.id : newValue = value;
    this.props.changePanel(this.props.inverterNumber, index, key, value);
  }

  // search stuff
  resetComponent = () => {
    this.setState({ isLoading: false, results: [], value: '' })
  }

  render() {
    // console.log(this);
    // initialize conditional rendering variables
      let inverterRow = null;
      let combinerRow = null;
      let optimizerRow = null;
      let panelButton;
      let distanceTo;
      let panelboardSelect = null;
    // render combiner checkbox for multiple panels where not microinverter

      const combinerMenu = [
        {
          key: "none",
          value: "none",
          text: "None"
        },
        {
          key: "noDisco",
          value: "noDisco",
          text: "without Disconnect"
        },
        {
          key: "disco",
          value: "disco",
          text: "with Disconnect"
        }
      ]
      if(this.props.inverter.panels.length >= 2 && this.props.inverter.isMicro === false){
        combinerRow = (() => {
          return(

            <Dropdown
              placeholder='Select Combiner'
              fluid selection options={combinerMenu}
              value={this.props.inverter.combiner}
              onChange={(e, data) => {
                console.log(data);
                this.handleCombinerSelect(data.value);
              }}
            />
          )
        })();
      } else {
        combinerRow = null;
      }
    // render optimizer checkbox if inverter can be optimized
      if(this.props.inverter.canOptimize){
        optimizerRow = (() => {
          return(
            <div className="ui checkbox">
              <input id={"addOptimizers" + this.props.inverterNumber} checked={ this.props.inverter.hasOptimizers } type="checkbox" onChange={(e) => {this.handleOptimizerToggle()}}/>
              <label htmlFor={"addOptimizers" + this.props.inverterNumber}>Add&nbsp;Optimizers</label>
            </div>
          )
        })();
      } else {
        optimizerRow = null;
      }
    // render add panel button only if inverter is selected
      if(this.props.inverter.id){
         panelButton = <FormActionButton onClick={()=>{this.props.addPanelArray(this.props.inverterNumber)}} text="+"/>
      } else {
        panelButton = <FormActionButton onClick={()=>{alert("Select Inverter First")}} text="+"/>
      }
    // change distance to name depending on if panelboards exist and render panelboard select
      if(this.props.panelboards !== null ){
        distanceTo = "Panelboard"
        if(this.props.panelboards.length > 1){
          panelboardSelect = <Dropdown label="Panelboard"  defaultVal={this.props.inverter.panelboard ? this.props.inverter.panelboard : "none"} menuItems={this.props.panelboards} changeHandler={this.handlePanelboardSet} className="col-md-3"/>
        }
      } else {
        distanceTo = "Disconnect"
      }

      if(this.props.inverter.isMicro && this.props.data.getInverters){
        console.log("in isMicro")
        inverterRow = (() => {
          console.log("in isMicro")
          return(
            <div className="row">
              <label>Search for an Inverter Manufacturer or Model</label>
                  <Dropdown
                    placeholder='Select Inverter'
                    fluid search selection options={this.props.data.getInverters.map((inverter, index) => {
                      return {
                        key: index,
                        text: `${inverter.manufacturer}:  ${inverter.model}`,
                        value: index
                      }
                    })}
                    value={(()=>{for(let i=0; i < this.props.data.getInverters.length; i++){
                      if(this.props.data.getInverters[i].id === this.props.inverter.id){
                        return i;
                      }
                    }})()}
                    onChange={(e, data) => {
                      this.handleInverterSet(this.props.data.getInverters[data.value]);
                    }}
                  />
              <LabelInput label={"Distance To " + distanceTo} name='location' type='number' value={this.props.inverter.count} placeholder="Set Count" className="col-md-2" onChange={(e)=>{this.handleCountSet(e.target.value)}} />
              {panelboardSelect}
            </div>
          )
        })();
      }
      if(!this.props.inverter.isMicro && this.props.data.getInverters){
        console.log("in notMicro")
        inverterRow = (()=> {
          console.log("in notMicro")
          return(
            <div className="row">
              {/*<DropdownWithInverters name="id" label="Inverter" defaultId={this.props.inverter.id} defaultOption="--Select Inverter--" changeHandler={this.handleInverterSet} className="col-md-3"/>*/}
                <label>Search for an Inverter Manufacturer or Model</label>
                  <Dropdown
                    placeholder='Select Inverter'
                    fluid search selection options={this.props.data.getInverters.map((inverter, index) => {
                      return {
                        key: index,
                        text: `${inverter.manufacturer}:  ${inverter.model}`,
                        value: index
                      }
                    })}
                    value={(()=>{for(let i=0; i < this.props.data.getInverters.length; i++){
                      if(this.props.data.getInverters[i].id === this.props.inverter.id){
                        return i;
                      }
                    }})()}
                    onChange={(e, data) => {
                      this.handleInverterSet(this.props.data.getInverters[data.value]);
                    }}
                  />
              <LabelInput label="Location" name='location' value={this.props.inverter.location} placeholder="Location Description" className="col-md-3" onChange={(e)=>{this.handleLocationSet(e.target.value)}} onBlur={(e)=>{this.handleLocationSet(e.target.value)}}/>
              <LabelInput label="Set Count" name='location' type='number' value={this.props.inverter.count} placeholder="Set Count" className="col-md-1" onChange={(e)=>{this.handleCountSet(e.target.value)}}/>
              <LabelInput label={"Distance To " + distanceTo} name='location' type='number' value={this.props.inverter.distanceFrom} placeholder="Distance in ft." className="col-md-2" onChange={(e)=>{this.handleDistanceFromSet(e.target.value)}} onBlur={(e)=>{this.handleDistanceFromSet(e.target.value)}}/>
              {panelboardSelect}
              <div className="row">
                {combinerRow}
                {optimizerRow}
              </div>
            </div>
          )
        })()
      }

    return (
      <div className="panel-heading">
        <div className="panel panel-default">
          <div className="panel-heading">
            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">INVERTER GROUP&nbsp;{this.props.inverterNumber + 1}</h4>
                  <img className="tabHeaderLogo" role="presentation" src='/images/System_Icon_p.svg' height="30"/>
              </div>
            </div>
            <div className="row">
            {inverterRow}
            </div>
            <div className="row">
            {
              this.props.inverter.panels.map((panel, index) => {
                return (
                   <PanelArray key={index} panel={panel} panelNum={index} changeHandler={this.handlePanelChange}/>
                )
              })
            }
              Panels&nbsp;&nbsp;&nbsp;&nbsp;
              {panelButton}
          </div>
          </div>
        </div>
      </div>
    )
  }
}
const SystemInverterSetWithInverters = graphql(GetInvertersQuery)(SystemInverterSet);
export default SystemInverterSetWithInverters;
