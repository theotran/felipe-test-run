//get all people
query {
  getPeople {
    firstName
    lastName
  }
}


//create a person
mutation {
  createPerson (input: {firstName: "", lastName: ""}) {
    id
    firstName
    lastName
  }
}


mutation {
  createPerson(input: PersonInput): Person
}

mutation {
  updatePerson(id: ID! input: PersonInput): Person

}

mutation {
  deletePerson(id: ID!): Response
}


//get all jobs from first company in the list (Enersol)
{
  company {
    jobs {
      id
      name
      type
      status
    }
  }
}


//create a new job
mutation {
  createJob (input: {name: "NewJobTest", number: "25", type: "Residential", status: "In-Progress"}) {
    id
    name
    number
    type
    status
  }
}

//update a job
mutation {//type and job must be included
  updateJob (id: "94e89dc6-87fe-4df7-a257-6caf70d897e8", input: {name: "NewerJobTestUpdated", type: "Com", status: "Completed"}) {
    name
    number
    type
    status
  }
}


//setting a job PM
mutation {
  setJobPM (job: "7a384d3c-32bf-49df-98bf-0d3fbb347bf2", pm: "1df984be-a099-4af2-b64a-758339ab83ce") {
    pm {
      id
    }
  }
}


//creating a contract for a job
mutation {
  createContract(input: { JobId: "28b43d7c-d73b-4328-8831-d3fa3c624417", amount: 1000, taxId: "RandomTaxID", billingType: "Hourly" }) {
    id
    amount
    taxId
    billingType
    startDate
  }
}

//updating a contract for a job
mutation {
  updateContract(id: "883bf17f-c845-4998-a513-f8ecc84d555e", input: { JobId:"853d9234-fcf7-489f-9f88-407abd0a94e0", amount: 2400, taxId: "AnotherID", billingType: "SetAmount"}) {
    id
    amount
    taxId
    billingType
    startDate
  }
}

//quering a specific job with the contract info
{
  job (id: "da904d55-e397-4852-b1a8-5e2b76a7a84e") {
    name
    pm {
      id
    }
    contracts {
      id
      amount
      taxId
      billingType
      startDate
      terms {
        id
        amount
        status
        dueUpon
      }
    }
  }
}

//creating a term for a contract passing in a contract id
mutation {
  createContractTerm (input: { description: "Some term", type: "Some Type", amount: 7500, status: "Some Status", ContractId: "e987d7f5-ba5d-4c16-a3c6-7c71b56d4e57" }) {
    id
    amount
    status
    dueUpon
  }
}

// create a new design
mutation {
  createDesign (input:{type: "asdfasdf", status: "asdfasdfafsd", startDate:"2016-11-19T12:00:00.000Z", customerApproved: true, customerApproveDate: "2016-11-19T12:00:00.000Z"}) {
    type
    status
    startDate
    customerApproved
    customerApproveDate
  }
}
// update design info
mutation {
  updateDesign(input: { id: "e03789d6-43d1-437e-bfcf-f0fba435a121", JobId: "4fae05e5-dcfc-46ad-bb66-b8da933a54e3", type: "civil", status: "in process", startDate: "2016-11-19T12:00:00.000Z", customerApproved: true, customerApproveDate: "2016-11-19T12:00:00.000Z", InHouseApprovedById: "e06cf4e1-572d-4e66-b2f9-003d1c6eab88", inHouseApproveDate: "2016-11-19T12:00:00.000Z", asBuiltCompleteDate: "2016-11-19T12:00:00.000Z"}) {
    id
    type
    designer {
      id
      firstName
      lastName
    }
    status
    startDate
    customerApproved
    customerApproveDate
    inHouseApprovedBy {
      id
    }
    inHouseApproveDate
    asBuiltCompleteDate
    notes {
      id
      text
      type
    }

//Create Permitting for a design
mutation {
  createPermitting (input: { inHouse: true, applicationNumber: "1313423jd", DesignId: "70c96048-2cd0-4d70-8f71-9b2c955ba343" }) {
    id
    inHouse
    applicationNumber
  }
}


mutation {
  updatePermitting (input: { id: "dc55a66d-c355-4137-a18f-a2f2728422ee", inHouse: true, applicationNumber: "1313423jd", DesignId: "bd688ca0-3fac-4253-9255-bf76be306897" }) {
    id
    inHouse
    applicationNumber
  }
}

//Creating a site for a job
mutation {
 addJobSite( input: { type: "JOBSITE", number: 762, sunHours: 556, JobId: "d6dd6b09-0a8c-4c33-942c-10867e8549db"  }) {
   id
   type
   number
   sunHours
 }
}

//Update the site for a job
mutation {
  updateSite( input: { id: "5417d0eb-2a9f-4d7d-8b2f-8353cd3d3751", type: "JOBSITE", number: 762, sunHours: 556, ContactId: ID }) {
    id
    type
    number
    sunHours
  }
}


//Create a section for Permitting
mutation {
  createSection(input: { name: "NewName", status: "Some NEW Status", startDate: "2017-05-18T10:00:00.000Z", endDate: "2017-05-18T10:00:00.000Z", dueDate: "2017-05-18T10:00:00.000Z", approvalDate: "2017-05-18T10:00:00.000Z", ContactId: "3f7bf2ff-bc71-4e60-ae64-01cbd8ab4a58",  belongsTo: "Permitting", belongsToId: "aadb5d5a-3a14-4129-9557-c35033f1b91f" }) {
    id
    name
    status
    startDate
    endDate
    dueDate
    approvalDate
  }
}

//Updating a section for Permitting
mutation {
  updateSection(input: { id: "85a7a894-b9a4-4192-8088-bdac0b5edefa",  name: "NewName", status: "Some NEW Status", startDate: "2017-05-18T10:00:00.000Z", endDate: "2017-05-18T10:00:00.000Z", dueDate: "2017-05-18T10:00:00.000Z", approvalDate: "2017-05-18T10:00:00.000Z", ContactId: "3f7bf2ff-bc71-4e60-ae64-01cbd8ab4a58",  belongsTo: "Permitting", belongsToId: "aadb5d5a-3a14-4129-9557-c35033f1b91f" }) {
    id
    name
    status
    startDate
    endDate
    dueDate
    approvalDate
  }
}

//Create a review
mutation {
  createReview(input: { type:"Review of Section", startDate: "2017-05-25T20:57:19.953Z", endDate: "2017-05-25T20:57:19.953Z", status: "Approved", isTPR: true, belongsTo: "Section", belongsToId: "0008a30a-88ef-46bd-8248-a87db28d0437"}) {
    id
    type
    startDate
    endDate
    status
    isTPR
  }
}

mutation {
  updateReview(input: { id: "", type:"Review of Section", startDate: "2017-05-25T20:57:19.953Z", endDate: "2017-05-25T20:57:19.953Z", status: "Approved", isTPR: true, belongsTo: "Section", belongsToId: "0008a30a-88ef-46bd-8248-a87db28d0437"}) {
    id
    type
    startDate
    endDate
    status
    isTPR
  }
}


//Create Comment
mutation {
  createComment(input: { refNumber: "SomeRefNumber", title: "Comment on Review", description: "This is awesome", CommenterId: "4f3bf261-e7a9-4eb8-a856-a58bd51fca8e", date: "2017-05-17T10:00:00.000Z", revisionDate: "2017-05-17T10:00:00.000Z", belongsTo: "Review", belongsToId: "0752236a-9f54-4d31-9542-dc693e4ebc09"}) {
    id
    refNumber
    title
    description
    commenter {
      id
      firstName
      lastName
    }
    date
    revisionDate
  }
}

//Create Meter
mutation {
  createMeter(input: { totalKWH13mo: 1234, totalCost13mo: 4321, days13mo: 43432, number: "SomeMeterNumber", accountNumber: "SomeAccountNumber", amps: 125, existingDrop: "Overhead Transformer", type: "120/208", style: "Analog", tieIn: "SomeMeterTieIn", transformerKVA: 50, JobId: "ec8df444-b60a-48da-a045-736b9c5231c9" }) {
    id
    totalKWH13mo
    totalCost13mo
    days13mo
	  number
    accountNumber
    amps
    existingDrop
    type
    style
    tieIn
    transformerKVA
  }
}

//Create Daily log
mutation {
  createDailyLog(input: { type: "Construction Daily Log", date: "2017-05-10T10:00:00.000Z", minTemp: 80, maxTemp: 87, weather: "cloudy", safetyHeldTime: "2017-05-10T10:00:00.000Z", safetyLocation: "Honolulu", ConstructionId: "2ab5b8b6-49cb-4a11-8b48-be2608e8b039" }) {
    id
    type
    date
    minTemp
    maxTemp
    weather
    safetyHeldTime
    safetyLocation
  }
}

//Update Daily log
mutation {
  updateDailyLog(input: { id:"b9089c0f-dc69-49aa-b083-7c5abae31c14" , type: "Construction Daily Log Updated", date: "2017-05-10T10:00:00.000Z", minTemp: 70, maxTemp: 77, weather: "cloudy", safetyHeldTime: "2017-05-10T10:00:00.000Z", safetyLocation: "Honolulu", ConstructionId: "2ab5b8b6-49cb-4a11-8b48-be2608e8b039" }) {
    id
    type
    date
    minTemp
    maxTemp
    weather
    safetyHeldTime
    safetyLocation
  }
}

//Create subLogs
mutation {
  createSubLog(input: { workerCount: 10, startTime: "2017-05-10T10:00:00.000Z", breakStartTime: "2017-05-10T10:00:00.000Z", breakEndTime: "2017-05-10T10:00:00.000Z", endTime: "2017-05-10T10:00:00.000Z", workPerformed: "Developed Software", DailyLogId:"b9089c0f-dc69-49aa-b083-7c5abae31c14" }) {
    id
    workerCount
    startTime
    breakStartTime
    breakEndTime
    endTime
    workPerformed
  }
}

//Create incident
mutation {
  createIncident(input: { type: "SubLog Incident", description: "Theo laughed at everyone.", location: "Dev corner", date:"2017-06-03T01:19:56.595Z", explanation: "He saw Nick make Bryce cry, and Jon break his computer.", SubLogId:"99a48be7-450b-400f-b6ee-f28e088e450f" }) {
    id
    type
    description
    location
    date
    explanation
  }
}

// Create previewmutation {
mutation {
	createPreview(input: { JobId:"b4eb6957-3ff9-4129-95c3-04535b34c700", dateTime: "2017-06-09T10:00:00.000Z", weather: "cloudy", PreviewerId: "ba160587-6fca-4fa4-bbe7-531cd742b824" temperature: 25 }) {
    id
    previewer {
      id
      firstName
      lastName
    }
    dateTime
    weather
    temperature
    stagings {
      id
    }
  }
}

// Update Preview
mutation {
  updatePreview(input: {id:"fb8a78c7-a959-451b-b9fb-6b8c2d04f0ae", dateTime: "2017-06-13T00:15:52.000Z", weather: "sunny", temperature: 89}) {
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

// Create Cost
mutation {
  createCost(input: {JobId: "0821cff4-63aa-4b03-8608-aed75be2ef9a", type: "Other Thing", description: "change order test", amount: 200}) {
    id
		description
    type
    amount
  }
}

// Update Cost
mutation {
  updateCost(input: {id: "35a0938e-3ff1-4501-865a-9b5977be322f", type: "Change Order", description: "edited change order", amount: 199.99}) {
    id
		description
    type
    amount
  }
}

//Create Time Log
mutation {
  createLog(input: { category: "Design Work Time Log", role: "Designer", description: "Did some Design work stuffs", rate: "35.00 / hourly", start:"2017-06-06T19:00:13.575Z", end:"2017-06-07T06:00:37.570Z" PersonId:"4527c1de-d647-47b0-bdce-88e410f7f113", JobId:"695b17e3-8858-4805-a48f-925389990013" }) {
    id
    category
  	description
    rate
    start
    end
    person {
      id
      firstName
      lastName
    }
    job {
      id
    }
  }
}

mutation {
  createQuote(input: { JobId: "723a10bc-645b-4efd-8d1f-753f7e64610c", name: "testquote"}) {
    id
    name
  }
}

//Creating a company
mutation {
  createCompany(input: {name: "Trance"}) {
    id
    name
  }
}
//Creating a group
mutation {
	createGroup(input: { type: "User" name: "TranceFamily" CompanyId: "44ea1071-6b94-4f3a-8fcd-f9ee4ea489a2"}) {
    id
    type
    name
  }
}

mutation {
	createPlane(input: { JobId: "55b13a67-f7ca-4775-8dc3-15bbc648b5fd", type: "roof1", watts: 100, racking: "something", isBallast: true, age: 15, needsReRoof: true, compass: 42, pitch: 42, northLength: 42, southLength: 42, eastLength: 42, westLength: 42, height: 42, interior: "padding", deck: "wood", coating: "something" }) {
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
    }
    generalNotes {
      id
    }
    createdAt
    updatedAt
  }
}
