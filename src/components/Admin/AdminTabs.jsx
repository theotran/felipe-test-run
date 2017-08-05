import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';
import AccountTab from './Account/AccountTab';

import GetCompanyInfoQuery from './../../queries/GetCompanyInfoQuery';


class AdminTabs extends Component {
  static propTypes = {
    color: PropTypes.string,
  }

  constructor(props) {
    super(props);
    console.log('BEFORE RENDER', props);
    this.state = {
      activeItem: ''
    }
  }
  render() {
    if(this.props.data.loading){
      return <div>Loading</div>;
    }
    if(this.props.data.error){
      return <div>Error</div>;
    }
    console.log('AFTER RENDER',this.props);
    const { activeItem } = this.state;
    const formStyle = {
      width: '100%'
    }
    return (
        <div>
          <Menu inverted color={'teal'} fluid widths={2} icon='labeled' size='mini'>
            <Menu.Item name='Groups' active={activeItem === 'Groups'} onClick={(e, data) => {
              this.setState({ activeItem: 'Groups'})
              browserHistory.push(`/admin/groups`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Groups_Icon_white.svg'/>
              Groups
            </Menu.Item>

            {/* <Menu.Item name='Permissions' active={activeItem === 'Permissions'} onClick={(e, data) => {
              this.setState({ activeItem: 'Permissions'})
              browserHistory.push(`/admin/permissions`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Permissions_Icon_white.svg'/>
              Permissions
            </Menu.Item> */}

            <Menu.Item name='Account' active={activeItem === 'Account'} onClick={(e, data) => {
              this.setState({ activeItem: 'Account'})
              browserHistory.push(`/admin/account`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Account_Icon_white.svg'/>
              Account
            </Menu.Item>

            {/* <Menu.Item name='Billing' active={activeItem === 'Billing'} onClick={(e, data) => {
              this.setState({ activeItem: 'Billing'})
              browserHistory.push(`/admin/billing`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/Settings_Icon_white.svg'/>
              Settings
            </Menu.Item> */}

          </Menu>
          {React.cloneElement(this.props.children, { company: this.props.data.company })}
        </div>
    )
  }
}

const AdminTabsWithQuery = compose(
  graphql(GetCompanyInfoQuery, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.params.id,//getting the job id from this.props.params.id
      },
      fetchPolicy: 'cache-and-network'
    })
  })
)(AdminTabs);

export default AdminTabsWithQuery;
