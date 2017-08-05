

import React, { Component } from 'react';

import LabelInput from '../../LabelInput';
//DatePicker
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
//Material Modal
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';
//Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
//GraphQL/Apollo
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { Dropdown, Button } from 'semantic-ui-react';

class AddDailyLogModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: '',
      date: null,
      minTemp: null,
      maxTemp: null,
      weather: '',
      safetyHeldTime: null,
      safetyLocation: '',
      mutatedTime: null,
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.AddDailyLog({
    //   variables: {
    //     type: "Daily Log",
    //     date: this.state.date,
    //     minTemp: this.state.minTemp,
    //     maxTemp: this.state.maxTemp,
    //     safetyHeldTime: this.state.safetyHeldTime,
    //     safetyLocation: this.state.safetyLocation,
    //     weather: this.state.weather,
    //     ConstructionId: this.props.job.construction.id,
    //   }
    // }).then((value) => {
    //   console.log("Value from callback ", value);
    //   window.location.reload();
    // })
    this.props.addDailyLog({
      type: "Daily Log",
      date: this.state.date,
      minTemp: this.state.minTemp,
      maxTemp: this.state.maxTemp,
      safetyHeldTime: this.state.safetyHeldTime,
      safetyLocation: this.state.safetyLocation,
      weather: this.state.weather,
    });
    this.setState({
      type: '',
      date: null,
      minTemp: null,
      maxTemp: null,
      weather: '',
      safetyHeldTime: null,
      safetyLocation: '',
      mutatedTime: null,
    }, this.handleClose())
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({safetyHeldTime: date});
  }

  render() {
    console.log("Add log modals props ", this.props)
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


    let  AddDailyLogModalButton = <Button color="teal" content='ADD DAILY LOG' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />

    return (
      <div>
        {AddDailyLogModalButton}
        <Dialog
          title="Add Daily Log"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <div className='form-group col-md-6'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Date" id="1" value={this.state.date ? moment(this.state.date)._d : {}} onChange={(e, date) => {
                this.setState({ date: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="">Weather</label>
              <Dropdown
                placeholder='Weather'
                fluid selection options={[
                  { text: 'Mostly Sunny', value: 'Mostly Sunny', },
                  { text: 'Partly Cloudy', value: 'Partly Cloudy', },
                  { text: 'Overcast', value: 'Overcast', },
                  { text: 'Rain', value: 'Rain', },
                  { text: 'Hail', value: 'Hail', },
                  { text: 'Other', value: 'Other', },
                ]}
                value={this.state.weather ? this.state.weather : ''}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ weather: data.value }, this.handleBlur)
                }}
              />
            </div>

          </div>
          <div className="row">
            <div className='col-md-6'>
              <TimePicker
                floatingLabelText="Time"
                floatingLabelFixed={true}
                format="ampm"
                hintText="12hr Format"
                value={this.state.safetyHeldTime}
                onChange={this.handleChangeTimePicker12}
              />
            </div>
            <LabelInput className={'col-md-6'} label='Safety Location' value={this.state.safetyLocation} placeholder='Safety Location' onChange={(e) => { this.setState({ safetyLocation: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
            <LabelInput className={'col-md-6'} label='Min Temp' value={this.state.minTemp ? this.state.minTemp : ''} placeholder='Min Temp' onChange={(e) => { this.setState({ minTemp: e.target.value }) }} onBlur={this.handleBlur}/>
            <LabelInput className={'col-md-6'} label='Max Temp' value={this.state.maxTemp ? this.state.maxTemp : ''} placeholder='Max Temp' onChange={(e) => { this.setState({ maxTemp: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
        </Dialog>
      </div>
    );
  }
}





export default AddDailyLogModal;
