import gql from 'graphql-tag';


const GetCombinersQuery = gql`
  query getCombiners{
    getCombiners{
      id
      manufacturer
      model
      maxVoltage
      numberInputs
      minInputWire
      maxInputWire
      maxInputFuseAmp
      dcDisconnect
      outputTerminals
      maxOutput
      length
      width
      height
      weight
      enclosureRate
    }
}
`
export default GetCombinersQuery;