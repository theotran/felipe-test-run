

import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import LabelInput from './../../LabelInput';

class ConversionInput extends Component {
  constructor(props) {
    super(props);

    this.onPercentChange = this.onPercentChange.bind(this);
    this.onDollarChange = this.onDollarChange.bind(this);

    this.state = {
      contractAmount: this.props.contractAmount,
      termAmount: this.props.term.amount ? this.props.term.amount : 0,
      dueUpon: this.props.term.dueUpon ? this.props.term.dueUpon : '',
      percentAmount: parseFloat(this.props.term.amount / this.props.contractAmount * 100.0)
    }
  }

  percentToDollar(p) {
    return (parseFloat(p) * this.state.contractAmount) / 100.0;
  }

  dollarToPercent(d) {
    return d / this.state.contractAmount * 100.0;
  }

  onPercentChange(data) {
    this.setState({
      percentAmount: parseFloat(data),
      termAmount : this.percentToDollar(data)
    })
  }

  onDollarChange(data) {
    this.setState({
      percentAmount: this.dollarToPercent(data),
      termAmount: parseFloat(data)
    })
  }

  componentWillReceiveProps() {
    this.setState({
      contractAmount: this.props.contractAmount
    })
    this.onDollarChange(this.state.termAmount);
  }

  render() {
    console.log(this.state.termAmount)
    return(
      <div className="row">
        {/* <div className="form-group col-md-3">
            <label>Total Contract Amount</label>
            <input
              name="Contract Amount"
              type="number"
              className='form-control'
              value={this.state.contractAmount}
              onChange={(e) => this.setState({contractAmount: e.target.value})}
            />
        </div> */}
        <div className="form-group col-md-6">
          <label htmlFor="">Due Upon</label>
          <Dropdown
            placeholder='Due Upon'
            fluid selection options={[
               { text: 'Contract Signed', value: 'Contract Signed', },
               { text: 'Site Inspection Complete', value: 'Site Inspection Complete', },
               { text: '30% Drawings', value: '30% Drawings', },
               { text: '60% Drawings', value: '60% Drawings', },
               { text: 'Utility Submittal', value: 'Utility Submittal', },
               { text: 'Utility RFC Approval', value: 'Utility RFC Approval', },
               { text: 'Utility Cond. Approval', value: 'Utility Cond. Approval', },
               { text: 'Utility WVT Approval', value: 'Utility WVT Approval', },
               { text: 'DPP IBPN', value: 'DPP IBPN', },
               { text: 'DPP Permit Received', value: 'DPP Permit Received', },
               { text: 'DPP Permit Closed', value: 'DPP Permit Closed', },
               { text: 'Start Construction', value: 'Start Construction', },
               { text: '25% Construction', value: '25% Construction', },
               { text: '50% Construction', value: '50% Construction', },
               { text: '75% Construction', value: '75% Construction', },
               { text: '100% Construction', value: '100% Construction', },
               { text: 'As-Builts Complete', value: 'As-Builts Complete', },
               { text: 'Other', value: 'Other', },
            ]}
            value={this.state.dueUpon ? this.state.dueUpon : ''}
            onChange={(e, data) => {
              console.log("VALUE IN DROPDOWN ", data)
              this.setState({ dueUpon: data.value }, this.handleBlur)
            }}
          />
        </div>
        <LabelInput type="number" className={'col-md-3'} label='Amount' name='DollarAmount' value={this.state.termAmount.toFixed(2)} placeholder='Amount' onChange={(e) => this.onDollarChange(e.target.value)} />
        <LabelInput type="number" className={'col-md-3'} label='Amount %' name='PercentageAmount' value={this.state.percentAmount} placeholder='Amount %' onChange={(e) => this.onPercentChange(e.target.value)} />
      </div>
    )
  }

}


export default ConversionInput;
