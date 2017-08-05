import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import LabelInput from '../../LabelInput';

import AddIcon from 'material-ui/svg-icons/content/add';
import { Button } from 'semantic-ui-react'

const CreateMeterMutation = gql`
  mutation createMeter($totalKWH13mo: Float, $totalCost13mo: Float, $days13mo: Int, $number: String, $accountNumber: String, $amps: Float, $existingDrop: String, $type: String, $style: String, $tieIn: String, $transformerKVA: Float, $JobId: ID){
    createMeter(input: { totalKWH13mo: $totalKWH13mo, totalCost13mo: $totalCost13mo, days13mo: $days13mo, number: $number, accountNumber: $accountNumber, amps: $amps, existingDrop: $existingDrop, type: $type, style: $style, tieIn: $tieIn, transformerKVA: $transformerKVA, JobId: $JobId }) {
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

class AddMeterModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      number: '',
      accountNumber: '',
      amps: null,
      existingDrop: '',
      type: '',
      style: '',
      tieIn: '',
      transformerKVA: null,
      totalKWH13mo: null,
      totalCost13mo: null,
      days13mo: null,
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.CreateMeter({
      variables: {
        number: this.state.number,
        accountNumber: this.state.accountNumber,
        JobId: this.props.jobId,
      }
    }).then((value) => {
      console.log("value from callback", value);
      window.location.reload();
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        backgroundColor={"#00B1B3"}
        labelColor={"#fff"}
        label="Submit"
        onTouchTap={this.handleSave}
      />
    ];

    return (
      <div>
        <Button color="teal" content='ADD METER' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD METER" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Meter"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        <div className="row">
          <LabelInput className={'col-md-6'} label='Number' value={this.state.number} placeholder='Number' onChange={(e) => { this.setState({ number: e.target.value }) }} onBlur={this.handleBlur}/>
          <LabelInput className={'col-md-6'} label='Account Number' value={this.state.accountNumber} placeholder='Account Number' onChange={(e) => { this.setState({ accountNumber: e.target.value }) }} onBlur={this.handleBlur}/>
        </div>
        {/* <div className="row">
          <div className='form-group col-md-6'>
            <SelectField
              floatingLabelText="Service Amps"
              value={this.state.amps} onChange={(e, key, value) => {
                console.log("ONCHANGE VALUE ", value)
                this.setState({ amps: value }, this.handleBlur)
              }}
            >
              <MenuItem value={60} primaryText={"60"} />
              <MenuItem value={100} primaryText={"100"} />
              <MenuItem value={125} primaryText={"125"} />
              <MenuItem value={200} primaryText={"200"} />
              <MenuItem value={400} primaryText={"400"} />
              <MenuItem value={600} primaryText={"600"} />
              <MenuItem value={800} primaryText={"800"} />
              <MenuItem value={1000} primaryText={"1000"} />
              <MenuItem value={1100} primaryText={"1100"} />
              <MenuItem value={1200} primaryText={"1200"} />
              <MenuItem value={1300} primaryText={"1300"} />
              <MenuItem value={1400} primaryText={"1400"} />
              <MenuItem value={1500} primaryText={"1500"} />
              <MenuItem value={1600} primaryText={"1600"} />
              <MenuItem value={1700} primaryText={"1700"} />
              <MenuItem value={1800} primaryText={"1800"} />
              <MenuItem value={1900} primaryText={"1900"} />
              <MenuItem value={2000} primaryText={"2000"} />
              <MenuItem value={0} primaryText={"Other"} />
            </SelectField>
          </div>
          <div className='form-group col-md-6'>
            <SelectField
              floatingLabelText="Existing Service Drop"
              value={this.state.existingDrop} onChange={(e, key, value) => {
                console.log("ONCHANGE VALUE ", value)
                this.setState({ existingDrop: value }, this.handleBlur)
              }}
            >
              <MenuItem value={"Overhead Transformer"} primaryText={"Overhead Transformer"} />
              <MenuItem value={"Overhead No Transformer"} primaryText={"Overhead No Transformer"} />
              <MenuItem value={"Underground"} primaryText={"Underground"} />
              <MenuItem value={"Unknown"} primaryText={"Unknown"} />
            </SelectField>
          </div>
        </div>
        <div className="row">
          <div className='form-group col-md-6'>
            <SelectField
              floatingLabelText="Service Type"
              value={this.state.type} onChange={(e, key, value) => {
                console.log("ONCHANGE VALUE ", value)
                this.setState({ type: value }, this.handleBlur)
              }}
            >
              <MenuItem value={"120/208"} primaryText={"120/208"} />
              <MenuItem value={"120/240"} primaryText={"120/240"} />
              <MenuItem value={"230/400"} primaryText={"230/400"} />
              <MenuItem value={"240/415"} primaryText={"240/415"} />
              <MenuItem value={"277/480"} primaryText={"277/480"} />
              <MenuItem value={"347/600"} primaryText={"347/600"} />
              <MenuItem value={"Unknown"} primaryText={"Unknown"} />
            </SelectField>
          </div>
          <div className='form-group col-md-6'>
            <SelectField
              floatingLabelText="Meter Style"
              value={this.state.style} onChange={(e, key, value) => {
                console.log("ONCHANGE VALUE ", value)
                this.setState({ style: value }, this.handleBlur)
              }}
            >
              <MenuItem value={"Analog"} primaryText={"Analog"} />
              <MenuItem value={"Digital"} primaryText={"Digital"} />
              <MenuItem value={"NEM"} primaryText={"NEM"} />
              <MenuItem value={"Unknown"} primaryText={"Unknown"} />
            </SelectField>
          </div>
        </div>
        <div className="row">
          <LabelInput className={'col-md-6'} label='Tie In' value={this.state.tieIn} placeholder='Tie In' onChange={(e) => { this.setState({ tieIn: e.target.value }) }} onBlur={this.handleBlur}/>
          <div className='form-group col-md-6'>
            <SelectField
              floatingLabelText="Tranformer KVA"
              value={this.state.transformerKVA} onChange={(e, key, value) => {
                console.log("ONCHANGE VALUE ", value)
                this.setState({ transformerKVA: value }, this.handleBlur)
              }}
            >
              <MenuItem value={25} primaryText={"25"} />
              <MenuItem value={50} primaryText={"50"} />
              <MenuItem value={75} primaryText={"75"} />
              <MenuItem value={100} primaryText={"100"} />
              <MenuItem value={150} primaryText={"150"} />
              <MenuItem value={300} primaryText={"300"} />
              <MenuItem value={500} primaryText={"500"} />
              <MenuItem value={750} primaryText={"750"} />
            </SelectField>
          </div>
        </div>
        <div className="row">
          <LabelInput className={'col-md-4'} label='13 Month KW (Total)' value={this.state.totalKWH13mo} placeholder='13 Month KW (Total)' onChange={(e) => { this.setState({ totalKWH13mo: e.target.value }) }} onBlur={this.handleBlur}/>
          <LabelInput className={'col-md-4'} label='13 Month Cost (Total)' value={this.state.totalCost13mo} placeholder='13 Month Cost (Total)' onChange={(e) => { this.setState({ totalCost13mo: e.target.value }) }} onBlur={this.handleBlur}/>
          <LabelInput className={'col-md-4'} label='13 Month Days (Total)' value={this.state.days13mo} placeholder='13 Month Cost (Total)' onChange={(e) => { this.setState({ days13mo: e.target.value }) }} onBlur={this.handleBlur}/>
        </div> */}
        </Dialog>
      </div>
    );
  }
}


const AddMeterModalWithMutation = compose(
  graphql(CreateMeterMutation, {
    name: "CreateMeter"
  }),
)(AddMeterModal);

export default AddMeterModalWithMutation;
