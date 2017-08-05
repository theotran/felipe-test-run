import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import SiteTab from './Site/SiteTab';
import ContractTab from './Contract/ContractTab';
import ConstructionTab from './Construction/ConstructionTab';
import SystemTab from './System/SystemTab';
class JobTabs extends Component {


  handleSelect(index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
  }

  render() {
    return (

      <div className="panel panel-success">

        <div className="panel-heading">Job</div>
        <div className="panel-body">
          <Tabs
            onSelect={this.handleSelect}
            selectedIndex={0}
          >
            <TabList>
              <Tab>Project</Tab>
              <Tab>System</Tab>
              <Tab>Electrical</Tab>
              <Tab>Inspection</Tab>
              <Tab>Design</Tab>
              <Tab>Permitting</Tab>
              <Tab>Utility</Tab>
              <Tab>Construction</Tab>
              <Tab>Contract</Tab>
              <Tab>Accounting</Tab>
            </TabList>
            <TabPanel>
              <SiteTab job={this.props.job} pm={this.props.pm} address={this.props.address}/>
            </TabPanel>

            <TabPanel>
              <SystemTab job={this.props.job} />
            </TabPanel>

            <TabPanel>
              <h2>Data 3</h2>
            </TabPanel>

            <TabPanel>
              <h2>Data 4</h2>
            </TabPanel>

            <TabPanel>
              <h2>Data 5</h2>
            </TabPanel>

            <TabPanel>
              <h2>Data 6</h2>
            </TabPanel>

            <TabPanel>
              <h2>Data 7</h2>
            </TabPanel>

            <TabPanel>
              <ConstructionTab job={this.props.job} />
            </TabPanel>

            <TabPanel>
              <ContractTab job={this.props.job} />
            </TabPanel>

            <TabPanel>
              <h2>Data 10</h2>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    );
  }
}




export default JobTabs;









