import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { browserHistory } from 'react-router';

import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

import GetUserQuery from './../../../queries/GetUserQuery';

class PermissionsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
    }
  }

  render() {
    console.log('PERMISSIONS TAB PROPS', this.props)

    if(this.props.data.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>);
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">Details</div>
        <div className="panel-body">
        {React.cloneElement(this.props.children, { user: this.props.data.user })}
        </div>
      </div>
    )
  }
}

const PermissionsTabWithQuery = graphql(GetUserQuery, {
  options: (ownProps) => ({
    variables: {
      id: ownProps.params.id,//getting the user id from this.props.params.id
    },
    fetchPolicy: 'cache-and-network'
  })
})(PermissionsTab);

export default PermissionsTabWithQuery;
