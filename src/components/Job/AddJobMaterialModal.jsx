import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';


import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import AddIcon from 'material-ui/svg-icons/content/add';


const createJobMutation = gql`
  mutation createJob($name: String!, $number: String!, $type: String!, $status: String!) {
    createJob(input: {name: $name, number: $number, type: $type, status: $status}) {
      id
      name
      number
      type
      status
    }
  }
`;

const createJobSiteMutation = gql`
  mutation addJobSite( $type: String, $JobId: ID) {
    addJobSite(input: { type: $type, JobId: $JobId}) {
      id
    }
  }
`;


class AddJob extends Component {

  constructor(props) {
    super(props)
    this.focus = this.focus.bind(this);

    this.state = {
      open: false,
      name: '',
      number: '',
      type: '',
      status: ''
    };

  }


  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.input1.value = "";
    this.input2.value = "";

    this.setState({ name: '', number: ''})
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    const {name, number, type, status} = this.state;

    this.props.CreateJob({variables: {name, number, type, status}})
      .then((value) => {
        console.log(value.data.createJob)
        this.props.AddJobSite({ variables: { type: "JobSite", JobId: value.data.createJob.id }})
        browserHistory.push(`/commercial/project/${value.data.createJob.id}/site`);
        return value;
      });
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
        <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD JOB" onTouchTap={this.handleOpen} />
        <Dialog
          title="Add Project"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="">Name</label>
              <input
                name='Name'
                className="form-control"
                value={this.state.name}
                placeholder='Name'
                onChange={(e) => this.setState({name: e.target.value})}
                ref={(input) => { this.input1 = input; }}
              />
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="">Number</label>
              <input
                name='Number'
                className="form-control"
                value={this.state.number}
                placeholder='Number'
                onChange={(e) => this.setState({number: e.target.value})}
                ref={el => this.input2 = el}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <SelectField
               floatingLabelText="Project Type"
               floatingLabelFixed={true}
               value={this.state.type}
               onChange={(e, key, value) => this.setState({ type: value })}
              >
                <MenuItem value="Residential"primaryText="Residential"></MenuItem>
                <MenuItem value="Commercial"primaryText="Commercial"></MenuItem>
                <MenuItem value="Utility"primaryText="Utility"></MenuItem>
                <MenuItem value="Other"primaryText="Other"></MenuItem>
              </SelectField>
            </div>
            <div className="form-group col-md-6">
              <SelectField
               floatingLabelText="Status"
               floatingLabelFixed={true}
               value={this.state.status}
               onChange={(e, key, value) => this.setState({ status: value }, this.handleBlur)}
              >
                <MenuItem value="lead"primaryText="Lead"></MenuItem>
                <MenuItem value="active"primaryText="Active"></MenuItem>
                <MenuItem value="on-hold"primaryText="On-Hold"></MenuItem>
                <MenuItem value="cancelled"primaryText="Cancelled"></MenuItem>
                <MenuItem value="complete"primaryText="Complete"></MenuItem>
                <MenuItem value="as-built"primaryText="As-Built"></MenuItem>
              </SelectField>
            </div>
          </div>
          {/* <input
            type="button"
            value="Erase the two input values"
            onClick={this.focus}
          /> */}
        </Dialog>
      </div>
    );
  }
}


const AddJobWithMutation = compose(
  graphql(createJobMutation, { name: 'CreateJob'}),
  graphql(createJobSiteMutation, { name: 'AddJobSite'}),
)(AddJob);

export default AddJobWithMutation;
