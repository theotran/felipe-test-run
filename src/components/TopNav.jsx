import React, { Component } from 'react';
import client from './../index.js';
import {browserHistory} from 'react-router';

class TopNav extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);


  }

  handleSubmit() {

  }


  render(){

    return (
      <header className="main-header">

        <nav className="navbar navbar-static-top">
          <a href="#" className="sidebar-toggle" id="toggle-sidebar-btn" data-toggle="offcanvas" role="button">
            <span className="sr-only">Toggle navigation</span>
          </a>

          <span className="logo-lg"><img role="presentation" className="ryion-brand" src="/images/ryion_logo_white_SM.png" /></span>


          <div className="navbar-custom-menu">

            <ul className="nav navbar-nav">
              <li className="dropdown profile-dropdown">
                  <a href="#" className="dropdown-toggle " data-toggle="dropdown">Welcome<b className="caret"></b></a>
                  <ul className="dropdown-menu">
                      
                  </ul>
              </li>

            </ul>
          </div>

        </nav>
      </header>
    );
  }
}



export default TopNav;
