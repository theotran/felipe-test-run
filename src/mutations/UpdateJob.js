import gql from 'graphql-tag';

const UpdateJobMutation = gql`
  mutation updateJob($id: ID!, $name: String!, $number: String!, $type: String!, $status: String!) {
    updateJob (id: $id, input: {name: $name, number: $number, type: $type, status: $status}) {
      id
      name
      number
      type
      status
    }
  }
`;

export default UpdateJobMutation;