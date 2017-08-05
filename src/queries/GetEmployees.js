import gql from 'graphql-tag';

const GetEmployeesQuery = gql`
  query pms{
    getPeople(group:"Employee" type:"Person"){
      id
      firstName
      lastName
    }
  }
`;

export default GetEmployeesQuery;