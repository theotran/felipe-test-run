import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { browserHistory } from 'react-router';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import GetPersonQuery from './../../queries/GetPersonQuery';


class PersonPage extends Component {

  static propTypes = {
    color: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeItem: ''
    }
  }

  render() {
    const { activeItem } = this.state;

    let employeeTab;
    let employeeNotes;
    let userAcctTab;
    if(this.props.data.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>);
    }

    if(this.props.route.path === "employees/:id"){
      employeeTab =
          <Menu.Item name='Employee Info' active={activeItem === 'EmployeeInfo'} onClick={(e, data) => {
            this.setState({ activeItem: 'EmployeeInfo'})
            browserHistory.push(`/employees/${this.props.params.id}/info`)
          }}>
            <img className="projectTabIcon" role="presentation" src='/images/EmployeeSingle_Icon_white.svg'/>
            Employee Info
          </Menu.Item>


      employeeNotes =
          <Menu.Item name='Employee Notes' active={activeItem === 'EmployeeNotes'} onClick={(e, data) => {
            this.setState({ activeItem: 'EmployeeNotes'})
            browserHistory.push(`/employees/${this.props.params.id}/notes`)
          }}>
            <img className="projectTabIcon" role="presentation" src='/images/EmployeeSingle_Icon_white.svg'/>
            Employee Notes
          </Menu.Item>
    }
    if(this.props.jwt.roles.indexOf('SuperAdmin') !== -1 && this.props.route.path === "employees/:id"){
      userAcctTab =
        <Menu.Item name='User Account' active={activeItem === 'UserAcct'} onClick={(e, data) => {
          this.setState({ activeItem: 'UserAcct'})
          browserHistory.push(`/employees/${this.props.params.id}/account`)
        }}>
          <img className="projectTabIcon" role="presentation" src='/images/Permissions_Icon_white.svg'/>
          User Account
        </Menu.Item>
    } else if(this.props.jwt.roles.indexOf('SuperAdmin') !== -1 && this.props.route.path === "customers/:id"){
      userAcctTab =
        <Menu.Item name='User Account' active={activeItem === 'UserAcct'} onClick={(e, data) => {
          this.setState({ activeItem: 'UserAcct'})
          browserHistory.push(`/customers/${this.props.params.id}/account`)
        }}>
          <img className="projectTabIcon" role="presentation" src='/images/Permissions_Icon_white.svg'/>
          User Account
        </Menu.Item>
    }
    console.log(this.props);
    return (
      <div>
        {/* <ul className="nav nav-pills comm-jobs-nav nav-justified" role="tablist">
          <li role="presentation" className="">
            <Link to={`/people/${this.props.params.id}/one`} activeStyle={{ color: '#ffffff', background: '#4F6474' }}>
              One
            </Link>
          </li>
          <li role="presentation">
            <Link to={`/people/${this.props.params.id}/two`} activeStyle={{ color: '#ffffff', background: '#4F6474' }}>
              Two
            </Link>
          </li>
        </ul> */}
        <Menu inverted color={'teal'} fluid widths={4} icon='labeled' size='mini'>
          <Menu.Item name='Person Info' active={activeItem === 'PersonInfo'} onClick={(e, data) => {
            this.setState({ activeItem: 'PersonInfo'})
            if(this.props.route.path === "employees/:id"){
              browserHistory.push(`/employees/${this.props.params.id}/contact`)
            } else if(this.props.route.path === "customers/:id"){
              browserHistory.push(`/customers/${this.props.params.id}/contact`)
            }
          }}>
            <img className="projectTabIcon" role="presentation" src='/images/Contact_Icon_White.svg'/>
            Contact Info
          </Menu.Item>
          {employeeTab}
          {employeeNotes}
          {userAcctTab}
        </Menu>
        {React.cloneElement(this.props.children, { person: this.props.data.person })}
      </div>
    )
  }

  goBack = () => {
    this.props.router.replace('/');
  }

}

const PersonPageWithQuery = graphql(GetPersonQuery, {
  options: (ownProps) => ({
    variables: {
      id: ownProps.params.id,//getting the person id from this.props.params.id
    },
    fetchPolicy: 'cache-and-network'
  })
})(PersonPage);

export default PersonPageWithQuery;
