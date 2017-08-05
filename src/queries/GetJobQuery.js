import gql from 'graphql-tag';

const GetJobQuery = gql`
  query job($id: ID!){
    job (id: $id) {
      id
      name
      number
      type
      status
      company {
        id
        name
        teamName
      }
      pm {
        id
        firstName
        lastName
        phones {
          id
          number
        }
        emails {
          id
          address
        }
      }
      site{
        id
        type
        number
        sunHours
        contact {
          id
          firstName
          lastName
        }
        ownerOfRecord
        isNewBuild
        acreage
        zoningCode
        landUse
        mphWind
      }
    	quotes {
        id
        name
        number
        type
        createdAt
        itemSet {
          id
          percentMarkup
          items {
            id
            type
            description
            count
            unit
            costPer
          }
        }
      }
      address {
        id
        line1
        line2
        city
        state
        zip
        country
      }
      invoices {
        id
  			amount
        number
        date
        due
        description
        type
      }
      payments {
        id
        amount
        number
        method
        receivedDate
        receivedBy
        description
      }
      contract {
        id
        amount
        taxId
        billingType
        startDate
        endDate
        terms {
          id
          dueUpon
          amount
          status
        }
        customer{
          id
          firstName
          lastName
        }
      }
      construction {
        id
        targetMechStartDate
        targetMechEndDate
        targetElectricStartDate
        targetElectricEndDate
        startDate
        completedDate
        dailyLogs {
          id
          type
          date
          minTemp
          maxTemp
          weather
          safetyHeldTime
          safetyLocation
          subLogs {
            id
            workerCount
            startTime
            breakStartTime
            breakEndTime
            endTime
            workPerformed
            incidents {
              id
              type
              description
              location
              date
              explanation
              people {
                id
                firstName
                lastName
              }
            }
          }
        }
      }
  		costs {
        id
        type
        description
        amount
        isPaid
        billTo
        createdAt
      }
      system {
        id
        ac
        dc
        build
        singleLines{
          id
          data
          link
          svg
        }
      }
      meters {
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
        notes {
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
      designs {
        id
        type
        status
        designer {
          id
          firstName
          lastName
        }
        startDate
        ifcBuildCompleteDate
        asBuiltCompleteDate
        notes {
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
        engineering {
          id
          type
          isTPR
          engineer {
            id
            firstName
            lastName
          }
          sentDate
          dueDate
          receivedDate
          completedDate
          status
          comments {
            id
            date
            title
            description
            refNumber
            revisionDate
            commenter {
              id
              firstName
              lastName
            }
          }
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
              ...on Engineering {
                id
              }
            }
            job {
              id
              name
            }
          }
        }
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
            ...on Design {
              id
            }
          }
          job {
            id
            name
          }
        }
        permitting {
          id
          inHouse
          assignedTo {
            id
          }
          applicationNumber
          approvalNumber
          startDate
          sections {
            id
            name
            status
            startDate
            endDate
            dueDate
            approvalDate
            contact {
              id
            }
            reviews {
              id
              type
              createdAt
              startDate
              endDate
              status
              isTPR
              reviewer {
                id
                firstName
                lastName
              }
              comments {
                id
                date
                title
                description
                refNumber
                revisionDate
                commenter {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
        reviews {
          id
          type
          createdAt
          startDate
          endDate
          status
          isTPR
          reviewer {
            id
            firstName
            lastName
          }
          comments {
            id
            date
            title
            description
            refNumber
            revisionDate
            commenter {
              id
              firstName
              lastName
            }
          }
        }
        interconnection {
          id
          reviewStartDate
          number
          inHouse
          conditionalDate
          executedDate
          manager {
            id
            firstName
            lastName
          }
          program {
            id
            name
          }
          utility {
            id
            name
          }
          sections {
            id
            name
						startDate
            endDate
            dueDate
            approvalDate
            status
            contact {
              id
              firstName
              lastName
            }
            reviews {
              id
              type
              createdAt
              startDate
              endDate
              status
              isTPR
              reviewer {
                id
                firstName
                lastName
              }
              comments {
                id
                date
                title
                description
                refNumber
                revisionDate
                commenter {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default GetJobQuery;
