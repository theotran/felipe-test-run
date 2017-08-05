import React, { Component } from 'react';
import AddChangeOrderModal from './AddChangeOrderModal';
import ChangeOrderInfo from './ChangeOrderInfo';
import LabelInput from './../../LabelInput';
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo';;
import update from 'immutability-helper';
import GetJobQuery from '../../../queries/GetJobQuery';
let changeOrderAmtArray = []

class ChangeOrderTab extends Component {
  constructor(props) {
    super(props);

    let totalArray = this.props.job.costs.filter((costs) => {
      return costs.type === 'Change Order'
    }).map((cost, index) => {
      return cost.amount
    });

    if (totalArray.length >= 1) {
      totalArray = totalArray.reduce((x, y) => x + y)
    }

    this.totalChangeOrders = this.totalChangeOrders.bind(this)

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      isPaid: false,
      amount: '',
      description: '',
      billTo: 'Customer',
      jobId: this.props.job.id,
      totalChangeOrderAmount: totalArray,
      filterCosts: this.props.job.costs ? this.props.job.costs : []
    }
  }

  totalChangeOrders() {
    // console.log(changeOrderAmtArray)
    // this.setState({TotalChangeOrderAmount: changeOrderAmtArray.reduce((x, y) => x + y)  })
  }

  addChangeOrder = (info) => {
    console.log(info);
    this.props.CreateCost({
      variables: info,
        update: (proxy, result) => {
          console.log('PROXY', proxy);

          console.log('RESULT', result);

          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });
          console.log('data', data);
          console.log('create cost result', result);

          data.job.costs.push(result.data.createCost);

          console.log('data after adding costs', data);

          // Write our combined data back to the store cache
          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
    })
    .then((value) => {
      console.log("value in the create cost mutation ", value)
      let newData = update(this.state, {
        filterCosts: {$push: [value.data.createCost]}
      });
      this.setState(newData);
      return value;
    });
  }

  render() {
    console.log(this.state)
    if(this.props.job.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
      );
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    let filterCosts;

    if(this.state.filterCosts !== []) {
      filterCosts = this.state.filterCosts.filter((costs) => {
        console.log(costs)
        return costs.type === 'Change Order'
      });
    }

    let changeOrders;

    if (filterCosts.length === 0) {
      changeOrders = <div><br /><br />There are currently no change orders for this project. <br />To add one click the buton below.</div>
    } else {
      changeOrders = filterCosts.map((cost, index) => {
        changeOrderAmtArray.push(cost.amount)
        // this.state.TotalChangeOrderAmount = changeOrderAmtArray

        return(
          <ChangeOrderInfo cost={cost} key={index} costNumber={index} JobId={this.props.job.id} />
        )
      })
    }

    let totalChangeOrders;
    if (filterCosts.length !== 0) {
      totalChangeOrders =
      <LabelInput className="col-md-12"
        label='**Total Change Order Amount**'
        name='Total change order amount'
        value={this.state.totalChangeOrderAmount ? this.state.totalChangeOrderAmount: ''}
        placeholder='0.00'
        readOnly
      />
    }

    if (changeOrderAmtArray.length > 0) {
      this.totalChangeOrders
    }

    return (
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">CHANGE ORDERS</h4>
                  <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/ChangeOrders_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {changeOrders}
              <br />
              <AddChangeOrderModal addChangeOrder={this.addChangeOrder} JobId={this.props.job.id} />
            </div>
            <div className="row">
              {totalChangeOrders}
            </div>
          </div>
        </div>
    )
  }
}

const createCostMutation = gql`
  mutation createCost($JobId: ID!, $type: String, $description: String, $amount: Float, $billTo: String, $isPaid: Boolean) {
    createCost(input: {JobId: $JobId, type: $type, description: $description, amount: $amount, billTo: $billTo, isPaid: $isPaid}) {
        id
        type
        description
        amount
        isPaid
        billTo
        createdAt
    }
  }
`;

const ChangeOrderTabWithData = compose(
  graphql(createCostMutation, { name: "CreateCost" }),
)(ChangeOrderTab)

export default ChangeOrderTabWithData;
