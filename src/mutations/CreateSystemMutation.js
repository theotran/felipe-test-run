import gql from 'graphql-tag';

const CreateSystemMutation = gql`
  mutation createSystem ($id: ID, $ac: Float, $dc: Float, $JobId: ID) {
    createSystem (input: { id: $id, ac: $ac, dc: $dc, JobId: $JobId }) {
      id
      ac
      dc
      JobId
    }
  }
`;

export default CreateSystemMutation;