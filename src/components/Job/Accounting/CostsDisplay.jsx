

import React, { Component } from 'react';
import LabelInput from './../../LabelInput';

class CostsDisplay extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      contractAmount: this.props.job.contract ? this.props.job.contract.amount : 0.00,
      changeOrderAmount: this.props ? this.props.changeOrders : 0.00,
      dPPAmount: this.props ? this.props.dPP : 0.00,
      eAAmount: this.props ? this.props.eA : 0.00,
      sMAAmount: this.props ? this.props.sMA : 0.00,
      cUPAmount: this.props ? this.props.cUP : 0.00,
      dLNRAmount: this.props ? this.props.dLNR : 0.00,
      elecReview: this.props ? this.props.elecReview : 0.00,
      permitDeposit: this.props ? this.props.permitDeposit : 0.00,
      permitFinal: this.props ? this.props.permitFinal : 0.00,
      totalCost: this.props ? this.props.totalCost : 0.00,
      jobCost: this.props ? this.props.jobCostCust : 0.00
    }
    console.log(this.state)
  }

  render() {

    let paymentsArray = [];
    let totalPayments;
    this.props.job.payments.map((payment, index) => {
      return paymentsArray.push(parseInt(payment.amount))
    })
    if (paymentsArray.length !== 0) {
      totalPayments = paymentsArray.reduce((x, y) => x + y);
    }

    let invoiceAmtArray = [];
    let totalInvoice;
    this.props.job.invoices.map((invoice, index) => {
      return invoiceAmtArray.push(invoice.amount)
    })
    if (invoiceAmtArray.length !== 0) {
      totalInvoice = (invoiceAmtArray.reduce((x, y) => x + y)) - totalPayments;
    } else {
      totalInvoice = 0;
    }

    let totalUnbilled = this.state.totalCost - totalInvoice - totalPayments;

    let dPPAmount;
    let changeOrderAmount;
    let eAAmount;
    let sMAAmount;
    let cUPAmount;
    let dLNRAmount;
    let permitDeposit;
    let permitFinal;
    let elecReview;
    let jobCost;

    if (this.state.dPPAmount !== 0.00) {
      dPPAmount =
        <LabelInput className="col-md-6"
          label='D.P.P. Cost To Bill'
          name='Amount'
          value={this.state.dPPAmount}
          placeholder='0.00'
          readOnly
        />
    }

    if (this.state.changeOrderAmount !== 0.00) {
      changeOrderAmount =
        <LabelInput className="col-md-6"
          label='Change Order Cost'
          name='Amount'
          value={this.state.changeOrderAmount}
          placeholder='0.00'
          readOnly
        />
    }

    if (this.state.jobCost !== 0.00) {
      jobCost =
        <LabelInput className="col-md-6"
          label='Job Costs'
          name='Amount'
          value={this.state.jobCost}
          placeholder='0.00'
          readOnly
        />
    }

    if (this.state.eAAmount) {
      eAAmount =
      <LabelInput className="col-md-6"
        label='EA Cost To Bill'
        name='Amount'
        value={this.state.eAAmount}
        placeholder='0.00'
        readOnly
      />
    }

    if (this.state.sMAAmount) {
      <LabelInput className="col-md-6"
        label='SMA Cost To Bill'
        name='Amount'
        value={this.state.sMAAmount}
        placeholder='0.00'
        readOnly
      />
    }

    if (this.state.cUPAmount) {
      cUPAmount =
      <LabelInput className="col-md-6"
        label='CUP Cost To Bill'
        name='Amount'
        value={this.state.cUPAmount}
        placeholder='0.00'
        readOnly
      />
    }

    if (this.state.dLNRAmount) {
      dLNRAmount =
      <LabelInput className="col-md-6"
        label='DLNR Cost To Bill'
        name='Amount'
        value={this.state.dLNRAmount}
        placeholder='0.00'
        readOnly
      />
    }

    if (this.state.permitDeposit) {
      permitDeposit =
        <LabelInput className="col-md-6"
          label='Permit Deposit Cost to Bill'
          name='Amount'
          value={this.state.permitDeposit}
          placeholder='0.00'
          readOnly
        />
    }

    if (this.state.permitFinal) {
      permitFinal =
        <LabelInput className="col-md-6"
          label='Permit Final Cost to Bill'
          name='Amount'
          value={this.state.permitFinal}
          placeholder='0.00'
          readOnly
        />
    }

    if (this.state.elecReview) {
      elecReview =
        <LabelInput className="col-md-6"
          label='Electrical Review'
          name='Electrical Review'
          value={this.state.elecReview}
          placeholder='0.00'
          readOnly
        />
    }

    return (
        // if(this.props.data.loading) {
        //   return(
        //     <div>loading...</div>
        //   )
        // }
        //
        // if(this.props.data.error) {
        //   return (
        //     <div>Error</div>
        //   )
        // }

      // <div className='panel-body'>
      //   <div className="panel panel-default">
        <div>
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">ALL COSTS</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Accounting_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <div className='row'>
            {jobCost}
          </div>

          <div className='row'>
            {dPPAmount}
            {changeOrderAmount}
          </div>

          <div className='row'>
            {eAAmount}
            {sMAAmount}
          </div>

          <div className='row'>
            {cUPAmount}
            {dLNRAmount}
          </div>

          <div className='row'>
            {permitDeposit}
            {permitFinal}
          </div>

          <div className='row'>
            {elecReview}
            <LabelInput className="col-md-6"
              label='Contract Amount'
              name='Contract Amount'
              value={this.state.contractAmount}
              placeholder='0.00'
              readOnly
            />
          </div>

          <div className='row'>
            <LabelInput className="col-md-6"
              label='Total Cost'
              name='Amount'
              value={this.state.totalCost}
              placeholder='0.00'
              readOnly
            />
            <LabelInput className="col-md-6"
              label='Total Unbilled Amount'
              name='Total Unbilled Amount'
              value={totalUnbilled}
              placeholder='0.00'
              readOnly
            />
          </div>

          <div className='row'>
            <LabelInput className="col-md-6"
              label='Balance Due'
              name='Balance Due'
              value={totalInvoice}
              placeholder='0.00'
              readOnly
            />
            <LabelInput className="col-md-6"
              label='Total Payments'
              name='Total Payments'
              value={totalPayments}
              placeholder='0.00'
              readOnly
            />
          </div>
        </div>
      //   </div>
      // </div>
    )
  }
}

export default CostsDisplay;
