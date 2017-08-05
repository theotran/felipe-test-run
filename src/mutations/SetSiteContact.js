import gql from 'graphql-tag';

const SetSiteContactMutation = gql`
  mutation setSiteContact($siteId: ID!, $personId: ID!) {
    setSiteContact(siteId: $siteId, personId: $personId) {
      id
      type
      number
      sunHours
      contact {
        id
        firstName
        lastName
      }
    }
  }
`;

export default SetSiteContactMutation;