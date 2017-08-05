

import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { compose } from 'react-apollo';

import { Button, Dropdown } from 'semantic-ui-react'

class ChangePlanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      plan: '',
      billingType: ''
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {

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
      <div className="">
        <Button centered color="teal" content='UPGRADE TO PROFESSIONAL'  onClick={(e, data) => { this.handleOpen() }} />
        <Dialog
          title="Change Plan"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="row">
            <div className="form-group col-md-12">
              <label htmlFor="">Plan Type</label>
              <Dropdown
                placeholder='Plan Type'
                fluid selection options={[
                  { text: 'Professional', value: 'Professional',},
                  { text: 'Enterprise', value: 'Enterprise',},
                 ]}
                value={this.state.plan}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ plan: data.value })
                }}
              />
            </div>

                <div className="content-md container">
                    <div className="row">
                        <div className="col-md-4 md-margin-b-30">

                            <div className="pricing-list-v4 radius-10">
                                <div className="pricing-list-v4-header">
                                    <h4 className="pricing-list-v4-title">Basic</h4>
                                    <span className="pricing-list-v4-subtitle">Individual</span>
                                </div>
                                <div className="pricing-list-v4-content">
                                    <div className="margin-b-40">
                                        <span className="pricing-list-v4-price-sign"><i className="fa fa-dollar"></i></span>
                                        <span className="pricing-list-v4-price">7.</span>
                                        <span className="pricing-list-v4-subprice">00</span>
                                        <span className="pricing-list-v4-price-info">Month</span>
                                    </div>
                                    <div className="center-block">
                                        <button type="button" className="btn-dark-brd btn-base-sm radius-3">Purchase</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4 md-margin-b-30">

                            <div className="pricing-list-v4 radius-10">
                                <div className="pricing-list-v4-header">
                                    <h4 className="pricing-list-v4-title">Premium</h4>
                                    <span className="pricing-list-v4-subtitle">Business</span>
                                </div>
                                <div className="pricing-list-v4-content">
                                    <div className="margin-b-40">
                                        <span className="pricing-list-v4-price-sign"><i className="fa fa-dollar"></i></span>
                                        <span className="pricing-list-v4-price">15.</span>
                                        <span className="pricing-list-v4-subprice">00</span>
                                        <span className="pricing-list-v4-price-info">Month</span>
                                    </div>
                                    <div className="center-block">
                                        <button type="button" className="btn-dark-brd btn-base-sm radius-3">Purchase</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4 md-margin-b-30">

                            <div className="pricing-list-v4 radius-10">
                                <div className="pricing-list-v4-header">
                                    <h4 className="pricing-list-v4-title">Ultimate</h4>
                                    <span className="pricing-list-v4-subtitle">Enterprise</span>
                                </div>
                                <div className="pricing-list-v4-content">
                                    <div className="margin-b-40">
                                        <span className="pricing-list-v4-price-sign"><i className="fa fa-dollar"></i></span>
                                        <span className="pricing-list-v4-price">23.</span>
                                        <span className="pricing-list-v4-subprice">00</span>
                                        <span className="pricing-list-v4-price-info">Month</span>
                                    </div>
                                    <div className="center-block">
                                        <button type="button" className="btn-dark-brd btn-base-sm radius-3">Purchase</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            {/* <div>
              <Button.Group size='huge'>
                <Button>One</Button>
                <Button.Or />
                <Button>Three</Button>
              </Button.Group>
            </div> */}

          </div>
        </Dialog>
      </div>
    );
  }
}


const ChangePlanModalWithMutations = compose(

)(ChangePlanModal);

export default ChangePlanModalWithMutations;
