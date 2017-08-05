import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import GetPersonQuery from '../../queries/GetPersonQuery';

class UserPanelPage extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        Hello from User Panel
      </div>
    )
  }
}


const UserPanelPageWithData = compose(
  graphql(GetPersonQuery, {
      options: (ownProps) => ({
        variables: {
          id: ownProps.params.id,//getting the job id from this.props.params.id
        },
        fetchPolicy: 'cache-and-network'
      })
  })
)(UserPanelPage)

export default UserPanelPageWithData;
