import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import LabelInput from './../../LabelInput';
import { Button } from 'semantic-ui-react'

import NumberInput from './../../inputs/NumberInput';
import SearchSelect from './../../inputs/SearchSelect';
import DatePicker from './../../inputs/DatePicker';
import TimePicker from './../../inputs/TimePicker';

const CreatePreviewMutation = gql`
  mutation createPreview($JobId: ID!, $PreviewerId: ID, $dateTime: DateTime, $weather: String, $temperature: Float) {
    createPreview(input: {JobId: $JobId, PreviewerId: $PreviewerId, dateTime: $dateTime, weather: $weather, temperature: $temperature}) {
      id
    }
  }
`;

class AddPreview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      JobId: this.props.jobId,
      previewer: '',
      dateTime: null,
      previewTime: {},
      weather: '',
      temperature: null
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // let splitDate = this.state.dateTime.toString().split(' ');
    // let splitTime = this.state.previewTime.toString().split(' ')[4];
    // splitDate.splice(4, 1, splitTime)
    // this.state.dateTime = moment(splitDate.join(' '))._d;

    // this.props.CreatePreview({variables: {JobId: this.props.jobId, PreviewerId: this.state.previewer, dateTime: this.state.dateTime, weather: this.state.weather, temperature: this.state.temperature}})
    //   .then((value) => {
    //     console.log("value", value.data.createPreview);
    //     window.location.reload();
    //     return value;
    //   });

    this.props.addPreview({
      JobId: this.props.jobId,
      PreviewerId: this.state.previewer,
      dateTime: this.state.dateTime,
      weather: this.state.weather,
      temperature: this.state.temperature,
    });
    this.setState({
      previewer: '',
      dateTime: null,
      weather: '',
      temperature: null
    }, this.handleClose())
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({previewTime: date}, () => {
    });
  }

  render() {
    if(this.props.data.loading) {
      return(
        <div>loading...</div>
      )
    }

    if(this.props.data.error) {
      return (
        <div>Error</div>
      )
    }

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
        <Button color="teal" content='ADD PREVIEW' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD PREVIEW" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Preview"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <div className='form-group col-md-12'>
              <label htmlFor="">Previewer</label>
                <Dropdown
                  placeholder='Previewer'
                  fluid selection options={this.props.data.getPeople.map((person, index) => {
                    return {
                      key: index,
                      text: person.firstName + " " + person.lastName,
                      value: person.id
                    }
                  })}
                  value={this.state.previewer}
                  onChange={(e, data) => {
                    this.setState({
                      previewer: data.value,
                    });
                  }}
                />
              </div>
            </div>
            {<div className="row">
              <div className='form-group col-md-12'>
                <label htmlFor="">Weather</label>
                <Dropdown
                  placeholder='Weather'
                  fluid selection options={[
                    { text: 'Sunny', value: 'Sunny', },
                    { text: 'Partly Sunny', value: 'Partly Sunny', },
                    { text: 'Partly Cloudy', value: 'Partly Cloudy', },
                    { text: 'Cloudy', value: 'Cloudy', },
                    { text: 'Overcast', value: 'Overcast', },
                    { text: 'Showers', value: 'Showers', },
                    { text: 'Rain', value: 'Rain', },
                    { text: 'Thunderstorm', value: 'Thunderstorm', },
                    { text: 'Hail', value: 'Hail', },
                    { text: 'Snow', value: 'Snow', },
                  ]}
                  value={this.state.weather}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ weather: data.value }, this.handleBlur)
                  }}
                />
              </div>
            </div>}

            <div className='row'>
              <div className='col-md-12'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Preview Date (YYYY-MM-DD)" id="1"
                  onChange={(e, date) => this.setState({ dateTime: moment(date)._d})} />
              </div>
              {/* <div className={"form-group col-md-6"}>
                <TimePicker
                  floatingLabelText="Preview Time"
                  floatingLabelFixed={true}
                  autoOk={true}
                  format="ampm"
                  hintText="12hr Format"
                  onChange={this.handleChangeTimePicker12}
                />
              </div> */}
            </div>

            <div className='row'>
              { <LabelInput type="number" className="col-md-12" label='Preview Temperature' name='Preview Temp' value={this.state.temperature} placeholder='Preview Temp' onChange={(e, key, value) => this.setState({ temperature: e.target.value })} onBlur={this.handleBlur}/>}
            </div>

          </div>
        </Dialog>
      </div>
    );
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group: "Employee" type:"Person"){
      id
      firstName
      lastName
      user {
        id
        username
        password
      }
    }
  }
`;

const AddPreviewWithMutation = compose(
  graphql(getPeopleQuery),
)(withRouter(AddPreview));

export default AddPreviewWithMutation;
