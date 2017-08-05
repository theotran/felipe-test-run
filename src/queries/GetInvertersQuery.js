import gql from 'graphql-tag';


const GetInvertersQuery = gql`
  query getInverters{
    getInverters{
      id
      manufacturer
      model
      dcWattsIn
      dcVoltageIn
      maxCurrentIn
      mpptsIn
      mpptInMinVoltage1
      mpptInMaxVoltage1
      mpptInMaxCurrent1
      mpptInPer1
      mpptInMinVoltage2
      mpptInMaxVoltage2
      mpptInMaxCurrent2
      mpptInPer2
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