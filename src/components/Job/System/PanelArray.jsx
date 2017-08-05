import React, {Component} from 'react';
import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
// import update from 'immutability-helper';
// import client from './../../../index.js';
// import { withRouter } from 'react-router';
// import GetJobQuery from '../../../queries/GetJobQuery';
// import Dropdown from '../../Dropdown';
import { Dropdown } from 'semantic-ui-react';
import LabelInput from '../../LabelInput';
// import FormActionButton from '../../FormActionButton';
// import Checkbox from '../../Checkbox';
import gql from 'graphql-tag';
// import withSelectQuery from '../../DropdownWithSelectQueryHOC';

import GetPanelsQuery from '../../../queries/GetPanelsQuery';


// const DropdownWithPanels = withSelectQuery(Dropdown, GetPanelsQuery, 'getPanels', ['model']);

class PanelArray extends Component {
  constructor(props) {
    super(props);

    this.handlePanelSet = this.handlePanelSet.bind(this);
    this.handleArrayCount = this.handleArrayCount.bind(this);
    this.handleRows = this.handleRows.bind(this);
    this.handlePerRow = this.handlePerRow.bind(this);
    this.handleOrientation = this.handleOrientation.bind(this);
    this.handleAzimuth = this.handleAzimuth.bind(this);
    this.handleTilt = this.handleTilt.bind(this);
    this.handleDistanceFrom = this.handleDistanceFrom.bind(this);
  }
  handlePanelSet(value) {
    console.log('handlePanelSet', value);
    this.props.changeHandler(this.props.panelNum, 'id', value);
  }
  handleArrayCount(value) {
    console.log('PanelArray ArrayCount', value);
    this.props.changeHandler(this.props.panelNum, 'arrayCount', value);
  }
  handleRows(value) {
    this.props.changeHandler(this.props.panelNum, 'rows', value);
  }
  handlePerRow(value) {
    this.props.changeHandler(this.props.panelNum, 'perRow', value);
  }
  handleOrientation(value) {
    this.props.changeHandler(this.props.panelNum, 'orientation', value);
    console.log(value);
  }
  handleAzimuth(value) {
    this.props.changeHandler(this.props.panelNum, 'azimuth', value);
  }
  handleTilt(value) {
    this.props.changeHandler(this.props.panelNum, 'tilt', value);
  }
  handleDistanceFrom(value) {
    this.props.changeHandler(this.props.panelNum, 'distanceFrom', value);
  }
  render() {
    console.log(this);
    let panelDropdown = null;
    if (this.props.data.getPanels) {
      panelDropdown = (()=>{
        return (
          <Dropdown
            placeholder='Select Panel'
            fluid search selection options={this.props.data.getPanels.map((panel, index) => {
              return {
                key: index,
                text: `${panel.manufacturer}: ${panel.model}`,
                value: index
              };
            })}
            value={(()=>{ for (let i = 0; i < this.props.data.getPanels.length; i++) {
              if (this.props.data.getPanels[i].id === this.props.panel.id) {
                return i;
              }
            } })()}
            onChange={(e, data) => {
              this.handlePanelSet(this.props.data.getPanels[data.value]);
            }}
          />
        )
      })();
    }
    return(
      <div className='panel-heading'>
        <div className='panel panel-default'>
          <div className='panel-heading'>
            {'Panel Type ' + (this.props.panelNum + 1)}
          </div>
          <div className='row'>
            {panelDropdown}
            <LabelInput label='Panel Count' name='Panel Count' type='number' value={this.props.panel.arrayCount * this.props.panel.perRow} placeholder='Panel Count' className='col-md-6' readOnly/>

          </div>
          <div className='row'>
            <LabelInput label='String Count' name='Array Count' type='number' value={this.props.panel.arrayCount} placeholder='Number of Arrays' className='col-md-6' onChange={(e)=> { this.handleArrayCount(e.target.value)} }/>
            <LabelInput label='Count Per String' name='perRow' type='number' value={this.props.panel.perRow} placeholder='Panels Per String' className='col-md-6' onChange={(e)=>{this.handlePerRow(e.target.value)}}/>
          </div>
          <div className='row'>
            <LabelInput label={'Distance from ' + (this.props.panel.hasCombiner ? 'Combiner (lf)' : 'Inverter (lf)')} name='distanceFrom' type='number' value={this.props.panel.distanceFrom} placeholder='Distance in LF' className='col-md-6' onChange={(e)=>{ this.handleDistanceFrom(e.target.value) }}/>
            {/*<LabelInput label="Rows" name='Rows' type="number" value={this.props.panel.rows} placeholder="Panel Rows" className="col-md-2" onChange={(e)=>{this.handleRows(e.target.value)}}/>*/}
            {/*<LabelInput label="Count Per Row" name='perRow' type="number" value={this.props.panel.perRow} placeholder="Panels Per Row" className="col-md-2" onChange={(e)=>{this.handlePerRow(e.target.value)}}/>*/}
            <div className='form-group col-md-6'>
                <label htmlFor=''>Orientation</label>
                <Dropdown
                  placeholder='Orientation'
                  fluid selection options={[
                    {
                      text: 'Landscape',
                      value: 'Landscape',
                    },
                    {
                      text: 'Portrait',
                      value: 'Portrait',
                    },
                  ]}
                  value={this.props.panel ? this.props.panel.orientation : ''}
                  onChange={(e, data) => {
                    console.log('VALUE IN DROPDOWN ', data)
                    this.handleOrientation(data.value)
                  }}
                />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor=''>Tilt</label>
              <Dropdown
                placeholder='Tilt'
                fluid selection options={[
                    {
                      text: 'Flat',
                      value: 'Flat',
                    },
                    {
                      text: '4.76',
                      value: '4.76',
                    },
                    {
                      text: '9.46',
                      value: '9.46',
                    },
                    {
                      text: '14.04',
                      value: '14.04',
                    },
                    {
                      text: '18.43',
                      value: '18.43',
                    },
                    {
                      text: '22.26',
                      value: '22.26',
                    },
                    {
                      text: '26.57',
                      value: '26.57',
                    },
                    {
                      text: '30.26',
                      value: '30.26',
                    },
                    {
                      text: '33.69',
                      value: '33.69',
                    },
                    {
                      text: '36.87',
                      value: '36.87',
                    },
                    {
                      text: '39.81',
                      value: '39.81',
                    },
                    {
                      text: '42.51',
                      value: '42.51',
                    },
                    {
                      text: '45',
                      value: '45',
                    },
                    {
                      text: '47.29',
                      value: '47.29',
                    },
                    {
                      text: '49.40',
                      value: '49.40',
                    },
                    {
                      text: '51.34',
                      value: '51.34',
                    },
                    {
                      text: '53.12',
                      value: '53.12',
                    },
                    {
                      text: 'Other',
                      value: 'Other',
                    },
                 ]}
                value={this.props.panel.tilt}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.handleTilt(data.value)
                }}
              />
            </div>
            <LabelInput label='Azimuth (Min 0 / Max 359)' name='azimuth' type='number' value={this.props.panel.azimuth} min="0" max="359" placeholder='Direction' className='col-md-6' onChange={(e)=>{this.handleAzimuth(e.target.value)}}/>
          </div>
        </div>
      </div>
    )
  }
}

const PanelArrayWithPanels = graphql(GetPanelsQuery)(PanelArray);
export default PanelArrayWithPanels;
