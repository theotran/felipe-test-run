import gql from 'graphql-tag';

const AddAddressMutation = gql`
  mutation addAddressTo ($belongsTo: String!, $belongsToId: ID!, $type: String!, $level: String!, $line1: String!, $line2: String, $zip: String!) {
    addAddressTo (belongsTo: $belongsTo, belongsToId: $belongsToId, input: { type: $type, level: $level, line1: $line1, line2: $line2, zip: $zip }) {
      id
      type
      level
      line1
      line2
      zip
    }
  }
`;

export default AddAddressMutation;