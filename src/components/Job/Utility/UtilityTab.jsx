import React, { Component } from 'react';
import LabelInput from './../../LabelInput';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import client from './../../../index.js';

import GetJobQuery from '../../../queries/GetJobQuery';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

import AddUtilitySectionModal from './AddUtilitySectionModal';
import UtilitySection from './UtilitySection';

import { Dropdown } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react'
import FlatButton from 'material-ui/FlatButton';

let stuff;

let cachedJobQuery;



const CreateInterconnectionMutation = gql`
  mutation createInterconnection( $DesignId: ID!, $reviewStartDate: DateTime, $number: String, $inHouse: Boolean, $conditionalDate: DateTime, $executedDate: DateTime, $ManagerId: ID, $ProgramId: ID, $UtilityId: ID) {
    createInterconnection(input: {DesignId: $DesignId, reviewStartDate: $reviewStartDate, number: $number, inHouse: $inHouse, conditionalDate: $conditionalDate, executedDate: $executedDate, ManagerId: $ManagerId, ProgramId: $ProgramId, UtilityId: $UtilityId}) {
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
`;

const UpdateInterconnectionMutation = gql`
  mutation updateInterconnection( $id: ID!, $reviewStartDate: DateTime, $number: String, $inHouse: Boolean, $conditionalDate: DateTime, $executedDate: DateTime, $ManagerId: ID, $ProgramId: ID, $UtilityId: ID) {
    updateInterconnection(input: {id: $id, reviewStartDate: $reviewStartDate, number: $number, inHouse: $inHouse, conditionalDate: $conditionalDate, executedDate: $executedDate, ManagerId: $ManagerId, ProgramId: $ProgramId, UtilityId: $UtilityId}) {
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
`;

const programs = [
  {
    id: "aa76c85f-e88c-4b9b-aadf-022a9f78f057",
    name: "NEM",
    link: "nem.com",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "c92bf701-543b-4705-ab7d-3ae4179abfd3",
    name: "FIT",
    link: "fit.com",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "2a2f4917-3b6f-4a20-9a0e-6da72a4a009b",
    name: "SIA",
    link: "sia.com",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "6a85fa1d-d0ea-4078-a6bb-f587d28d7aa9",
    name: "NUG",
    link: "nug.com",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "1043c619-a165-4072-9e1d-e29d8f5cc543",
    name: "Schedule Q",
    link: "scheduleq.com",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
]

const utilities = [
  {
    id: "55cd3050-7843-46e4-b101-7ee7394019cc",
    name: "Hawaiian Electric",
    // nickname: "HECO",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "9167d4a4-5083-4549-b0ff-33d40e7c1bf5",
    name: "Hawaiian Electric Light",
    // nickname: "HELCO",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "20271361-ce55-4926-97bf-b92e549eb64c",
    name: "Kauai Island Utility Cooperative",
    // nickname: "KIUC",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  },
  {
    id: "a91e38c6-e84a-41ef-8040-9a5a9b337e41",
    name: "Maui Electric",
    // nickname: "MECO",
    createdAt: "NOW()",
    updatedAt: "NOW()"
  }
]

class UtilityTab extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);

    if (this.props.job.designs.length === 0) {
      this.state = {
        design: this.props.job.designs ? this.props.job.designs[0] : null,
        designs: this.props.job.designs ? this.props.job.designs : [],
        designNumber: this.props.job.designs[0] ? 0 : null,
      }
    } else {
      this.state = {
        design: this.props.job.designs ? this.props.job.designs[0] : null,
        designs: this.props.job.designs ? this.props.job.designs : [],
        designNumber: this.props.job.designs[0] ? 0 : null,
        selected: this.props.job.designs ? this.props.job.designs[0].id : '',
        reviewStartDate: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.reviewStartDate : null,
        number: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.number : '',
        inHouse: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.inHouse : false,
        conditionalDate: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.conditionalDate : null,
        executedDate: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.executedDate : null,
        manager: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.manager : null,
        program: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.program : null,
        utility: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.utility : null,
        inspectionTime: this.props.job.designs[0].interconnection ? this.props.job.designs[0].interconnection.executedDate : null
      }
    }
  }

  toggleCheckbox(key) {
    const nextKeyState = !this.state[key];
    this.setState({ [key]: nextKeyState }, () => {
      this.handleBlur()
    });
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({inspectionTime: date}, () => {
    });
    // console.log(this.state.inspectionTime)
  }

  clearConditionalDate = () => {
    this.setState({
      conditionalDate: null
    })
    this.handleBlur()
  }

  clearReviewStartDate = () => {
    this.setState({
      reviewStartDate: null
    })
    this.handleBlur()
  }

  clearExecutedDate = () => {
    this.setState({
      executedDate: null
    })
    this.handleBlur()
  }

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    const cachedUtilityTab = cachedJobQuery.job.designs[this.state.designNumber].interconnection;

    if(!cachedUtilityTab) {
      client.mutate({
        mutation: CreateInterconnectionMutation,
        variables: {
          ManagerId: this.state.manager ? this.state.manager.id : null,
          DesignId: this.state.design.id,
          reviewStartDate: this.state.reviewStartDate,
          number: this.state.number,
          inHouse: this.state.inHouse,
          conditionalDate: this.state.conditionalDate,
          executedDate: this.state.executedDate,
          ProgramId: this.state.program ? this.state.program.id : null,
          UtilityId: this.state.utility ? this.state.utility.id : null,
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          console.log("proxy", proxy);
          console.log("result", result);
          console.log("data", data);

          data.job.designs[this.state.designNumber].interconnection = result.data.createInterconnection;

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
          //end client.mutate
          cachedJobQuery = client.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });
        }
      })
    }

    if(cachedUtilityTab && (cachedUtilityTab.manager !== this.state.manager || cachedUtilityTab.inHouse !== this.state.inHouse || cachedUtilityTab.number !== this.state.number || cachedUtilityTab.executedDate !== this.state.executedDate || cachedUtilityTab.reviewStartDate !== this.state.reviewStartDate || cachedUtilityTab.conditionalDate !== this.state.conditionalDate || cachedUtilityTab.program !== this.state.program || cachedUtilityTab.utility !== this.state.utility)) {
      // DO NOT TOUCH, SETSTATE WILL BREAK THIS
    // if (this.state.executedDate !== null) {
    //   console.log(moment(cachedUtilityTab.executedDate)._d)
    //   console.log(moment(this.state.inspectionTime)._d)
    //   // let savedExecuted = cachedUtilityTab.executedDate ? cachedUtilityTab.executedDate.toString().split('T')[1].split('.')[0] : ' ';
    //   let savedExecuted = cachedUtilityTab.executedDate ? (moment(cachedUtilityTab.executedDate)._d).toString().split(' ')[4] : ' ';
    //   console.log(savedExecuted)
    //   // let savedInspectionTime = this.state.inspectionTime ? this.state.inspectionTime.toString().split(' ')[4] : ' ';
    //   let savedInspectionTime = this.state.inspectionTime ? (moment(this.state.inspectionTime)._d).toString().split(' ')[4] : ' ';
    //   console.log(savedInspectionTime)
    //   if (savedExecuted !== null || savedInspectionTime !== null) {
    //     if (savedExecuted !== savedInspectionTime) {
    //       let updateTime = this.state.executedDate.toString().split(' ')
    //       updateTime.splice(4, 1, savedInspectionTime)
    //       this.state.executedDate = moment(updateTime.join(' '))
    //     }
    //   }
    // }

      client.mutate({
        mutation: UpdateInterconnectionMutation,
        variables: {
          id: cachedUtilityTab.id,
          ManagerId: this.state.manager ? this.state.manager.id : null,
          ProgramId: this.state.program ? this.state.program.id : null,
          UtilityId: this.state.utility ? this.state.utility.id : null,
          inHouse: this.state.inHouse,
          number: this.state.number,
          executedDate: this.state.executedDate,
          reviewStartDate: this.state.reviewStartDate,
          conditionalDate: this.state.conditionalDate,
        },
        optimisticResponse: {
          id: cachedUtilityTab.id,
          ManagerId: this.state.manager ? this.state.manager.id : null,
          ProgramId: this.state.program ? this.state.program.id : null,
          UtilityId: this.state.utility ? this.state.utility.id : null,
          inHouse: this.state.inHouse,
          number: this.state.number,
          executedDate: this.state.executedDate,
          reviewStartDate: this.state.reviewStartDate,
          conditionalDate: this.state.conditionalDate,
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          // console.log("proxy", proxy);
          // console.log("result", result);
          // console.log("data", data);

          if('updateInterconnection' in result.data) {
            data.job.designs[this.state.designNumber].interconnection = result.data.updateInterconnection;
          } else {
            data.job.designs[this.state.designNumber].interconnection = result.data;
          }

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
      console.log(cachedJobQuery)
    }
  }

  render() {
    console.log(this.props);
    let peopleDropdown;
    let utilitiesDropdown;
    if(this.props.getPeople.loading ||  this.props.getUtilities.loading) {
      return(
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
      )
    } else {
      peopleDropdown = (()=>{
        return (
            <div className="form-group col-md-6">
              <label htmlFor="">Utility Manager</label>
              <Dropdown
                placeholder='Utility Manager'
                fluid selection options={this.props.getPeople.getPeople.map((manager, index) => {
                  return {
                    key: index,
                    text: manager.firstName + " " + manager.lastName,
                    value: manager.id
                  }
                })}
                value={this.state.manager ? this.state.manager.id : null}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data.value)
                  this.setState({ manager: {id: data.value}  }, this.handleBlur)
                }}
              />
            </div>
        )
      })();
      utilitiesDropdown = (() => {
        let utilityList;
        if(this.props.getUtilities.getUtilities.length === 0){
          console.log("empty array");
          utilityList = [{name: "Please set site Zip Code", id: ''}];
        } else {
          console.log("not empty array");
          utilityList = this.props.getUtilities.getUtilities;
        }
        console.log(utilityList);
        return(
          <div className="form-group col-md-6">
            <label htmlFor="">Utility Company</label>
            <Dropdown
              placeholder='Utility Company'
              fluid selection options={utilityList.map((utility, index) => {
                return {
                  key: index,
                  text: utility.name,
                  value: utility.id
                }
              })}
              value={this.state.utility ? this.state.utility.id : ''}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data.value)
                if(data.value){
                  this.setState({ utility: {id: data.value} }, this.handleBlur)
                }
              }}
            />
          </div>
        )
      })();
    }

    if(this.props.getPeople.error || this.props.getUtilities.error) {
      return (
        <div>Error</div>
      )
    }

    const designs = this.state.designs.map((design, index) => {
      return (<MenuItem value={design.id} key={index} primaryText={design.type}  />);
    });

    let utilityInfo;
    if (this.state.designs.length === 0) {
      utilityInfo =
      <div className='row'>
        <br />There are no designs!
      </div>
    } else {
      utilityInfo =
        <div>
            <div className='row'>
              <div className='form-group col-md-6'>
                <Dropdown
                  placeholder='Quotes'
                  fluid selection options={this.state.designs.map((design, index) => {
                    return {
                      key: index,
                      text: design.type,
                      value: design.id
                    }
                  })}
                  value={this.state.selected}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", this.state)
                    for (let i=0; i < this.state.designs.length; i++) {
                      if (this.state.designs[i].id === data.value) {
                        this.setState({
                          design: this.props.job.designs[i],
                          designNumber: i,
                          conditionalDate: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.conditionalDate : null,
                          executedDate: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.executedDate : null,
                          inHouse: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.inHouse : false,
                          manager: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.manager : null,
                          program: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.program : null,
                          utility: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.utility : null,
                          number: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.number : '',
                          reviewStartDate: this.props.job.designs[i].interconnection ? this.props.job.designs[i].interconnection.reviewStartDate : null,
                          inspectionTime: this.props.job.designs[i].interconnection ? moment(this.props.job.designs[i].interconnection.executedDate).format('HH:mm') : '',
                          selected: data.value
                        })
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="row">
                {peopleDropdown}
                {utilitiesDropdown}
            </div>

          <div className='row'>
            <div className="form-group col-md-6">
              <label htmlFor="">Interconnection Type</label>
              <Dropdown
                placeholder='Interconnection Type'
                fluid selection options={programs.map((program, index) => {
                  return {
                    key: index,
                    text: program.name,
                    value: program.id
                  }
                })}
                value={this.state.program ? this.state.program.id : null}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data.value)
                  this.setState({ program: {id: data.value} }, this.handleBlur)
                }}
              />
            </div>
            <LabelInput className="col-md-6" label='Utility Agreement Number' name='Permit Application Number' value={this.state.number} placeholder='Utility Agreement #' onChange={(e, key, value) => this.setState({ number: e.target.value })} onBlur={this.handleBlur}/>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">SECTIONS</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Utility_Icon.svg' height="35" width="50"/>
            </div>
          </div>

          <div className="row">
            {
              this.state.design.interconnection ?
              this.state.design.interconnection.sections ? this.state.design.interconnection.sections.map((section, index) => {
                return <UtilitySection key={index} sectionKey={index} section={section} designNumber={this.state.designNumber} job={this.props.job}/>;
              }) : <div className="comm-jobs-message">...</div> : ''
            }
          </div>
          <br />
          <div className='row'>
            <AddUtilitySectionModal belongsToId={this.state.design.interconnection ? this.state.design.interconnection.id : null} belongsTo="Interconnection"/>
          </div>
          <br />
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">INSPECTION</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Utility_Icon.svg' height="35" width="50"/>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Inspection Requested On (YYYY-MM-DD)" id="2" value={this.state.conditionalDate ? moment(this.state.conditionalDate)._d : null} onChange={(e, date) => this.setState({ conditionalDate: moment(date)._d}, this.handleBlur)} />
              <Button color="#c4d6d6" onClick={this.clearConditionalDate}>CLEAR DATE</Button>
            </div>
            <div className='col-md-6'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Inspection Start Date (YYYY-MM-DD)" id="3" value={this.state.reviewStartDate ? moment(this.state.reviewStartDate)._d : {}} onChange={(e, date) => this.setState({ reviewStartDate: moment(date)._d}, this.handleBlur)} />
              <Button color="#c4d6d6" onClick={this.clearReviewStartDate}>CLEAR DATE</Button>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-6'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Executed Inspection Date (YYYY-MM-DD)" id="1" value={this.state.executedDate ? moment(this.state.executedDate)._d : {}} onChange={(e, date) => this.setState({ executedDate: moment(date)._d}, this.handleBlur)} />
              <Button color="#c4d6d6" onClick={this.clearExecutedDate}>CLEAR DATE</Button>
            </div>
          </div>
        </div>
    }

    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">UTILITY</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Utility_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          {utilityInfo}
        </div>
      </div>
    )
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Employee" type:"Person"){
      id
      firstName
      lastName
    }
  }
`;
const getUtilitiesQuery = gql`
  query getUtilities($zip: Int){
    getUtilities(zip: $zip){
      id
      name
    }
  }
`;
const UtilityTabWithData = compose(
  graphql(getPeopleQuery, {name: 'getPeople'}),
  graphql(getUtilitiesQuery, {
    name: 'getUtilities',
    options: (ownProps) => ({
      variables: {
        zip: (ownProps.job.address && ownProps.job.address.zip) ? ownProps.job.address.zip : null,//getting the job id from this.props.params.id
      },
      fetchPolicy: 'cache-and-network'
    })
  })
)(UtilityTab)

export default UtilityTabWithData;
