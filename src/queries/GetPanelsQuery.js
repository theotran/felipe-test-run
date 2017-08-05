import gql from 'graphql-tag';

const GetPanelsQuery = gql`
  query getPanels{
    getPanels{
      id
    manufacturer
    model
    stcWatts
    ptcWatts
    vMax
    impp
    voc
    isc
    efficiency
    length
    width
    depth
    weight
    cellCount
    vmpTempCoe
    vocTempCoe
    maxFuse
    maxVoltage
    }
}
`;

export default GetPanelsQuery;