
import gql from 'graphql-tag';

const GetPersonQuery = gql`
  query person($id: ID!){
    person (id: $id) {
      id
      firstName
      lastName
      addresses {
        id
        line1
        line2
        city
        state
        zip
      }
      user{
        id
        username
        active
      }
      phones {
        id
        type
        level
        number
      }
      emails {
        id
        type
        level
        address
      }
      logs {
        id
        category
        role
      	description
        rate
        start
        end
      }
      employeeInfo {
        id
        title
        dob
        ssn
        employeeNumber
        payType
        pay
        vacation
        sick
        startDate
        endDate
        employeeStatus
      }
      groups {
        id
        type
        name
        permissions{
          type
          auth
        }
      }
      user{
        id
        groups{
          id
          type
          name
        }
      }
      notes {
        id
        text
        createdBy {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export default GetPersonQuery;
