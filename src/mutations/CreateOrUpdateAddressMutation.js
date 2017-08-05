import gql from 'graphql-tag';

const CreateOrUpdateAddressMutation = gql`
  mutation createOrUpdateJobAddress($jobId: ID!, $addressId: ID, $type: String!, $level: String!, $line1: String!, $zip: String!) {
    createOrUpdateJobAddress (jobId: $jobId, addressId: $addressId, input: {type: $type, level: $level, line1: $line1, zip: $zip} ) {
      id
      __typename
      type
      level
      line1
      zip
    }
  }
`;

export default CreateOrUpdateAddressMutation;