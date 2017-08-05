import React, { Component, PropTypes } from 'react';
import * as d3 from 'd3';




class DonutComponent extends Component {
  constructor(props) {
    super(props);
    this.innerArc = this.innerArc.bind(this);
    this.arcTween = this.arcTween.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  displayName: 'DonutComponent';

  propTypes: {
    id: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    percentComplete: PropTypes.number
  }
  componentWillReceiveProps(){

  }
  componentDidMount() {
    console.log('COMPONENTDIDMOUNT', this.props);
    const context = this.setContext();
    let arcContainer = context.append('g')
        .attr('transform', `translate(130, ${this.props.height * 0.3})`);
    let legend = arcContainer.append('g')
        .attr('transform', `translate(-90, ${this.props.radius[this.props.radius.length - 1].inner + 40})`)

    legend.append('rect')
        .attr('height', '80px')
        .attr('width', '200px')
        .style('fill', 'none')
        .style('stroke', `${this.props.backgroundColor}`)
        .style('stroke-width', '1')
    let legendKeys = [
      {text: `Commercial ${(this.props.percentComplete[0]*100).toFixed(1)}%`, color: this.props.foregroundColor[0], x: 10, y: 13},
      {text: `Residential ${(this.props.percentComplete[1]*100).toFixed(1)}%`, color: this.props.foregroundColor[1], x: 10, y: 33},
      {text: `Utility ${(this.props.percentComplete[2]*100).toFixed(1)}%`, color: this.props.foregroundColor[2], x: 10, y: 53}
    ];

    let legendColors = legend.append('g').selectAll('rect')
        .data(legendKeys)
      .enter().append('rect')
        .attr('height', `${80 * 0.2}px`)
        .attr('width', `${190 * 0.2}px`)
        .attr('transform', (d) => {
          return `translate(${d.x}, ${d.y})`;
        })
        .attr('fill', (d) => {
          return d.color;
        })
    let legendText = legend.append('g').selectAll('text')
        .data(legendKeys)
      .enter().append('text')
        .attr('transform', (d) => {
          return `translate(${d.x + (150 * 0.25)}, ${d.y - 3})`;
        })
        .text((d) => {
          return d.text;
        })
        .style('font-family', 'helvetica')
        .style('font-size', '120%')
        .attr('fill', this.props.foregroundColor[0])
        .style('dominant-baseline', 'text-before-edge');


    this.createArcs(arcContainer);
    // this.setForeground(context);
  }
  tau = Math.PI * 2;

  setContext() {
    const { height, width, id } = this.props;
    return d3.select(this.refs.arc).append('svg')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('id', id)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
  }

  createArcs(context) {
    let innerArcPath = context.selectAll('path')
        .call(this.innerArc, this.props.radius)

    let commercialEndAngle = this.props.percentComplete[0] * this.tau;
    let residentialEndAngle = this.props.percentComplete[1] * this.tau + commercialEndAngle;
    let utilityEndAngle = this.props.percentComplete[2] * this.tau + residentialEndAngle;
    let commercialArc = d3.arc()
        .innerRadius(this.props.radius[0].inner - 4)
        .outerRadius(this.props.radius[0].outer + 4)
        .startAngle(0);

    let commercialArcPath = context.append('path')
        .datum({endAngle: 0})
        .style('fill', this.props.foregroundColor[0])
        .attr('d', commercialArc)

    commercialArcPath.transition()
        .duration(1500)
        .attrTween('d', this.arcTween(commercialEndAngle, commercialArc))

    let residentialArc = d3.arc()
        .innerRadius(this.props.radius[1].inner - 4)
        .outerRadius(this.props.radius[1].outer + 4)
        .startAngle(commercialEndAngle);

    let residentialArcPath = context.append('path')
        .datum({endAngle: commercialEndAngle})
        .style('fill', this.props.foregroundColor[1])
        .attr('d', residentialArc)

    residentialArcPath.transition()
        .duration(1500)
        .attrTween('d', this.arcTween(residentialEndAngle, residentialArc))

    let utilityArc = d3.arc()
        .innerRadius(this.props.radius[2].inner - 4)
        .outerRadius(this.props.radius[2].outer + 4)
        .startAngle(residentialEndAngle);

    let utilityArcPath = context.append('path')
        .datum({endAngle: residentialEndAngle})
        .style('fill', this.props.foregroundColor[2])
        .attr('d', utilityArc)

    utilityArcPath.transition()
        .duration(1500)
        .attrTween('d', this.arcTween(utilityEndAngle, utilityArc))
  }

  innerArc(selection, data) {
    let innerArc = d3.arc()
    for (let i = 0; i < data.length; i++) {
      innerArc.innerRadius(data[i].inner)
        .outerRadius(data[i].outer)
        .startAngle(0)
        // .endAngle(this.tau)
      selection.data(data)
        .enter().append('path')
          .datum({ endAngle: this.tau })
          .style('fill', this.props.backgroundColor)
          .attr('d', innerArc)
    }
  }

  arcTween(newAngle, newArc) {
    return (d) => {
      let interpolate = d3.interpolate(d.endAngle, newAngle);
      return (t) => {
        d.endAngle = interpolate(t);
        return newArc(d);
      }
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="panel panel-success" >
      {/* <div className="panel-heading">Project Value</div> */}
        <div className="row">
          <div className="col-md-8 donutChartHeader">
            <h4 className="tabHeaderText">PROJECT TYPES</h4>
          </div>
        </div>
        <div className="panel-body" style={{width: '100%', height: '100%'}}>
          <div ref='arc' />
        </div>
      </div>
    );
  }
}



export default DonutComponent;
