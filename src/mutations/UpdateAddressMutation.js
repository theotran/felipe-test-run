import gql from 'graphql-tag';

const UpdateAddressMutation = gql`
  mutation updateAddress ($id: ID!, $belongsTo: String!, $belongsToId: ID!, $type: String!, $level: String!, $line1: String!, $line2: String, $city: String, $state: String, $zip: String!) {
    updateAddress (id: $id, belongsTo: $belongsTo, belongsToId: $belongsToId, input: { type: $type, level: $level, line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip }) {
      id
      type
      level
      line1
      line2
      city
      state
      zip
    }
  }
`;

export default UpdateAddressMutation;