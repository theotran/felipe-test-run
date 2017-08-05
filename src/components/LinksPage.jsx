import React, { Component } from 'react';

import { Card } from 'semantic-ui-react'

class LinksPage extends Component {
  render() {
    return (
    <div>
      <div className="row">
        <div className="pageHeader">
          <h4 className="pageHeaderText">Links</h4>
          <img className="customIconsSidebar" role="presentation" src='/images/Links_Icon.svg' height="35" width="50"/>
        </div>
      </div>
      <div className="row">

              <p><a className="linksPageLink" href='http://solarprofessional.com/home/' target='_blank'>Solar Pro Magazine</a></p>
              <p><a className="linksPageLink" href='http://solarenergy.org' target='_blank'>Solar Energy International</a></p>
              <p><a className="linksPageLink" href='http://programs.dsireusa.org/system/program' target='_blank'>Database of State Incentives for Renewables & Efficiency</a></p>
              <p><a className="linksPageLink" href='http://www.seia.org' target='_blank'>Solar Energy Industries Association</a></p>
              <p><a className="linksPageLink" href='http://www.greenideahouse.com' target='_blank'>Green Idea House</a></p>
              <p><a className="linksPageLink" href='http://www1.eere.energy.gov/solar' target='_blank'>US Department of Energy</a></p>
              <p><a className="linksPageLink" href='http://www.nrel.gov/rredc/pvwatts/' target='_blank'>NREL - PV Watts</a></p>
              <p><a className="linksPageLink" href='http://www.eia.doe.gov' target='_blank'>The Energy Information Administration</a></p>
              <p><a className="linksPageLink" href='http://www.homepower.com/home/' target='_blank'>Home Power Magazine</a></p>
              <p><a className="linksPageLink" href='http://solarenergy.org' target='_blank'>Solar Energy International</a></p>
              <p><a className="linksPageLink" href='http://www.solaroregon.org' target='_blank'>Solar Oregon</a></p>
              <p><a className="linksPageLink" href='http://www.hsea.org' target='_blank'>Hawaii Solar Energy Association</a></p>
              <p><a className="linksPageLink" href='http://calseia.org' target='_blank'>California Solar Energy Industries </a></p>
              <p><a className="linksPageLink" href='http://www.nrel.gov/solar' target='_blank'>National Renewable Energy Laboratory</a></p>
              <p><a className="linksPageLink" href='http://www.nabcep.org' target='_blank'>NABCEP</a></p>
              <p><a className="linksPageLink" href='http://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70' target='_blank'>National Electric Code</a></p>
              <p><a className="linksPageLink" href='https://codes.iccsafe.org/public/document/toc/542/' target='_blank'>International Building Code</a></p>
              <p><a className="linksPageLink" href='http://www.gosolarcalifornia.org' target='_blank'>Go Solar California</a></p>
              <br /><br />
              <p>Click here to submit links</p>
          
      </div>

    </div>
    )
  }
}

export default LinksPage;
