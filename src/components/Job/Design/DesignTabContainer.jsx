import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import GetJobQuery from '../../../queries/GetJobQuery';
import DesignTab from './DesignTab';

class DesignTabContainer extends Component {
  constructor(props) {
    super(props);

    if(this.props.job) {
      this.state = {
        designs: this.props.job.designs ? this.props.job.designs : [],
        selectedItem: {}
      }
    }
  }

  addDesign = (designInfo) => {
    let newData = update(this.state, {
      designs: {$push: [designInfo]}
    });

    this.props.CreateDesign({
      variables: designInfo,
      update: (proxy, result) => {
        console.log('PROXY', proxy);

        console.log('RESULT', result);

        // Read the data from our cache for this query.
        const data = proxy.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          }
        });
        console.log('data', data);
        console.log('create design result', result);

        data.job.designs.push(result.data.createDesign);

        console.log('data after adding design', data);

        // Write our combined data back to the store cache
        proxy.writeQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          },
          data
        });
      }
    })
      .then((value) => {
        this.setState(newData);
        return value;
      })
  }

  render() {
    return (
      <div>
        <DesignTab job={this.props.job} designs={this.state.designs} addDesign={this.addDesign}/>
      </div>
    )
  }
}

const createDesignMutation = gql`
  mutation createDesign($type: String!, $JobId: ID!) {
    createDesign(input: {type: $type, JobId: $JobId}) {
        id
        type
        status
        designer {
          id
          firstName
          lastName
        }
        startDate
        ifcBuildCompleteDate
        asBuiltCompleteDate
        notes {
          id
          text
          type
          createdBy {
            id
            firstName
            lastName
          }
          createdAt
        }
        engineering {
          id
          type
          isTPR
          engineer {
            id
            firstName
            lastName
          }
          sentDate
          dueDate
          receivedDate
          completedDate
          status
          comments {
            id
            date
            title
            description
            refNumber
            revisionDate
            commenter {
              id
              firstName
              lastName
            }
          }
          tasks {
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
        tasks {
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
          }
          job {
            id
            name
          }
        }
        permitting {
          id
          inHouse
          assignedTo {
            id
          }
          applicationNumber
          approvalNumber
          startDate
          sections {
            id
            name
            status
            startDate
            endDate
            dueDate
            approvalDate
            contact {
              id
            }
            reviews {
              id
              type
              createdAt
              startDate
              endDate
              status
              isTPR
              reviewer {
                id
                firstName
                lastName
              }
              comments {
                id
                date
                title
                description
                refNumber
                revisionDate
                commenter {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
        reviews {
          id
          type
          createdAt
          startDate
          endDate
          status
          isTPR
          reviewer {
            id
            firstName
            lastName
          }
          comments {
            id
            date
            title
            description
            refNumber
            revisionDate
            commenter {
              id
              firstName
              lastName
            }
          }
        }
        interconnection {
          id
          reviewStartDate
          number
          inHouse
          conditionalDate
          executedDate
          manager {
            id
            firstName
            lastName
          }
          program {
            id
            name
          }
          utility {
            id
            name
          }
          sections {
            id
            name
						startDate
            endDate
            dueDate
            approvalDate
            status
            contact {
              id
              firstName
              lastName
            }
            reviews {
              id
              type
              createdAt
              startDate
              endDate
              status
              isTPR
              reviewer {
                id
                firstName
                lastName
              }
              comments {
                id
                date
                title
                description
                refNumber
                revisionDate
                commenter {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
    }
  }
`;

const DesignTabContainerWithdata = compose(
  // graphql(GetJobQuery, {
  //   options: (ownProps) => ({
  //     variables: {
  //       id: ownProps.params.id,//getting the job id from this.props.params.id
  //     },
  //     fetchPolicy: 'cache-and-network'
  //   })
  // }),
  graphql(createDesignMutation, { name: 'CreateDesign' })
)(DesignTabContainer);

export default DesignTabContainerWithdata;
