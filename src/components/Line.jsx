import React, { Component } from 'react';
import * as d3 from 'd3';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';


// const data = [
//   {date: new Date(2017, 0), value: 0},
//   {date: new Date(2017, 1), value: 89986.98},
//   {date: new Date(2017, 2), value: 130983.78},
//   {date: new Date(2017, 3), value: 110545.21},
//   {date: new Date(2017, 4), value: 67809.09},
//   {date: new Date(2017, 5), value: 98798.06},
//   {date: new Date(2017, 6), value: 13408.95},
// ]

const data = [
  {date: moment().set('day', 1).subtract( 6, 'months'), value: 1000},
  {date: moment().set('day', 1).subtract( 5, 'months'), value: 3000},
  {date: moment().set('day', 1).subtract( 4, 'months'), value: 10000},
  {date: moment().set('day', 1).subtract( 3, 'months'), value: 67342},
  {date: moment().set('day', 1).subtract( 2, 'months'), value: 23789},
  {date: moment().set('day', 1).subtract( 1, 'months'), value: 2341},
  {date: moment().set('day', 1), value: 0}
]

const margin = {top: 20, right: 40, bottom: 20, left: 40};


class LineComponent extends Component {

  displayName: 'BarExample'

  componentDidMount() {
    const { width, height } = this.props;
    console.log("DATADIDMOUNT", this.props);
    let scaleWidth = width - margin.left - margin.right;
    let scaleHeight = height - margin.top - margin.bottom;
    let svg = this.setSVG();
    let g = svg.append('g')
        .attr('transform', `translate (${margin.left}, ${margin.top})`)

    let parseTime = d3.timeParse('%Y-%m');

    let x = d3.scaleTime()
        .range([0, scaleWidth]);

    let y = d3.scaleLinear()
        .range([scaleHeight, 50]);

    function makeXGridLines () {
      return d3.axisBottom(x)
          .ticks(5);
    }
    function makeYGridLines () {
      return d3.axisLeft(y)
          .ticks(10);
    }

    let area = d3.area()
        .x((d) => {
          return x((d.date))
        })
        .y1((d) => {
          return y(d.value)
        })
        .curve(d3.curveCardinal.tension(0.8));

    let line = d3.line()
        .x((d) => {
          return x((d.date))
        })
        .y((d) => {
          return y(d.value)
        })
        .curve(d3.curveCardinal.tension(0.8));

    x.domain(d3.extent(this.props.lineData, (d) => {
      return d.date;
    }))
    y.domain(d3.extent(this.props.lineData, (d) => {
      return d.value;
    }))
    area.y0(y(d3.min(this.props.lineData, (d) => {
      return d.value;
    })))


    let xAxis = g.append('g')
        .attr('transform', `translate(${-margin.left}, ${scaleHeight})`)
        .call(d3.axisBottom(x).ticks(6).tickSize(16, 0).tickFormat(d3.timeFormat('%B')))

    xAxis.select('.domain')
        .remove();
    xAxis.selectAll('.tick text')
        .attr('text-anchor', 'start')
        .attr('x', margin.left * 0.8)
        .attr('y', 6)
    xAxis.select('.tick:first-child line')
        .remove();

    let yAxis = g.append('g')
      .attr('transform', `translate(${-margin.left}, ${-margin.bottom})`)
      .call(d3.axisRight(y).ticks(12).tickSize(0).tickPadding(10))

    yAxis.select('.domain')
      .remove();
    // yAxis.append('text')
    //   .attr('fill', '#000')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('x', 20)
    //   .attr('dy', '0.71em')
    //   .attr('text-anchor', 'end')
    //   .text('Something (???)');

    g.selectAll('.tick text')
        .attr('fill', 'steelblue')
    g.selectAll('.tick line')
        .attr('stroke', 'steelblue')

    g.append('clipPath')
        .attr('id', 'rectClip')
      .append('rect')
        .attr('width', 0)
        .attr('height', scaleHeight);

    let areaGraph = g.append('path')
        .datum(this.props.lineData)
        .attr('fill', this.props.backgroundColor)
        // .attr('fill', 'white')
        // .attr('stroke', 'steelblue')
        // .attr('stroke-width', 1.5)
        .attr('transform', `translate (0, ${-margin.bottom})`)
        .attr('d', area)
        .attr('clip-path', 'url(#rectClip)')

    let gridX = g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(${-margin.left}, ${scaleHeight})`)
        .call(makeXGridLines()
            .tickSize(-height)
            .tickFormat('')
        )
    gridX.select('.domain')
      .remove();
    gridX.select('.tick:first-child line')
      .remove();
    gridX.selectAll('.tick line')
        .attr('stroke', 'white')

    let gridY = g.append('g')
        .attr('class', 'grid')
        .call(makeYGridLines()
            .tickSize(-width)
            .tickFormat('')
        )
    gridY.select('.domain')
      .remove();
    gridY.select('.tick:first-child line')
      .remove();
    gridY.selectAll('.tick line')
        .attr('stroke', 'white')

    let lineGraph = g.append('path')
      .datum(this.props.lineData)
      .attr('fill', 'none')
      .attr('stroke', this.props.backgroundColor)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('d', line)
      .attr('clip-path', 'url(#rectClip)')
      .attr('transform', `translate (0, ${-margin.bottom * 1.8})`)

    // transitions
    d3.select('#rectClip rect').transition()
        .duration(1500)
        .ease(d3.easeCubicInOut)
        .attr('width', width)
  }

  setSVG() {
    const { height, width, id } = this.props;
    return d3.select(this.refs.line).append('svg')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('id', id)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
  }

  render() {
    console.log("LINEPROPS", this.props);
    console.log('LINEthis.props.lineData', this.props.lineData);
    return (
      <div className="panel panel-success">
      {/* <div className="panel-heading">Recap Report</div> */}
        <div className="row">
          <div className="col-md-3 lineChartHeader">
            <h4 className="tabHeaderText">SALES CHART</h4>
          </div>
        </div>
        <div className="panel-body">
          <div ref='line' style={{ borderLeft: `1px solid ${this.props.backgroundColor}`, borderBottom: `1px solid ${this.props.backgroundColor}`}}/>
        </div>
      </div>
    );
  }
};

const getJobsQuery = gql`
  query {
    getJobs {
      id
      name
      number
      type
      status
      contract {
        id
        amount
        createdAt
        startDate
      }
    }
  }`;

  const LineComponentWithData = graphql(getJobsQuery, {
  options: {
    fetchPolicy: 'cache-and-network'
  }
})(LineComponent);

export default LineComponentWithData;
