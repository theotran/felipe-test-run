import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';
import Drawer from './Drawer';
import { Label } from 'semantic-ui-react';



class SideNav extends Component {
  render(){
    if(this.props.data.loading) {
      return <div></div>;
    }

    let counter = this.props.data.getUserTasks ? this.props.data.getUserTasks.length : 0;

    let taskLabel;
    if(counter !== 0) {
      taskLabel = <Label className="sideNavNotification" color='teal' floating >{counter}</Label>;
    } else {
      taskLabel = '';
    }
    return (
      <aside className="main-sidebar">

        <section className="sidebar">

          <ul className="sidebar-menu">

            <li className="navItem" id="Dashboard">
              <Link to='/dashboard' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-dashboard popout"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Dashboard_Icon.svg'/>
                <span>Dashboard</span>
                <span className="pull-right-container">
                  <span className="label label-primary pull-right"></span>
                </span>
              </Link>
            </li>
            <li className="navItem" id="Customers">
              <Link to='/customers' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-user"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Customers_Icon.svg'/>
                <span>Customers</span>
              </Link>
            </li>
            <li className="navItem" id="Employees">
              <Link to='/employees' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-user"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Employee_Icon.svg'/>
                <span>Employees</span>
              </Link>
            </li>
            <li className="navItem" id="Commercial">
              <Link to='/projects'  onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-industry"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Projects_Icon.svg'/>
                <span>Projects</span>
              </Link>
            </li>
            <li className="navItem" id="Utility">
              <Link to='/utilities' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-institution"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Utility_Icon.svg'/>
                <span>Utilities</span>
              </Link>
            </li>
            <li className="navItem" id="Task List">
              <Link to='/task-list' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-files-o"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/TaskList_Icon.svg'/>
                <span>Task List</span>
                {taskLabel}
              </Link>
            </li>
            <li className="navItem" id="Accounting">
              <Link to='/accounting' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-credit-card"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Accounting_Icon.svg'/>
                <span>Accounting</span>
              </Link>
            </li>
            <li className="navItem" id="Equipment">
              <Link to='/equipment' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-wrench"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Equipment_Icon.svg'/>
                <span>Equipment</span>
              </Link>
            </li>
            {/* <li className="navItem" id="Maps">
              <Link to='/maps' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                <img className="customIconsSidebar" role="presentation" src='/images/Maps_Icon.svg'/>
                <span>Maps</span>
              </Link>
            </li> */}
            <li className="navItem" id="Links">
              <Link to='/links' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-binoculars"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Links_Icon.svg'/>
                <span>Links</span>
              </Link>
            </li>
            <li className="navItem" id="Calendars">
              <Link to='/calendar' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-calendar"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Calendar_Icon.svg'/>
                <span>Calendar</span>
              </Link>
            </li>
            <li className="navItem" id="Single Line Generator">
              <Link to='/sld' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                <img className="customIconsSidebar" role="presentation" src='/images/Design_Icon_p.svg'/>
                <span>Single-line Generator</span>
              </Link>
            </li>
            <li className="navItem" id="Statistics">
              <Link to='/stats' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-bar-chart"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Statistics_Icon.svg'/>
                <span>Statistics</span>
              </Link>
            </li>
            <li className="navItem">
              <Link to='support' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-comments"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/Support_Icon.svg'/>
                <span>Support</span>
              </Link>
            </li>
           <li className="navItem" id="Admin Home">
              <Link to='/admin' onlyActiveOnIndex activeStyle={{ background: '#fff' }}>
                {/* <i className="fa fa-gear"></i> */}
                <img className="customIconsSidebar" role="presentation" src='/images/AdminHome_Icon.svg'/>
                <span>Admin Home</span>
              </Link>
            </li>
            {/* <li className="navItem" id="">
              <Drawer />
            </li> */}
          </ul>
          <div className="sidebarLogo">
            <img role="presentation" src="/images/MenuBar_check3.png" />
          </div>
        </section>
      </aside>
    )
  }
}

const GetUserTasks = gql`
  query {
    getUserTasks {
      id
      status
      endField
      endValue
      fields
      path
      assignedAt
      dueAt
      completedAt
    }
  }
`;

const SideNavWithGraphQL = compose(
  graphql(GetUserTasks, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(SideNav)

export default SideNavWithGraphQL;
