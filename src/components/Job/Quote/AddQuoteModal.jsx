import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import AddIcon from 'material-ui/svg-icons/content/add';
import LabelInput from './../../LabelInput';
import { Button } from 'semantic-ui-react'

const CreateItemSetMutation = gql`
  mutation createItemSet( $id: ID ) {
    createItemSet(input: { id: $id }) {
      id
    }
  }
`;

const CreateQuoteMutation = gql`
  mutation createQuote( $JobId: ID!, $name: String, $ItemSetId: ID) {
    createQuote(input: { JobId: $JobId, name: $name, ItemSetId: $ItemSetId}) {
      id
      name
      itemSet {
        id
      }
    }
  }
`;

class AddQuoteModal extends Component {

  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this);

    this.state = {
      open: false,
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  }

  handleSave = () => {
    this.props.createItemSet({variables: {id: this.props.JobId}})
      .then((value) => {
        console.log("value", value);
        this.props.createQuote({variables: {JobId: this.props.JobId, name: this.state.name, ItemSetId: value.data.createItemSet.id}})
          .then((value) => {
            console.log(value)
            window.location.reload();
            return value;
          })
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
        <Button color="teal" content='ADD QUOTE' icon='plus' labelPosition='left' onClick={this.handleOpen} />
        <Dialog
          title="Create Quote"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
          <div className="modal-body">
            <div className="row">
              <LabelInput className="col-md-12"
                label='Quote Name'
                name='Quote Name'
                value={this.state.name}
                placeholder='Quote Name'
                onChange={(e) => this.setState({name: e.target.value})}
              />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}


const AddQuoteWithModal = compose(
  graphql(CreateItemSetMutation, { name: 'createItemSet' }),
  graphql(CreateQuoteMutation, { name: 'createQuote' }),
)(AddQuoteModal)

export default AddQuoteWithModal;
