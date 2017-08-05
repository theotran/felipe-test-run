import gql from 'graphql-tag';

const GetJobQuery = gql`
  query job($id: ID!){
    job (id: $id) {
      id
      previews {
        id
        previewer {
          id
          firstName
          lastName
        }
        dateTime
        weather
        temperature
        tasks {
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
      stagings {
				id
        description
      }
      planes {
        id
        watts
  	    type
  	    racking
  	    isBallast
  	    age
  	    needsReRoof
  	    compass
  	    pitch
  	    northLength
  	    southLength
  	    eastLength
  	    westLength
  	    height
  	    interior
  	    deck
  	    coating
        safetyNotes {
          id
          text
          type
          createdBy {
            id
            firstName
            lastName
          }
          createdAt
        }
        generalNotes {
          id
          text
          type
          createdBy {
            id
            firstName
            lastName
          }
          createdAt
        }
      }
    }
  }
`;

export default GetJobQuery;
