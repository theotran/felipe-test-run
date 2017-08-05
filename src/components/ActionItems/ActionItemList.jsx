import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router';

import { Message } from 'semantic-ui-react';

class ActionItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    console.log(this.props)
    if(this.props.data.loading) {
      return <div>Loading</div>;
    }

    if(this.props.data.error) {
      return <div>Error</div>;
    }
    return (
      <div className="row">

      <div className="col-md-12 pageHeader">
          <h4 className="pageHeaderText">YOUR TASKS</h4>
          <img className="customIconsSidebar" role="presentation" src='/images/TaskList_Icon.svg' height="35" width="50"/>
      </div>

        <div className="col-md-12">
          {this.props.data.getUserTasks.map((task, index) => {
            return (
              <div key={index}>
                <Message>
                  <Message.Header>Job Name : {task.job.name}</Message.Header>
                    <p>{"Task: " + task.belongsTo.__typename}</p>
                    <Link to={task.path}>
                      <p className="taskLink">See details</p>
                    </Link>
                </Message>
              </div>
            )
          })}
        </div>
      </div>
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
      belongsTo {
        ...on Design {
          id
        }
        ...on Preview {
          id
        }
        ...on Site {
          id
        }
        ...on Permitting {
          id
        }
        ...on Engineering {
          id
        }
      }
      job {
        id
        name
      }
    }
  }
`;

const ActionItemListWithData = compose(
  graphql(GetUserTasks, {
    options: {
      fetchPolicy: 'cache-and-network'
    }
  })
)(ActionItemList)

export default ActionItemListWithData;
