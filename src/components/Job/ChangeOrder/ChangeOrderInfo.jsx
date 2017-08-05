

import React, { Component } from 'react';
import GetJobQuery from '../../../queries/GetJobQuery';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import client from './../../../index.js';
import { withRouter } from 'react-router';

let cachedJobQuery;
let paidOff;

const UpdateCostMutation = gql`
  mutation updateCost($id: ID, $description: String, $amount: Float, $billTo: String) {updateCost(input: {id: $id, description: $description, amount: $amount, billTo: $billTo}) {
      id
  		description
      type
      amount
      billTo
    }
  }
`;

class ChangeOrderInfo extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      cost: this.props.cost,
      costNumber: this.props.costNumber,
      billTo: this.props.cost.billTo,
      amount: this.props.cost.amount,
      description: this.props.cost.description
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.JobId
      }
    });

    const cachedIndex = cachedJobQuery.job.costs[this.state.costNumber];

    if(cachedIndex.billTo !== this.state.billTo || cachedIndex.amount !== this.state.amount || cachedIndex.description !== this.state.description) {

      client.mutate({
        mutation: UpdateCostMutation,
        variables: {
          id: this.state.cost.id,
          billTo: this.state.billTo,
          amount: this.state.amount,
          description: this.state.description
        },
        optimisticResponse: {
          id: this.state.cost.id,
          billTo: this.state.billTo,
          amount: this.state.amount,
          description: this.state.description
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            }
          });

          console.log("proxy", proxy);
          console.log("result", result);
          console.log("data", data);

          if('updateCost' in result.data) {
            data.job.costs[this.state.costNumber] = result.data.updateCost;
          } else {
            data.job.costs[this.state.costNumber] = result.data;
          }

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.JobId
        }
      });
      console.log(cachedJobQuery)
    }
  }

  render() {
    // if(this.props.data.loading) {
    //   return (<div>Loading</div>);
    // }
    //
    // if(this.props.data.error) {
    //   console.log(this.props.job.error);
    //   return (<div>An unexpected error occurred</div>);
    // }

    if (this.state.cost.isPaid === false) {
      paidOff = <div>Outstanding</div>
    } else {
      paidOff = <div>Paid</div>
    }

    return(
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          // title={'Bill To: ' + this.state.billTo}
          title={"Amount : $" + parseFloat(this.state.amount).toFixed(2)}
          subtitle={paidOff}
          // subtitle={"Amount : $" + parseFloat(this.state.amount).toFixed(2)}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            <div className='row'>
              <div className='form-group col-md-12'>
                <label htmlFor="">Amount (No $ or Comma)</label>
                <input
                  name='Amount'
                  className="form-control"
                  value={this.state.amount}
                  placeholder='0.00'
                  onChange={(e) => this.setState({amount: e.target.value})}
                  onBlur={(e) => { this.handleBlur() }}
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
                  onBlur={(e) => { this.handleBlur() }}
                  rows="5"
                />
              </div>
            </div>
          </div>
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    )
  }
}

const ChangeOrdernfoWithMutation = graphql(UpdateCostMutation)(withRouter(ChangeOrderInfo));

export default ChangeOrdernfoWithMutation;

// export default ChangeOrderInfo;
