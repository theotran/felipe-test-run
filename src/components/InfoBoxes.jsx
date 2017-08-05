import React, { Component } from 'react';

class InfoBoxes extends Component {
  render() {
    return (
      <div className="row">
      
        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="info-box">
            <span className="info-box-icon bg-date-weather"><i className="ion ion-ios-paperplane"></i></span>
            <div className="info-box-content">
             <span>Todays Date</span>
              <span className="info-box-text currentLocation"></span>
              <span className="info-box-number currentTemp"></span>
            </div>
          </div>
        </div>


        <div className="clearfix visible-sm-block"></div>

        <div className="col-md-4 col-sm-6 col-xs-12">
          <div className="info-box">
            <span className="info-box-icon bg-customers"><i className="ion ion-ios-people-outline"></i></span>

            <div className="info-box-content">
              <span className="info-box-text">

              </span>
              <span className="info-box-number">4</span>
            </div>

          </div>
        </div>
       
        <div className="col-md-4 col-sm-6 col-xs-12">
         <div className="info-box">
           <span className="info-box-icon bg-employees"><i className="ion ion-ios-people"></i></span>

           <div className="info-box-content">
             <span className="info-box-text">
               Active Programmers
             </span>
             <span className="info-box-number">3</span>
           </div>
         </div>

        </div>

      </div>
    )
  }
}


export default InfoBoxes;

