
import gql from 'graphql-tag';

const GetCompanyInfo = gql`
  query company($id: ID){
    company(id: $id) {
      id
      name
      teamName
      account {
        teamUsers
      }
      groups {
        id
        type
        name
        members {
          ...on User {
            id
            username
            person {
              id
              firstName
              lastName

            }
          }
          ...on Person {
            id
            firstName
            lastName
          }
          ...on Company {
            id
            name
          }
        }
        permissions {
          id
          auth
        }
      }
    }
  }
`;

export default GetCompanyInfo;
