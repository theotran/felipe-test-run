import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Menu } from 'semantic-ui-react'
import PropTypes from 'prop-types'



class ProjectNavStacked extends Component {


  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    console.log(this.props.location)
    const { activeItem } = this.state;

    let ProjectNavInline = (
        <div>
          <Menu inverted color={'teal'} fluid widths={9} icon='labeled' size='mini'>
            <Menu.Item name='Site' active={activeItem === 'Site'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Site_Icon.svg'/>
              Site
            </Menu.Item>
            <Menu.Item name='Contract' active={activeItem === 'Contract'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Contract_Icon.svg'/>
              Contract
            </Menu.Item>
            <Menu.Item name='change-orders' active={activeItem === 'change-orders'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/ChangeOrders_Icon.svg'/>
              Change Orders
            </Menu.Item>
            <Menu.Item name='System' active={activeItem === 'System'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/System_Icon.svg'/>
              System
            </Menu.Item>
            <Menu.Item name='Electrical' active={activeItem === 'Electrical'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Electrical_Icon.svg'/>
              Electrical
            </Menu.Item>

            <Menu.Item name='Preview' active={activeItem === 'Preview'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Preview_Icon.svg'/>
              Preview
            </Menu.Item>
            <Menu.Item name='Design' active={activeItem === 'Design'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Design_Icon.svg'/>
              Design
            </Menu.Item>
            <Menu.Item name='Permitting' active={activeItem === 'Permitting'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Permitting_Icon.svg'/>
              Permitting
            </Menu.Item>
            <Menu.Item name='Utility' active={activeItem === 'Utility'} onClick={(e, data) => {
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Utility_Icon_White.svg'/>
              Utility
            </Menu.Item>
          </Menu>
        </div>
    );


      return ProjectNavInline;

  }
}


export default ProjectNavStacked;
