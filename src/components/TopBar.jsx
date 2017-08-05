import React, { Component } from 'react';

class TopBar extends Component {

  render(){

    return (
      <header className="main-header">

        <nav className="navbar navbar-static-top">

          <span className="logo-lg"><img role="presentation" className="ryion-brandTopBar" src="/images/ryion_logo_white__TM_SM.png" /></span>

        </nav>
      </header>
    );
  }
}

/*<div className="font-control-group">
  <a href="#" id="decfont"><span style={{ fontSize : '10px'}}> A </span></a>
  <span style={{ fontSize : '18px'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
  <a href="#" id="incfont"><span style={{ fontSize : '16px'}}> A </span></a>
</div>*/

export default TopBar;
