import gql from 'graphql-tag';


const GetInvertersQuery = gql`
  query getInverters{
    getInverters{
      id
      manufacturer{
        id
        name
      }
      model
      dcWattsIn
      dcVoltageIn
      maxCurrentIn
      mpptsIn
      mmptInMinVoltage1
      mmptInMaxVoltage1
      mmptInMaxCurrent1
      mmptInPer1
      mmptInMinVoltage2
      mmptInMaxVoltage2
      mmptInMaxCurrent2
      mmptInPer2
      acWattsMaxOut
      acPowerMaxOut
      acNominalVoltage
      acMinVoltage
      acMaxVoltage
      acGridFrequency
      acMinGridFrequency
      acMaxGridFrequency
      acMaxOutputCurrent
      acPowerFactor
      decibels
      harmonics
      efficiency
      efficiencyWeighted
      breakerPoles
      width
      height
      depth
      weight
      breakerPoles
      minOperatingTemp
      maxOperatingTemp
      hasTransformer
      nema
      canOptimize
      isMicro
      minMicroPanel
      maxMicroPanel
      micro60Cell
      micro72Cell
      micro96Cell
    }
}
`
export default GetInvertersQuery;