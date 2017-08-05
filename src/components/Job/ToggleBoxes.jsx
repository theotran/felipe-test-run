import React, { Component } from 'react';
import { Link } from 'react-router';

class ToggleBoxes extends Component {
  render() {
    return (
      <div>
        <div className="row">
        
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to='projects' onlyActiveOnIndex activeStyle={{ color: '#ffffff', background: '#1e282c', borderLeftColor: '#2cb1aa' }}>
              <div className="info-box">
                <div className="info-box-content">
                 <span>Commercial</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to='/test' onlyActiveOnIndex activeStyle={{ color: '#ffffff', background: '#1e282c', borderLeftColor: '#2cb1aa' }}>
              <div className="info-box">
                <div className="info-box-content">
                 <span>Residential</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="info-box">
              <div className="info-box-content">
               <span>Utility</span>
              </div>
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}


export default ToggleBoxes;