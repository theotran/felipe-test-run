import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import SectionIcon from 'material-ui/svg-icons/av/equalizer';

import LabelInput from '../../LabelInput';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddNoteModal from '../Design/AddNoteModal';
import update from 'immutability-helper';

import Notes from '../Notes';


const UpdateMeterMutation = gql`
  mutation updateMeter($id: ID, $totalKWH13mo: Float, $totalCost13mo: Float, $days13mo: Int, $number: String, $accountNumber: String, $amps: Float, $existingDrop: String, $type: String, $style: String, $tieIn: String, $transformerKVA: Float){
    updateMeter(input: { id: $id, totalKWH13mo: $totalKWH13mo, totalCost13mo: $totalCost13mo, days13mo: $days13mo, number: $number, accountNumber: $accountNumber, amps: $amps, existingDrop: $existingDrop, type: $type, style: $style, tieIn: $tieIn, transformerKVA: $transformerKVA}) {
      id
      totalKWH13mo
      totalCost13mo
      days13mo
  	  number
      accountNumber
      amps
      existingDrop
      type
      style
      tieIn
      transformerKVA
    }
  }
`;

class Meter extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      number: this.props.meter.number ? this.props.meter.number : '',
      accountNumber: this.props.meter.accountNumber ? this.props.meter.accountNumber : '',
      amps: this.props.meter.amps ? this.props.meter.amps : null,
      existingDrop: this.props.meter.existingDrop ? this.props.meter.existingDrop : '',
      type: this.props.meter.type ? this.props.meter.type : '',
      style: this.props.meter.style ? this.props.meter.style : '',
      tieIn: this.props.meter.tieIn ? this.props.meter.tieIn : '',
      transformerKVA: this.props.meter.transformerKVA ? this.props.meter.transformerKVA : null,
      totalKWH13mo: this.props.meter.totalKWH13mo ? this.props.meter.totalKWH13mo : null,
      totalCost13mo: this.props.meter.totalCost13mo ? this.props.meter.totalCost13mo : null,
      days13mo: this.props.meter.days13mo ? this.props.meter.days13mo : null,
      notes: this.props.meter.notes ? this.props.meter.notes : [],
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  handleBlur() {
    console.log("METER HANDLE BLUR")
    this.props.UpdateMeter({
      variables: {
        id: this.props.meter.id,
        totalKWH13mo: this.state.totalKWH13mo,
        totalCost13mo: this.state.totalCost13mo,
        days13mo: this.state.days13mo,
        number: this.state.number,
        accountNumber: this.state.accountNumber,
        amps: this.state.amps,
        existingDrop: this.state.existingDrop,
        type: this.state.type,
        style: this.state.style,
        tieIn: this.state.tieIn,
        transformerKVA: this.state.transformerKVA,
      }
    }).then((value) => {
      console.log("promise", value)
    })
  }

  addNote = (noteInfo) => {
    console.log(noteInfo);
    this.props.CreateNote({variables: noteInfo})//passing in noteInfo so this mutation can trigger
      .then((value) => {
        console.log("value in create note mutation! ", value);
        let newData = update(this.state, {
          notes: {$push: [value.data.createNote]}//then we get the full data value from the mutation and set that to state
        });
        this.setState(newData);
        return value;
      });
  }

  render() {
    console.log("METERS PROPS ", this.props);
    console.log("METERS STATE ", this.state);

    let notes;
    if(this.state.notes !== []){
     notes = this.state.notes.map((note, key) => {
      console.log("NOTE IN MAP ", note)
      return (
        <div key={key} className="note">
          <div className='row'>
            <div className='col-md-3'>
              <div>{moment(note.createdOn).format('lll')}</div>
            </div>
            <div className='col-md-3'>
              <div>{note.createdBy.firstName + ' ' + note.createdBy.lastName}</div>
            </div>
            <div className='col-md-6'>
              <div>{note.text}</div>
            </div>
          </div>
        </div>);
      });
    } else {
      notes = null;
    }

    return (
      <div>
        <div>
          <div className="row">
            <LabelInput className={'col-md-6'} label='Meter Number' value={this.state.number} placeholder='Meter Number' onChange={(e) => { this.setState({ number: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-6'} label='Account Number' value={this.state.accountNumber} placeholder='Account Number' onChange={(e) => { this.setState({ accountNumber: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
          <div className="form-group col-md-6">
              <label htmlFor="">Service Type</label>
              <Dropdown
                placeholder='Service Type'
                fluid selection options={[
                   { text: '120/208', value: '120/208' , },
                   { text: '120/240', value: '120/240' , },
                   { text: '230/400', value: '230/400' , },
                   { text: '240/415', value: '240/415' , },
                   { text: '277/480', value: '277/480' , },
                   { text: '347/600', value: '347/600' , },
                   { text: 'Unknown', value: 'Unknown' , },
                ]}
                value={this.state.type ? this.state.type : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ type: data.value }, this.handleBlur)
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="">Service Amps</label>
              <Dropdown
                placeholder='Service Amps'
                fluid selection options={[
                   { text: '60 Amps', value: 60 , },
                   { text: '100 Amps', value: 100 , },
                   { text: '125 Amps', value: 125 , },
                   { text: '200 Amps', value: 200 , },
                   { text: '400 Amps', value: 400 , },
                   { text: '600 Amps', value: 600 , },
                   { text: '800 Amps', value: 800 , },
                   { text: '1000 Amps', value: 1000 , },
                   { text: '1100 Amps', value: 1100 , },
                   { text: '1200 Amps', value: 1200 , },
                   { text: '1300 Amps', value: 1300 , },
                   { text: '1400 Amps', value: 1400 , },
                   { text: '1500 Amps', value: 1500 , },
                   { text: '1600 Amps', value: 1600 , },
                   { text: '1700 Amps', value: 1700 , },
                   { text: '1800 Amps', value: 1800 , },
                   { text: '1900 Amps', value: 1900 , },
                   { text: '2000 Amps', value: 2000 , },
                   { text: 'Other', value: 0 , },
                 ]}
                value={this.state.amps ? this.state.amps : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ amps: data.value }, this.handleBlur)
                }}
              />
            </div>
          </div>
          <div className="row">
          <div className="form-group col-md-6">
              <label htmlFor="">Existing Service Drop</label>
              <Dropdown
                placeholder='Existing Service Drop'
                fluid selection options={[
                   { text: 'Overhead Transformer', value: 'Overhead Transformer' , },
                   { text: 'Overhead No Transformer', value: 'Overhead No Transformer' , },
                   { text: 'Underground', value: 'Underground' , },
                   { text: 'Unknown', value: 'Unknown' , },
                 ]}
                value={this.state.existingDrop ? this.state.existingDrop : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ existingDrop: data.value }, this.handleBlur)
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="">Transformer KVA</label>
              <Dropdown
                placeholder='Transformer KVA'
                fluid selection options={[
                   { text: '25', value: 25 , },
                   { text: '50', value: 50 , },
                   { text: '75', value: 75 , },
                   { text: '100', value: 100 , },
                   { text: '150', value: 150 , },
                   { text: '300', value: 300 , },
                   { text: '500', value: 500 , },
                   { text: '750', value: 750 , },
                ]}
                value={this.state.transformerKVA ? this.state.transformerKVA : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ transformerKVA: data.value }, this.handleBlur)
                }}
              />
            </div>
          </div>

          <div className="row">
          <div className="form-group col-md-6">
              <label htmlFor="">Meter Style</label>
              <Dropdown
                placeholder='Meter Style'
                fluid selection options={[
                   { text: 'Analog', value: 'Analog' , },
                   { text: 'Digital', value: 'Digital' , },
                   { text: 'NEM', value: 'NEM' , },
                   { text: 'Unknown', value: 'Unknown' , },
                ]}
                value={this.state.style ? this.state.style : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ style: data.value }, this.handleBlur)
                }}
              />
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="">PV Tie In</label>
              <Dropdown
                placeholder='PV Tie In'
                fluid selection options={[
                   { text: 'Line Side Tap', value: 'Line Side Tap' , },
                   { text: 'Breaker', value: 'Breaker' , },
                ]}
                value={this.state.tieIn ? this.state.tieIn : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ tieIn: data.value }, this.handleBlur)
                }}
              />
            </div>
          </div>
<br /><br />
          <div className="row">
            <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">ELECTRIC BILL INFO</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Electrical_Icon_p.svg' height="35" width="50" />
            </div>
          </div>

          <div className="row">
            <LabelInput className={'col-md-4'} label='13 Month KW (Total)' value={this.state.totalKWH13mo} placeholder='13 Month KW (Total)' onChange={(e) => { this.setState({ totalKWH13mo: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-4'} label='13 Month Cost (Total)' value={this.state.totalCost13mo} placeholder='13 Month Cost (Total)' onChange={(e) => { this.setState({ totalCost13mo: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-4'} label='13 Month Days (Total)' value={this.state.days13mo} placeholder='13 Month Cost (Total)' onChange={(e) => { this.setState({ days13mo: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          {/* <div className="row">
            <p> <br />THIS IS WHERE THE CONTRACT LINK WILl BE</p>
          </div> */}
<br /><br />
          <div className="row">
            <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">ELECTRIC NOTES</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Electrical_Icon_p.svg' height="35" width="50" />
            </div>
          </div>
          {notes}
          <br />
          <AddNoteModal addNote={this.addNote} jobId={this.props.job.id} belongsTo={"Meter"} belongsToId={this.props.meter.id}/>

        </div>
      </div>

    );
  }
}

const createNoteMutation = gql`
  mutation createNote($text: String!, $type: String, $belongsTo: String, $belongsToId: ID) {
    createNote(input: {text: $text, type: $type, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
      id
      text
      type
      createdAt
      updatedAt
      createdBy{
        id
        firstName
        lastName
      }
    }
  }
`;

const MeterWithMutation = compose(
  graphql(UpdateMeterMutation, { name: 'UpdateMeter' }),
  graphql(createNoteMutation, { name: 'CreateNote' }),
)(Meter);

export default MeterWithMutation;
