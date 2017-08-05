

import React, { Component } from 'react';
import PaymentDisplay from './PaymentDisplay';
import InvoiceDisplay from './InvoiceDisplay';
import JobCostDisplay from './JobCostDisplay';
import CostsDisplay from './CostsDisplay';
import AddInvoiceModal from './AddInvoiceModal';
import AddPaymentModal from './AddPaymentModal';

class AccountingTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      contractAmount: this.props.job.contract ? this.props.job.contract.amount : 0.00,
    }
  }

  render() {
    console.log(this.props)

    let dPPAmtArray = []
    let totalDPP
    let filterDPP = this.props.job.costs.filter((costs) => {
      return costs.type === 'D.P.P. (City & County)'
    }).map((filteredDPP, index) => {
      return dPPAmtArray.push(filteredDPP.amount)
    })
    if (dPPAmtArray.length !== 0) {
      totalDPP = dPPAmtArray.reduce((x, y) => x + y);
    } else {
      totalDPP = 0;
    }

    let eAAmtArray = []
    let totalEA;
    let filterEA = this.props.job.costs.filter((costs) => {
      return costs.type === 'Environmental Assesment'
    }).map((filteredEA, index) => {
      return eAAmtArray.push(filteredEA.amount)
    })
    if (eAAmtArray.length !== 0) {
      totalEA = eAAmtArray.reduce((x, y) => x + y);
    } else {
      totalEA = 0;
    }

    let sMAAmtArray = []
    let totalSMA;
    let filterSMA = this.props.job.costs.filter((costs) => {
      return costs.type === 'Special Management Area'
    }).map((filteredSMA, index) => {
      sMAAmtArray.push(filteredSMA.amount)
    })
    if (sMAAmtArray.length !== 0) {
      totalSMA = sMAAmtArray.reduce((x, y) => x + y);
    } else {
      totalSMA = 0;
    }

    let cUPAmtArray = []
    let totalCUP;
    let filterCUP = this.props.job.costs.filter((costs) => {
      return costs.type === 'Conditional Use Permit'
    }).map((filteredCUP, index) => {
      cUPAmtArray.push(filteredCUP.amount)
    })
    if (cUPAmtArray.length !== 0) {
      totalCUP = cUPAmtArray.reduce((x, y) => x + y);
    } else {
      totalCUP = 0;
    }

    let elecReviewArray = []
    let totalElecReview;
    let filterElecReview = this.props.job.costs.filter((costs) => {
      return costs.type === 'Electrical Review'
    }).map((filteredElecReview, index) => {
      elecReviewArray.push(filteredElecReview.amount)
    })
    if (elecReviewArray.length !== 0) {
      totalElecReview = elecReviewArray.reduce((x, y) => x + y);
    } else {
      totalElecReview = 0;
    }

    let dLNRAmtArray = []
    let totalDLNR;
    let filterDLNR = this.props.job.costs.filter((costs) => {
      return costs.type === 'DLNR'
    }).map((filteredDLNR, index) => {
      dLNRAmtArray.push(filteredDLNR.amount)
    })
    if (dLNRAmtArray.length !== 0) {
      totalDLNR = dLNRAmtArray.reduce((x, y) => x + y);
    } else {
      totalDLNR = 0;
    }

    let chgOrderAmtArray = []
    let totalChangeOrder;
    let filterChangeOrder = this.props.job.costs.filter((costs) => {
      return costs.type === 'Change Order'
    }).filter((custCO) => {
      console.log(custCO)
      return custCO.billTo === 'Customer'
    }).map((changeOrder, index) => {
      chgOrderAmtArray.push(changeOrder.amount)
    })
    if (chgOrderAmtArray.length !== 0) {
      totalChangeOrder = chgOrderAmtArray.reduce((x, y) => x + y);
    } else {
      totalChangeOrder = 0;
    }
    console.log(totalChangeOrder);

    let permitDepositAmtArray = []
    let totalPermitDeposit;
    let filterPermitDeposit = this.props.job.costs.filter((costs) => {
      return costs.type === 'Permit Deposit Costs'
    }).map((permitDeposit, index) => {
      permitDepositAmtArray.push(permitDeposit.amount)
    })
    if (permitDepositAmtArray.length !== 0) {
      totalPermitDeposit = permitDepositAmtArray.reduce((x, y) => x + y);
    } else {
      totalPermitDeposit = 0;
    }

    let permitFinalAmtArray = []
    let totalPermitFinal;
    let filterPermitFinal = this.props.job.costs.filter((costs) => {
      return costs.type === 'Permit Final Costs'
    }).map((permitFinal, index) => {
      permitFinalAmtArray.push(permitFinal.amount)
    })
    if (permitFinalAmtArray.length !== 0) {
      totalPermitFinal = permitFinalAmtArray.reduce((x, y) => x + y);
    } else {
      totalPermitFinal = 0;
    }

    let jobCostCustomerArray = []
    let jobCostCustomer;
    let filterJobCosts = this.props.job.costs.filter((costs) => {
      return costs.type === 'Job Costs'
    }).filter((costs) => {
      return costs.billTo === 'Customer'
    }).map((jobCost, index) => {
      jobCostCustomerArray.push(jobCost.amount)
    })
    if (jobCostCustomerArray.length !== 0) {
      jobCostCustomer = jobCostCustomerArray.reduce((x, y) => x + y);
    } else {
      jobCostCustomer = 0;
    }

    let totalCostsAmtArray = [this.state.contractAmount, totalDPP, totalEA, totalSMA, totalCUP, totalDLNR, totalChangeOrder, totalElecReview, totalPermitDeposit, totalPermitFinal, jobCostCustomer].reduce((x, y) => x + y);

    const invoices = this.props.job.invoices.map((invoice, index) => {
      return (
        <div key={index} className='row'>
          <InvoiceDisplay JobId={this.props.job.id} invoice={invoice} invoiceKey={index}/>
        </div>
      )
    })

    const payments = this.props.job.payments.map((payment, index) => {
      return (
        <div key={index} className='row'>
          <PaymentDisplay JobId={this.props.job.id} payment={payment} paymentKey={index} />
        </div>
      )
    })

    if(this.props.job.loading) {
      return(
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
      )
    }

    if(this.props.job.error) {
      return (
        <div>Error</div>
      )
    }
    return (

      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">ACCOUNTING</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Accounting_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <JobCostDisplay JobId={this.props.job.id} job={this.props.job} />
          <br />
          <CostsDisplay job={this.props.job} dPP={totalDPP} changeOrders={totalChangeOrder} eA={totalEA} sMA={totalSMA} cUP={totalCUP} dLNR={totalDLNR} totalCost={totalCostsAmtArray} permitDeposit={totalPermitDeposit} permitFinal={totalPermitFinal} elecReview={totalElecReview} jobCostCust={jobCostCustomer} />
          <br />
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">INVOICES</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Accounting_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          {invoices}
          <br />
          <AddInvoiceModal JobId={this.props.job.id}/>
          <br />
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">PAYMENTS</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Accounting_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          {payments}
          <br />
          <AddPaymentModal JobId={this.props.job.id}/>
        </div>
      </div>
    )
  }
}

export default AccountingTab;
