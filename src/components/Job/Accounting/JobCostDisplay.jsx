

import React, { Component } from 'react';
import AddJobCostModal from './AddJobCostModal';
import moment from 'moment';

class JobCostDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {

    let filterJobCosts = this.props.job.costs.filter((costs) => {
      return costs.type === 'Job Costs'
    })

    const jobCosts = filterJobCosts.map((jobCost, index) => {
      return (
        <div key={index}>
          <div className='row'>
            <div className='col-md-2'>
              <div>{moment(jobCost.createdAt).format('lll')}</div>
            </div>
            <div className='col-md-2'>
              <div>{jobCost.amount}</div>
            </div>
            <div className='col-md-3'>
              <div>{jobCost.billTo}</div>
            </div>
            <div className='col-md-5'>
              <div>{jobCost.description}</div>
            </div>
          </div>
        </div>
      );
    });

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
          <div className="panel-heading comm-jobs-panel-heading">Job Costs</div>
          <div className='row'>
            <div className='col-md-2'>
              <div>Date Added</div>
            </div>
            <div className='col-md-2'>
              <div>Amount</div>
            </div>
            <div className='col-md-3'>
              <div>Bill To</div>
            </div>
            <div className='col-md-5'>
              <div>Description</div>
            </div>
          </div>
          {jobCosts}
          <br />
          <div className='row'>
            <AddJobCostModal JobId={this.props.job.id} type={'Job Costs'} form={'ADD JOB COST'}/>
          </div>
        </div>
      //   </div>
      // </div>
    )
  }
}

export default JobCostDisplay;
