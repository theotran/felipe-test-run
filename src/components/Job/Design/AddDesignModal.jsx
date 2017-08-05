

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react'

const createDesignMutation = gql`
  mutation createDesign($type: String!, $JobId: ID!) {
    createDesign(input: {type: $type, JobId: $JobId}) {
      id
      type
    }
  }
`;

class AddDesign extends Component {

  constructor(props) {
    super(props)

    this.state = {
      open: false,
      type: '',
      JobId: this.props.jobId
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.mutate({variables: {type: this.state.type, JobId: this.props.jobId}})
    //   .then((value) => {
    //     console.log("value", value.data.createDesign);
    //     window.location.reload();
    //     return value;
    //   });

    this.props.addDesign({
      type: this.state.type,
      JobId: this.props.jobId
    });
    this.setState({
      type: ''
    }, this.handleClose());
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
        <Button color="teal" content='ADD DESIGN' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={" #00B1B3"} labelColor={"#fff"} label="ADD DESIGN" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Design"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="">Design Name</label>
                <input
                  name='Design Name'
                  className="form-control"
                  value={this.state.type}
                  placeholder='Smith PV Design V1'
                  onChange={(e) => this.setState({type: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddDesignWithMutation = graphql(createDesignMutation)(AddDesign);

export default AddDesignWithMutation;
