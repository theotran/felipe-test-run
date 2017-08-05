export default gql`
  mutation updatePreview($id: ID, $PreviewerId: ID, $dateTime: DateTime, $weather: String, $temperature: Float) {
    updatePreview(input: {id: $id, PreviewerId: $PreviewerId, dateTime: $dateTime, weather: $weather, temperature: $temperature}) {
  		id
      previewer {
        id
        firstName
        lastName
      }
      dateTime
      weather
      temperature
    }
  }
`;