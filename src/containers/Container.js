

import React, { Component } from 'react';
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { Loader, Segment, Dimmer } from 'semantic-ui-react';


console.log('Navs', SideNav, TopNav)


const Footer = () => (
  <div className="row">
   <footer className="main-footer">
     <div className="pull-right hidden-xs version">
       V1.12
     </div>
     <span className="copyright">Copyright &copy; Square Whale, Inc. All rights Reserved</span>
   </footer>
  </div>
)

class Container extends Component {
  constructor(props) {
    super(props);

  }


  render() {

    return (
      <div>
        <TopNav />
        <SideNav />
        <div className="content-wrapper">
          <section className="contentRyion">
            <div className="row">
              <div className="mainContentWrapper">
                {this.props.children}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    )
  }
}

export default Container;
