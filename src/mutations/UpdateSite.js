import gql from 'graphql-tag';

const UpdateSiteMutation = gql`
  mutation updateSite( $id: ID, $type: String, $number: Float, $sunHours: Int, $ownerOfRecord: String, $isNewBuild: Boolean, $acreage: Float, $zoningCode: String, $landUse: String, $mphWind: Int) {
    updateSite( input: { id: $id, type: $type, number: $number, sunHours: $sunHours, ownerOfRecord: $ownerOfRecord, isNewBuild: $isNewBuild, acreage: $acreage, zoningCode: $zoningCode, landUse: $landUse, mphWind: $mphWind }) {
      id
      type
      number
      sunHours
      ownerOfRecord
      isNewBuild
      acreage
      zoningCode
      landUse
      mphWind
    }
  }
`;

export default UpdateSiteMutation;