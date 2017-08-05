import gql from 'graphql-tag';

const GetCustomersQuery = gql`
  query customers{
    getPeople(group:"Customer" type:"Person"){
      id
      firstName
      lastName
    }
  }
`;

export default GetCustomersQuery;