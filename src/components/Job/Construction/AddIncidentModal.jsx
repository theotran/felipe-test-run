

import React, { Component } from 'react';

import LabelInput from '../../LabelInput';

import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
//Material Modal
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

//GraphQL/Apollo
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';


class AddIncidentModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      type: '',
      description: '',
      location: '',
      date: null,
      explanation: '',
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.AddIncident({
      variables: {
        description: this.state.description,
        location: this.state.description,
        date: this.state.date,
        explanation: this.state.explanation,
        SubLogId: this.props.subLogId
      }
    }).then((value) => {
      console.log("Value from callback ", value);
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
        <Button color="teal" content='ADD INCIDENT' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
        <Dialog
          title="Add Incident"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <div className='form-group col-md-3'>
              <DatePicker style={{width: "100%"}} autoOk={true} floatingLabelFixed={true} floatingLabelText="Date" id="1" value={this.state.date ? moment(this.state.date)._d : {}} onChange={(e, date) => {
                this.setState({ date: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
          </div>
          <div className="row">
            <LabelInput className={'col-md-4'} label='Location' value={this.state.location} placeholder='Location' onChange={(e) => { this.setState({ location: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>Description</label>
              <textarea rows="4" className="form-control" value={this.state.description} onChange={(e) => { this.setState({ description: e.target.value })}} />
            </div>
            <div className="form-group col-md-6">
              <label>Explanation</label>
              <textarea rows="4" className="form-control" value={this.state.explanation} onChange={(e) => { this.setState({ explanation: e.target.value })}} />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

const CreateIncidentMutation = gql`
  mutation createIncident($type: String, $description: String, $location: String, $date: DateTime, $explanation: String, $SubLogId: ID) {
    createIncident(input: {type: $type, description: $description, location: $location, date: $date, explanation: $explanation, SubLogId: $SubLogId }) {
      id
      type
      description
      location
      date
      explanation
    }
  }
`;



const AddIncidentModalWithMutation = compose(
  graphql(CreateIncidentMutation, { name: 'AddIncident' }),
)(AddIncidentModal);

export default AddIncidentModalWithMutation;
