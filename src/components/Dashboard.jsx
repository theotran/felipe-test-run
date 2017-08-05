import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import DoughnutComponent from './Doughnut';
import Line from './Line';
import JobTable from './LatestJobs';
import moment from 'moment';

class Dashboard extends Component {
  render(){
    console.log(this.props)
    let innerRadius1 = 100;
    let innerRadius2 = innerRadius1 - 24;
    let innerRadius3 = innerRadius2 - 24;
    let outerRadius1 = innerRadius1 + 6;
    let outerRadius2 = innerRadius2 + 6;
    let outerRadius3 = innerRadius3 + 6;
    let borderRadius = innerRadius1 + 24;
    // let percentComplete1 = .8;
    // let percentComplete2 = .15;
    // let percentComplete3 = .05;
    let percentCompleteArray = [0,0,0];
    // let lineData = [0,0,0];
    let circleGraph = null;
    let lineGraph = null;
    let sortedJobs = [];
    if(this.props.data.getJobs && this.props.data.getJobs.length > 0){

    
      let jobTypes = {
        Commercial: 0,
        Residential: 0,
        Utility: 0,
        total: 0
      }

      const displayMonths = [
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 6, 'months'), 
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 5, 'months'), 
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 4, 'months'),
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 3, 'months'),
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 2, 'months'),
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract( 1, 'months'),
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
        moment().set({'date': 1, 'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).add(1, 'months')
        ]
      let data = [
        {date: displayMonths[0], value: 0},
        {date: displayMonths[1], value: 0},
        {date: displayMonths[2], value: 0},
        {date: displayMonths[3], value: 0},
        {date: displayMonths[4], value: 0},
        {date: displayMonths[5], value: 0},
        {date: displayMonths[6], value: 0}
      ]
        function swap(items, firstIndex, secondIndex){
            var temp = items[firstIndex];
            items[firstIndex] = items[secondIndex];
            items[secondIndex] = temp;
        }
        function partition(items, left, right) {
            var pivot = null;
            if(items[Math.floor((right + left) / 2)].contract){
              pivot = items[Math.floor((right + left) / 2)].contract.startDate ? items[Math.floor((right + left) / 2)].contract.startDate : null;
            }
            var i = left;
            var j = right;
            while (i <= j) {
                while (items[i].contract.startDate > pivot) {
                    i++;
                }
                while (items[j].contract.startDate < pivot) {
                    j--;
                }
                if (i <= j) {
                    swap(items, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        }
        function quickSort(items, left, right) {
            var index;
            if (items.length > 1) {
                index = partition(items, left, right);
                if (left < index - 1) {
                    quickSort(items, left, index - 1);
                }
                if (index < right) {
                    quickSort(items, index, right);
                }
            }
            return items;
        }
        let jobsCopy = [...this.props.data.getJobs];
        console.log("JOBSCOPY", jobsCopy)
        sortedJobs = quickSort(jobsCopy, 0, jobsCopy.length - 1);
        console.log(sortedJobs);
      for(let i = 0; i < this.props.data.getJobs.length; i++){
        if(this.props.data.getJobs[i].type && this.props.data.getJobs[i].type !== 'Other'){
          jobTypes[this.props.data.getJobs[i].type]+= 1;
          jobTypes.total+= 1;
        }
        if(this.props.data.getJobs[i].contract && this.props.data.getJobs[i].contract.amount && this.props.data.getJobs[i].contract.startDate){
          for(let k = 0; k < displayMonths.length - 1; k++){
            if(moment(this.props.data.getJobs[i].contract.startDate).isSameOrAfter(displayMonths[k]) && moment(this.props.data.getJobs[i].contract.startDate).isBefore(displayMonths[k + 1])){
              data[k].value+= this.props.data.getJobs[i].contract.amount;
              break;
            }
          }
        }
      }
      percentCompleteArray = [(jobTypes.Commercial/jobTypes.total), (jobTypes.Residential/jobTypes.total), (jobTypes.Utility/jobTypes.total)];
      circleGraph = (()=>{
        return (
          <DoughnutComponent
              width={300}
              height={600}
              id="d3-arc"
              radius={[{inner: innerRadius1, outer: outerRadius1}, {inner: innerRadius2, outer: outerRadius2}, {inner: innerRadius3, outer: outerRadius3}, {inner: borderRadius, outer: borderRadius + 1}]}
              backgroundColor="#ADDCCF"
              foregroundColor={['#61385f', '#00B1B3', '#00C2F3']}
              percentComplete={percentCompleteArray}
             />
        )
      })();
      console.log(data);
      lineGraph = (()=>{
        return(
          <Line
            width={750}
            height={440}
            id="d3-line"
            backgroundColor="#00b1b3"
            lineData={data}
          />
        )
      })();
    }

    return (
      <div>
        <div className="row chartContainer">
          <div className="col-sm-9">
            {lineGraph}
          </div>
          <div className="col-sm-3">
            {circleGraph}
          </div>
        </div>
        <JobTable jobs={sortedJobs}/>
      </div>
    )
  }
}



const GetJobsWithContractsQuery = gql`
  query {
      getJobs {
        id
        name
        number
        type
        status
        contract{
          id
          amount
          startDate
        }
      }
    }
`;

const DashboardWithData = compose(
  graphql(GetJobsWithContractsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(Dashboard);

export default DashboardWithData;
