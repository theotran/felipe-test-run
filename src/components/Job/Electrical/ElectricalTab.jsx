import React, { Component } from 'react';
import Meter from './Meter';
class ElectricalTab extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
    }
  }

  handleBlur() {

  }

  toggleCheckbox(key) {
    console.log("Toggling checkbox value! ");
    const nextKeyState = !this.state[key];
    this.setState({ [key]: nextKeyState });
  }

  render() {
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

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">ELECTRICAL</h4>
                <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Electrical_Icon_p.svg' height="35" width="50"/>
            </div>
          </div>
          {this.props.job.meters ? this.props.job.meters.map((meter, index) => {
            console.log("Meters ", meter)
            return (<Meter key={index} meter={meter} job={this.props.job}/>)
          }) : <div>No Meters to display...</div>}
        </div>
      </div>
    )
  }
}


export default ElectricalTab;
