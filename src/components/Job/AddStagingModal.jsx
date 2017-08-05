import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import { Button } from 'semantic-ui-react';

import AddIcon from 'material-ui/svg-icons/content/add';

const createStagingMutation = gql`
  mutation createStaging($JobId: ID!, $description: String!) {
    createStaging(input: {JobId: $JobId, description: $description}) {
      id
      description
    }
  }
`;

class AddStaging extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      description: '',
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.mutate({variables: {description: this.state.description, JobId: this.state.JobId}})
    //   .then((value) => {
    //     window.location.reload();
    //     return value;
    //   });

    this.props.addStaging({
      description: this.state.description,
      JobId: this.props.JobId
    });
    this.setState({
      description: ''
    }, this.handleClose())
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
        <Button color="teal" content='ADD STAGING AREA' icon='plus' labelPosition='left' onClick={this.handleOpen} />
        <Dialog
          title="Add Staging Area"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="">Staging Area</label>
                <input
                  name='Text'
                  className="form-control"
                  value={this.state.description}
                  placeholder='Text'
                  onChange={(e) => this.setState({description: e.target.value})}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddStagingWithMutation = graphql(createStagingMutation)(withRouter(AddStaging));

export default AddStagingWithMutation;
