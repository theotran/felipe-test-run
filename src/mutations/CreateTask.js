export default gql`
  mutation createTask($status: String, $endField: String, $endValue: String, $fields: String, $path: String, $assignedAt: DateTime, $dueAt: DateTime, $completedAt: DateTime, $belongsTo: String, $belongsToId: ID, $PersonId: ID, $JobId: ID){
    createTask(input: {status: $status, endField: $endField, endValue: $endValue, fields: $fields, path: $path, assignedAt: $assignedAt, dueAt: $dueAt, completedAt: $completedAt, belongsTo: $belongsTo, belongsToId: $belongsToId, PersonId: $PersonId, JobId: $JobId}) {
      id
      status
      endField
      endValue
      fields
      path
      assignedAt
      dueAt
      completedAt
      belongsTo {
        ...on Preview {
          id
        }
      }
      job {
        id
        name
      }
    }
  }
`;