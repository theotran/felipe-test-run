import React, { Component } from 'react';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';


import client from './../../../index.js';
import gql from 'graphql-tag';
import GetJobQuery from '../../../queries/GetJobQuery';
import LabelInput from './../../LabelInput';

import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react';
import AddSectionModal from '../AddSectionModal';
import Section from '../Section';

let cachedJobQuery;

const CreatePermittingMutation = gql`
  mutation createPermitting($inHouse: Boolean, $AssignedToId: ID, $applicationNumber: String, $approvalNumber: String, $startDate: DateTime, $DesignId: ID) {
    createPermitting(input: { inHouse: $inHouse, AssignedToId: $AssignedToId, applicationNumber: $applicationNumber, approvalNumber: $approvalNumber, startDate: $startDate, DesignId: $DesignId }) {
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
      }
    }
  }
`
const UpdatePermittingMutation = gql`
  mutation updatePermitting($id: ID, $inHouse: Boolean, $AssignedToId: ID, $applicationNumber: String, $approvalNumber: String, $startDate: DateTime) {
    updatePermitting(input: { id: $id, inHouse: $inHouse, AssignedToId: $AssignedToId, applicationNumber: $applicationNumber, approvalNumber: $approvalNumber, startDate: $startDate }) {
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
      }
    }
  }
`


class PermittingTab extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    if(this.props.job.designs.length === 0) {
      this.state = {
        name: this.props.job.name,
        number: this.props.job.number,
        designNumber: null,
        designs: [],
        selected: '',
        design: {},
        applicationNumber: '',
        approvalNumber: '',
        inHouse: false,
        startDate: null,
        permittingId: null,
        assignedTo: null
      }
    } else {
      this.state = {
        name: this.props.job.name,
        number: this.props.job.number,
        designNumber: this.props.job.designs[0] ? 0 : null,
        designs: this.props.job.designs ? this.props.job.designs : [],
        selected: this.props.job.designs[0] ? this.props.job.designs[0].id : '',
        design: this.props.job.designs[0] ? this.props.job.designs[0] : {},
        applicationNumber: this.props.job.designs[0].permitting ? this.props.job.designs[0].permitting.applicationNumber : '',
        approvalNumber: this.props.job.designs[0].permitting ? this.props.job.designs[0].permitting.approvalNumber : '',
        inHouse: this.props.job.designs[0].permitting ? this.props.job.designs[0].permitting.inHouse : false,
        startDate: this.props.job.designs[0].permitting ? this.props.job.designs[0].permitting.startDate : null,
        permittingId: this.props.job.designs[0].permitting ? this.props.job.designs[0].permitting.id : null,
        assignedTo: this.props.job.designs[0].permitting ?
          this.props.job.designs[0].permitting.assignedTo ?
            this.props.job.designs[0].permitting.assignedTo.id : null : '',
      }
    }
  }

  toggleCheckbox(key) {
    console.log("Toggling checkbox value! ");
    const nextKeyState = !this.state[key];
    this.setState({ [key]: nextKeyState }, () => {
      this.handleBlur()
    });
  }

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    const cachedDesignIndexPermitting = cachedJobQuery.job.designs[this.state.designNumber].permitting;

    if(!cachedDesignIndexPermitting) {
      client.mutate({
        mutation: CreatePermittingMutation,
        variables: {
          inHouse: this.state.inHouse,
          applicationNumber: this.state.applicationNumber,
          approvalNumber: this.state.approvalNumber,
          startDate: this.state.startDate,
          DesignId: this.state.design.id,
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

          if('createPermitting' in result.data) {
            data.job.designs[this.state.designNumber].permitting = result.data.createPermitting;
            this.setState({
              permittingId: result.data.createPermitting.id,
            })
          } else {
            data.job.designs[this.state.designNumber].permitting = result.data;
          }

          console.log("data after rewrite ", data)

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      //end client.mutate()

      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
      console.log('query after write: ', cachedJobQuery);
    }

    if(cachedDesignIndexPermitting && (cachedDesignIndexPermitting.applicationNumber !== this.state.applicationNumber || cachedDesignIndexPermitting.inHouse !== this.state.inHouse || cachedDesignIndexPermitting.approvalNumber !== this.state.approvalNumber || cachedDesignIndexPermitting.startDate !== this.state.startDate )) {
      client.mutate({
        mutation: UpdatePermittingMutation,
        variables: {
          id: cachedDesignIndexPermitting.id,
          inHouse: this.state.inHouse,
          applicationNumber: this.state.applicationNumber,
          approvalNumber: this.state.approvalNumber,
          startDate: this.state.startDate,
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

          if('updatePermitting' in result.data) {
            console.log("2. ACTUAL RESPONSE ")
            data.job.designs[this.state.designNumber].permitting = result.data.updatePermitting;
          } else {
            console.log("1. OPTIMISTIC RESPONSE ")
            data.job.designs[this.state.designNumber].permitting = result.data;
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
    }

  }

  render() {
    console.log("PERMITTING TABS PROPS", this.props)
    console.log("PERMITTING TABS STATE", this.state)

    if(this.props.job.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
      );
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    let permittingInfo;
    if (this.state.designs.length !== 0) {
      permittingInfo =
      <div>
        <div className='row'>
          <div className='col-md-3 form-group'>
            <Dropdown
              placeholder='Designs'
              fluid selection options={this.state.designs.map((design, index) => {
                console.log(design)
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
                      designNumber: i,
                      selected: data.value,
                      design: this.props.job.designs[i],
                      applicationNumber: this.props.job.designs[i].permitting ? this.props.job.designs[i].permitting.applicationNumber : '',
                      approvalNumber: this.props.job.designs[i].permitting ? this.props.job.designs[i].permitting.approvalNumber : '',
                      inHouse: this.props.job.designs[i].permitting ? this.props.job.designs[i].permitting.inHouse : false,
                      startDate: this.props.job.designs[i].permitting ? this.props.job.designs[i].permitting.startDate : '',
                      permittingId: this.props.job.designs[i].permitting ? this.props.job.designs[i].permitting.id : null,
                    })
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className='form-group col-md-6'>
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Permit Application Submitted On" id="1" value={this.state.startDate ? moment(this.state.startDate)._d : {}} onChange={(e, date) => {
              console.log("DatePicker date", moment(date)._d)
              this.setState({ startDate: moment(date)._d }, this.handleBlur)
            } }/>
          </div>
        </div>
        <div className="row">
          <LabelInput className="col-md-6" label='Permit Application Number' name='Permit Application Number' value={this.state.applicationNumber} placeholder='Permit Application #' onChange={(e, key, value) => this.setState({ applicationNumber: e.target.value })} onBlur={this.handleBlur}/>
          <LabelInput className="col-md-6" label='Approval Number' name='Permit Approval Number' value={this.state.approvalNumber} placeholder='Approval #' onChange={(e, key, value) => this.setState({ approvalNumber: e.target.value })} onBlur={this.handleBlur}/>
        </div>
        <div className="row">
          {
            this.state.design.permitting ?
            this.state.design.permitting.sections ? this.state.design.permitting.sections.map((section, index) => {
              console.log("SECTIONS ", section);
              return <Section key={index} sectionKey={index} section={section} designNumber={this.state.designNumber} job={this.props.job} belongsTo={'Permitting'} />;
            }) : <div className="comm-jobs-message">...</div> : ''
          }
        </div>
        <br />
        <div className="row">
          <AddSectionModal buttonText={'ADD PERMIT REVIEW'} belongsToId={this.state.permittingId} belongsTo={'Permitting'} />
        </div>
      </div>
    } else {
      permittingInfo =
      <div className='row'>
        <br />There are no designs!
      </div>
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className='row'>
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">PERMITTING</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Permitting_Icon_p.svg' height="35" width="50"/>
            </div>
          </div>
          {permittingInfo}
        </div>
      </div>
    )
  }
}

export default PermittingTab;
