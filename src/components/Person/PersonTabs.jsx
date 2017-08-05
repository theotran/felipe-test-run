import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import PersonEdit from './PersonEdit';

class PersonTabs extends Component {

  render() {
    console.log(this.props.person);
    return (

      <div className="panel panel-success">

        <div className="panel-heading">Person</div>
        <div className="panel-body">
          <Tabs
            onSelect={this.handleSelect}
            selectedIndex={0}
          >
            <TabList>
              <Tab>1</Tab>
              <Tab>2</Tab>
              <Tab>3</Tab>
            </TabList>

            <TabPanel>
              <PersonEdit person={this.props.person} />
            </TabPanel>

            <TabPanel>
              <h2>Data 2</h2>
            </TabPanel>

            <TabPanel>
              <h2>Data 3</h2>
            </TabPanel>

          </Tabs>
        </div>
      </div>
    );
  }
}

export default PersonTabs;
