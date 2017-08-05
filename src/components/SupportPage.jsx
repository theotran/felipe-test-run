import React, { Component } from 'react';



class SupportPage extends Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className='panel-body'>
          <div className='row'>
            <div className="col-md-12 pageHeader">
              <h4 className="pageHeaderText">SUPPORT</h4>
              <img className="customIconsSidebar" role="presentation" src='/images/Support_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <h4>Theo Tran</h4>
              <div>Lead Frontend Developer</div>
              <div>Phone: (808)-200-7861 ext. 109</div>
              <div>Email: theo.tran@ryion.com</div>
            </div>
            <div className='col-md-6'>
              <h4>Nick Cadiente</h4>
              <div>Lead Backend Engineer</div>
              <div>Phone: (808)-200-7861 ext. 108</div>
              <div>Email: nick.cadiente@ryion.com</div>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-6'>
              <h4>Bryce Saito</h4>
              <div>Full Stack Developer</div>
              <div>Phone: (808)-200-7861 ext. 111</div>
              <div>Email: bryce.saito@ryion.com</div>
            </div>
            <div className='col-md-6'>
              <h4>Micah Koki</h4>
              <div>Full Stack Developer</div>
              <div>Phone: (808)-200-7861 ext. 115</div>
              <div>Email: micah.koki@ryion.com</div>
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-6'>
              <h4>Jonathan Ah-Nee</h4>
              <div>Full Stack Developer</div>
              <div>Phone: (808)-200-7861 ext. 112</div>
              <div>Email: jon.ahnee@ryion.com</div>
            </div>
            <div className='col-md-6'>
              <h4>Taylor BuChans</h4>
              <div>Designer</div>
              <div>Phone: (808)-200-7861 ext. 113</div>
              <div>Email: taylor.buchans@ryion.com</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SupportPage;
