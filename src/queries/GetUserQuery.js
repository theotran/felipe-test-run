
import gql from 'graphql-tag';

const GetUserQuery = gql`
  query user($id: ID!){
    user (id: $id) {
      id
      username
      groups {
        id
        name
        type
        permissions {
          id
          auth
        }
      }
    }
  }
`;

export default GetUserQuery;