
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add';


import { Dropdown, Button } from 'semantic-ui-react';

const createJobMutation = gql`
  mutation createJob($name: String!, $number: String!, $type: String!, $status: String!) {
    createJob(input: {name: $name, number: $number, type: $type, status: $status}) {
      id
      name
      number
      type
      status
      success
      message
      field
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

const createMeterMutation = gql`
  mutation createMeter($JobId: ID){
    createMeter(input: { JobId: $JobId }) {
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

class AddJob extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);

    this.state = {
      open: false,
      name: "",
      number: "",
      type: "",
      status: "",
      field: "",
      error: null
    }
  }

  handleSave = (e) => {
    const {name, number, type, status} = this.state;

    this.props.CreateJob({variables: { name, number, type, status}})
    .then((value) => {
      if(value.data.createJob.success !== true){
        this.setState({
          field: value.data.createJob.field,
          error: value.data.createJob.message
        })
      } else {
        console.log('SUCCESS', value.data.createJob)
        this.props.AddJobSite({ variables: { type: "JobSite", JobId: value.data.createJob.id }})
        this.props.AddMeter({ variables: { JobId: value.data.createJob.id } })
        browserHistory.push(`/commercial/project/${value.data.createJob.id}/site`);
        return value;
      }
    })
    e.preventDefault();
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      name: "",
      number: "",
      type: "",
      status: "",
      field: "",
      error: null
    });
  };

  render() {
    let nameError;
    let typeError; 
    let statusError;
    let errorStyles = {
      color: 'red'
    };

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

    if(this.state.field === "name" ){
      nameError = <div style={errorStyles}>{this.state.error}</div>;
    } else if(this.state.field === "type"){
      typeError = <div style={errorStyles}>{this.state.error}</div>;
    } else if(this.state.field === "status"){
      statusError = <div style={errorStyles}>{this.state.error}</div>;
    } else {
      nameError = null;
      typeError = null;
      statusError = null;
    }

    return (
        <div>
            <div className='row'>
              <Button color="teal" content='ADD PROJECT' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}}/>
            </div>
            <Dialog
              title="Add Project"
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              <form onSubmit={this.handleSave}>
                <div>

                  <div className="row">

                    <div className="form-group col-md-6">
                      <label htmlFor="">Project Type</label>
                      <Dropdown
                        placeholder='Project Type'
                        fluid selection options={[
                           { text: 'Residential', value: 'Residential',},
                           { text: 'Commercial', value: 'Commercial',},
                           { text: 'Utility', value: 'Utility',},
                           { text: 'Other', value: 'Other',},
                         ]}
                        value={this.state.type}
                        onChange={(e, data) => {
                          console.log("VALUE IN DROPDOWN ", data)
                          this.setState({ type: data.value }, this.handleBlur)
                        }}
                      />
                      {typeError}
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="">Project Status</label>
                      <Dropdown
                        placeholder='Project Status'
                        fluid selection options={[
                           { text: 'Lead', value: 'Lead',},
                           { text: 'Active', value: 'Active',},
                           { text: 'On-Hold', value: 'On-Hold',},
                           { text: 'Cancelled', value: 'Cancelled',},
                           { text: 'Complete', value: 'Complete',},
                           { text: 'As-Built', value: 'As-Built',},
                         ]}
                        value={this.state.status}
                        onChange={(e, data) => {
                          console.log("VALUE IN DROPDOWN ", data)
                          this.setState({ status: data.value }, this.handleBlur)
                        }}
                      />
                      {statusError}
                    </div>

                  </div>

                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="">Name</label>
                      <input
                        name="Name"
                        className="form-control"
                        value={this.state.name}
                        placeholder="Name"
                        onChange={(e) => this.setState({name: e.target.value})}
                        type="text"
                        title="Hyphens, underscores, periods and forward slashes allowed."
                        pattern="^[a-zA-Z._\/\s-]+$"
                        required
                      />
                      {nameError}
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="">Number</label>
                      <input
                        name="Number"
                        className="form-control"
                        value={this.state.number}
                        placeholder="Number"
                        onChange={(e) => this.setState({number: e.target.value})}
                        title="May only contain letters, numbers, hyphens, underscores, periods and forward slashes."
                        pattern="^[\w\s.\/-]+$"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Dialog>
          </div>

          // </div>
        // </div>
      // </div>
    )
  }
}

const AddJobWithMutation = compose(
  graphql(createJobMutation, { name: "CreateJob" }),
  graphql(createJobSiteMutation, { name: "AddJobSite"}),
  graphql(createMeterMutation, { name: "AddMeter" }),
)(withRouter(AddJob));

export default AddJobWithMutation;
