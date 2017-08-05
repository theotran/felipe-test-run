import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Dropdown, Button } from 'semantic-ui-react';


class AddChangeOrder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      type: 'Change Order',
      isPaid: false,
      amount: '',
      description: '',
      billTo: 'Customer'
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    // this.props.mutate({variables: {JobId: this.props.JobId, type: this.state.type, isPaid: this.state.isPaid, amount: this.state.amount, description: this.state.description, billTo: this.state.billTo}})
    //   .then((value) => {
    //     console.log("value", value.data.createCost);
    //     window.location.reload();
    //     return value;
    //   });

    this.props.addChangeOrder({
      JobId: this.props.JobId,
      type: this.state.type,
      isPaid: this.state.isPaid,
      amount: this.state.amount,
      description: this.state.description,
      billedTo: this.state.billedTo
    });
    this.setState({
      type: '',
      isPaid: '',
      amount: '',
      description: '',
      billedTo: ''
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
        <Button color="teal" content='ADD CHANGE ORDER' icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
        {/* <RaisedButton icon={<AddIcon />} backgroundColor={"#00B1B3"} labelColor={"#fff"} label="ADD CHANGE ORDER" onTouchTap={this.handleOpen} /> */}
        <Dialog
          title="Add Change Order"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <div className="form-group col-md-12">
                <label htmlFor="">Amount (No $ or Comma)</label>
                <input
                  name='Amount'
                  className="form-control"
                  value={this.state.amount}
                  placeholder='0.00'
                  onChange={(e) => this.setState({amount: e.target.value})}
                  type='number'
                />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-12'>
                <label htmlFor="">Description</label>
                <textarea
                  name='Description'
                  className="form-control"
                  value={this.state.description}
                  placeholder='Description about the change order go here'
                  onChange={(e) => this.setState({description: e.target.value})}
                  rows="5"
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


export default AddChangeOrder;
