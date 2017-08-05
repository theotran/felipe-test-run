import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PMSelect from './PMSelect';
import SiteAddress from './SiteAddress';
import { Label, Button, Search, Input } from 'semantic-ui-react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import postcode from 'postcode-validator';
import moment from 'moment';

import TextInput from './../../inputs/TextInput';
import NumberInput from './../../inputs/NumberInput';
import Dropdown from './../../inputs/Dropdown';
import SearchSelect from './../../inputs/SearchSelect';
import SearchSelectWithCreate from './../../inputs/SearchSelectWithCreate';
import DatePicker from './../../inputs/DatePicker';
import TimePicker from './../../inputs/TimePicker';


import GetEmployeesQuery from './../../../queries/GetEmployees';

import UpdateJobMutation from './../../../mutations/UpdateJob';
import UpdateSiteMutation from './../../../mutations/UpdateSite';
import SetSiteContactMutation from './../../../mutations/SetSiteContact';
import AddAddressMutation from './../../../mutations/AddAddressMutation';
import UpdateAddressMutation from './../../../mutations/UpdateAddressMutation';
import GetCustomersQuery from './../../../queries/GetCustomers';
import AddNewSiteContact from './AddNewSiteContact';

import states from './../../../refs/states';
import zoningCodes from './../../../refs/zoningCodes';

const resultRenderer = ({ id, firstName, lastName }) => (
  <Label key={id} content={firstName + " " + lastName} />
)

class SiteTab extends Component {

  state = {
    name: this.props.job.name,
    number: this.props.job.number,
    type: this.props.job.type,
    status: this.props.job.status,
    parcelNumber: this.props.job.site ? this.props.job.site.number : '',
    sunHours: this.props.job.site ? this.props.job.site.sunHours : '',
    line1: this.props.job.address ? this.props.job.address.line1 : '',
    line2: this.props.job.address ? this.props.job.address.line2 : '',
    city: this.props.job.address ? this.props.job.address.city : '',
    state: this.props.job.address ? this.props.job.address.state : '',
    zip: this.props.job.address ? this.props.job.address.zip : '',
    country: this.props.job.address ? this.props.job.address.country : '',
    ownerOfRecord: this.props.job.site ? this.props.job.site.ownerOfRecord : '',
    isNewBuild: this.props.job.site ? this.props.job.site.isNewBuild : false,
    acreage: this.props.job.site ? this.props.job.site.acreage : '',
    zoningCode: this.props.job.site ? this.props.job.site.zoningCode : '',
    landUse: this.props.job.site ? this.props.job.site.landUse : '',
    mphWind: this.props.job.site ? this.props.job.site.mphWind : '',
    siteContact: this.props.job.site ? this.props.job.site.contact ? this.props.job.site.contact.id : null : null,
    isLoading: false,
    value:  this.props.job.site ? this.props.job.site.contact ? this.props.job.site.contact.firstName + " " + this.props.job.site.contact.lastName : '' : '',
    results: [],
    pm: this.props.job.pm ? this.props.job.pm.id : '',
    pmPhone: '',
    testDate: '',
    testTime: ''
  }

  setName = (e) => {
    this.setState({name: e.target.value})
  }

  setNumber = (e) => {
    this.setState({number: e.target.value})
  }

  setType = (e, data) => {
    this.setState({type: data.value}, this.handleBlur);
  }

  setStatus = (e, data) => {
    this.setState({status: data.value}, this.handleBlur);
  }

  setLine1 = (e) => {
    this.setState({line1: e.target.value});
  }

  setLine2 = (e) => {
    this.setState({line2: e.target.value});
  }

  setCity = (e) => {
    console.log(e.target.value);
    this.setState({city: e.target.value});
  }

  setStateCode = (e, data) => {
    this.setState({state: data.value}, this.handleAddressChange);
  }

  setZip = (e) => {
    this.setState({zip: e.target.rawValue});
  }

  setCountry = (e) => {
    this.setState({country: e.target.value});
  }

  setParcelNumber = (e) => {
    this.setState({parcelNumber: e.target.value});
  }

  setSunHours = (e, data) => {
    this.setState({sunHours: data.value}, this.handleBlur);
  }

  setOwnerOfRecord = (e) => {
    this.setState({ownerOfRecord: e.target.value});
  }

  setIsNewBuild = (e, data) => {
    let newBuildBool = null;
    if(data.value === 'false'){ newBuildBool = false;}
    if(data.value === 'true'){ newBuildBool = true;}
    this.setState({isNewBuild: newBuildBool}, this.handleBlur);
  }

  setAcreage = (e) => {
    this.setState({acreage: e.target.rawValue ? e.target.rawValue : null});
  }

  setZoningCode = (e, data) => {
    this.setState({zoningCode: data.value}, this.handleBlur);
  }

  setLandUse = (e) => {
    this.setState({landUse: e.target.value});
  }

  setMphWind = (e) => {
    console.log(e.target.rawValue);
    this.setState({mphWind: e.target.rawValue ? e.target.rawValue : null});
  }

  setTestDate = (e, date) => {
    console.log(moment(date)._d);
    this.setState({testDate: moment(date)._d});
  }

  setTestTime = (e, date) => {
    console.log(e, moment(date)._d);
    this.setState({testDate: moment(date)._d}, console.log(this.state.testDate));
  }

  handleBlur = (e) => {
    if(this.props.job.name !== this.state.name || this.props.job.number !== this.state.number || this.props.job.type !== this.state.type || this.props.job.status !== this.state.status){
      this.props.JobUpdateMutation({
        variables: {
          id: this.props.job.id,
          name: this.state.name,
          number: this.state.number,
          type: this.state.type,
          status: this.state.status
        }
      });
    }

    if(this.props.job.site && (this.props.job.site.parcelNumber !== this.state.parcelNumber || this.props.job.site.sunHours !== this.state.sunHours || this.props.job.site.ownerOfRecord !== this.state.ownerOfRecord || this.props.job.site.isNewBuild !== this.state.isNewBuild || this.props.job.site.acreage !== this.state.acreage || this.props.job.site.zoningCode !== this.state.zoningCode || this.props.job.site.landUse !== this.state.landUse || this.props.job.site.mphWind !== this.state.mphWind)) {
      console.log("IN THE ON BLUR");
      this.props.UpdateSite({
        variables: {
          id: this.props.job.site.id,
          type: "JobSite",
          number: this.state.parcelNumber,
          sunHours: this.state.sunHours,
          ownerOfRecord: this.state.ownerOfRecord,
          isNewBuild: Boolean(this.state.isNewBuild),
          acreage: this.state.acreage,
          zoningCode: this.state.zoningCode,
          landUse: this.state.landUse,
          mphWind: this.state.mphWind
        }
      })
    }

  }

  handleAddressChange = (e) => {
    console.log("HANDLE ADDRESS CHANGE");
    let addressObj = {
      id: this.props.job.address.id,
      belongsTo: "job",
      belongsToId: this.props.job.id,
      type: "site",
      level: "primary",
      line1: this.state.line1,
      line2: this.state.line2,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip
    }
    if(this.props.job.address){
      this.props.UpdateAddress({
        variables: addressObj
      }).then(res=>console.log(res))
    } else {
      this.props.AddAddress({
        variables: addressObj
      })
    }
  }


  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => {
    console.log(result)
      this.setState({
        value: result.result.firstName + " " + result.result.lastName,
        siteContact: result.result.id
      }, () => {
        this.props.SetSiteContact({
          variables: {
            siteId: this.props.job.site.id,
            personId: this.state.siteContact
          }
        })
      })
  }

  handleSearchChange = (e, value) => {
    this.setState({ isLoading: true, value: value.value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => {
        console.log(this.props.data.getPeople)
        return re.test(result.firstName) || re.test(result.lastName)//TODO add a regex search for phone number
      }
      this.setState({
        isLoading: false,
        results: _.filter(this.props.data.getPeople, isMatch),
      })
    }, 500)
  }

  viewQuotes = () => {
    console.log(this.props.job.id)
    browserHistory.push(`/commercial/project/${this.props.job.id}/quote` );
  }

  render() {
    console.log("SITE TABS STATE", this.state)
    console.log("SITE TABS PROPS", this.props)
    if(this.props.customers.loading || this.props.employees.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
        );
    }

    if(this.props.customers.error || this.props.employees.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    return (
      <div className="panel panel-default">
          <div className="panel-body">

            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">SITE INFO</h4>
                  <img className="tabHeaderLogo" role="presentation" src='/images/Site_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>

            <div className='row'>
              <TextInput props={
                {
                  label: "Name",
                  className: "form-group col-md-6",
                  value: this.state.name,
                  onChange: this.setName,
                  onBlur: this.handleBlur,
                  titleCase: true
                }
              } />
              <TextInput props={
                {
                  label: "Project Number",
                  className: "form-group col-md-6",
                  value: this.state.number,
                  onChange: this.setNumber,
                  onBlur: this.handleBlur
                }
              } />
            </div>

            <div className="row">
              <SearchSelect props={
                {
                  label: "Project Type",
                  className: "form-group col-md-6",
                  placeholder:'Project Type',
                  options: [
                   {text: 'Residential', value: 'Residential'},
                   {text: 'Commercial', value: 'Commercial'},
                   {text: 'Utility', value: 'Utility'},
                   {text: 'Other', value: 'Other'},
                  ],
                  onChange: this.setType,
                  value: this.state.type
                }
              } />
              <SearchSelect props={
                {
                  label: 'Status',
                  className: "form-group col-md-6",
                  placeholder:'Project Status',
                  options:[
                    {text: 'Lead', value: 'Lead'},
                    {text: 'Active', value: 'Active'},
                    {text: 'On-Hold', value: 'On-Hold'},
                    {text: 'Cancelled', value: 'Cancelled'},
                    {text: 'Complete', value: 'Complete'},
                    {text: 'As-Built', value: 'As-Built'}
                  ],
                  value: this.state.status,
                  onChange: this.setStatus
                }
              } />
            </div>

            <div className="row">
              <TextInput props={
                {
                  label: "Address Line 1",
                  placeholder: "Line 1",
                  className: "form-group col-md-6",
                  value: this.state.line1,
                  onChange: this.setLine1,
                  onBlur: this.handleAddressChange,
                  titleCase: true
                }
              } />
              <TextInput props={
                {
                  label: "Address Line 2 (optional)",
                  placeholder: "Apt, Suite, etc.",
                  className: "form-group col-md-6",
                  value: this.state.line2,
                  onChange: this.setLine2,
                  onBlur: this.handleAddressChange,
                  titleCase: true
                }
              } />
            </div>

            <div className="row">
              <TextInput props={
                {
                  label: "City",
                  placeholder: "City",
                  className: "form-group col-md-6",
                  value: this.state.city,
                  onChange: this.setCity,
                  onBlur: this.handleAddressChange,
                  titleCase: true
                }
              } />
              <SearchSelect props={
                {
                  label: 'State',
                  className: "form-group col-md-3",
                  placeholder: 'Select a State',
                  options: states,
                  value: this.state.state,
                  onChange: this.setStateCode
                }
              }
              />
              <NumberInput props={
                {
                  label: "Zip Code",
                  placeholder: "Zip Code",
                  className: "form-group col-md-3",
                  value: this.state.zip,
                  onChange: this.setZip,
                  onBlur: this.handleAddressChange,
                  cleaveOptions: {blocks: [5], numericOnly: true}
                }
              } />
            </div>

            <div className="row">
              <p className="googleMapsLink">
                <a target="_blank" href={`https://www.google.com/maps/place/${this.state.line1 + ", " + this.state.zip}`}><font color="61385F">Google Maps</font></a>
              </p>
            </div>

            <div className="row">
               <TextInput props={
                {
                  label: "Parcel Number",
                  placeholder: "Parcel Number",
                  className: "form-group col-md-6",
                  value: this.state.parcelNumber,
                  onChange: this.setParcelNumber,
                  onBlur: this.handleBlur
                }
              } />
              <SearchSelect props={
                {
                  label: 'Sun Hours',
                  placeholder:'Sun Hours',
                  className: "form-group col-md-6",
                  options: (()=> {
                    let dropdownOptions = [];
                    for(let v=2; v<8.99; v+=.1){
                      dropdownOptions.push({text: v.toFixed(1).toString(), value: parseFloat(v.toFixed(1))});
                    }
                    return dropdownOptions;
                  })(),
                  value: this.state.sunHours ? this.state.sunHours : '',
                  onChange: this.setSunHours
                }
              } />
            </div>

            <div className="row">
              <TextInput props={
                {
                  label: "Owner of Record",
                  placeholder: "Owner Name",
                  className: "form-group col-md-4",
                  value: this.state.ownerOfRecord,
                  onChange: this.setOwnerOfRecord,
                  onBlur: this.handleBlur,
                  titleCase: true
                }
              } />
              <SearchSelect props={
                {
                  label: 'Is New Build?',
                  placeholder:'New Build?',
                  className: "form-group col-md-2",
                  options: [{text:"Yes", value: "true"}, {text:"No", value:"false"}],
                  value: typeof this.state.isNewBuild === 'boolean' ? Boolean(this.state.isNewBuild).toString() : '',
                  onChange: this.setIsNewBuild
                }
              } />
              <NumberInput props={
                {
                  label: "Acreage",
                  placeholder: "0.5",
                  className: "form-group col-md-2",
                  min: 0,
                  step: "0.0001",
                  value: this.state.acreage,
                  onChange: this.setAcreage,
                  onBlur: this.handleBlur,
                  rightLabel: "ac",
                  cleaveOptions: {numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalScale: 4}
                }
              } />
              <SearchSelect props={
                {
                  label: 'Zoning Code',
                  placeholder:'BMX-3',
                  className: "form-group col-md-4",
                  options: zoningCodes,
                  value: this.state.zoningCode ? this.state.zoningCode : '',
                  onChange: this.setZoningCode
                }
              } />
            </div>
            <div className="row">
              <TextInput props={
                {
                  label: "Land Use",
                  placeholder: "Usage",
                  className: "form-group col-md-3",
                  value: this.state.landUse,
                  onChange: this.setLandUse,
                  onBlur: this.handleBlur,
                  titleCase: true
                }
              } />
              <DatePicker props={
                {
                  label: "Test Date",
                  className: "col-md-3",
                  value: this.state.testDate,
                  onChange: this.setTestDate,
                  autoOk: true
                }
              } />
              <TimePicker props={
                {
                  label: "Test Time",
                  className: "col-md-3",
                  value: this.state.testDate,
                  onChange: this.setTestDate,
                }
              } />
              <NumberInput props={
                {
                  label: "Wind Load (max 160 mph)",
                  placeholder: "mph",
                  className: "form-group col-md-2",
                  min: 0,
                  max: 160,
                  step: "1",
                  value: this.state.mphWind,
                  onChange: this.setMphWind,
                  onBlur: this.handleBlur,

                  cleaveOptions: {numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalScale: 0}
                }
              } />
            </div>
<br /><br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">PROJECT MANAGER</h4>
                  <img className="tabHeaderLogo" role="presentation" src='/images/Site_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>

            <div className="row">
              <SearchSelectWithCreate props={
                {
                  label: 'Project Manager',
                  placeholder:'Employee',
                  className: "form-group col-md-6",
                  options: this.props.employees.getPeople.map((employee, index)=>{
                    return {text: `${employee.firstName} ${employee.lastName}`, value:employee.id, key: index}
                  }),
                  value: this.state.pm,
                  onChange: this.setPM,
                  createModal: null,
                  createMutation: null,
                  refetchQuery: null
                }
              } />
              <NumberInput props={
                {
                  label: "Phone",
                  placeholder: "Phone",
                  className: "form-group col-md-3",
                  value: '',
                  onChange: this.setZip,
                  onBlur: this.handleAddressChange,
                  cleaveOptions: {blocks:[3,3,4], delimiter:'.', numericOnly: true}
                }
              } />
            </div>
            {/* <div className="row">
              <PMSelect className={"form-group col-md-12"} label={"Project Manager"} job={this.props.job} pm={this.props.job.pm}/>
            </div>
            <div className="row">
              <div className="col-md-5 form-group">
                <label>Project Manager Phone</label>
                  {this.state.pm ?
                    this.state.pm.phones ? this.state.pm.phones.map((phone, index) => {
                      return (
                      <div key={index} className="form-group">
                        <label>Phone Number</label>
                        <input
                          key={index}
                          name='Project Manager Phone'
                          className="form-control"
                          value={phone.number}
                          placeholder='(***) ***-****'
                          readOnly
                        />
                      </div>
                      )
                    }) : '' : ''}
              </div>
              <div className="col-md-1 form-group">
                    <AddPhoneModal belongsToId={this.state.pm.id}/>
              </div>
              <div className="col-md-5 form-group">
                <label>**Project Manager Email**</label>
                  {this.state.pm ?
                    this.state.pm.emails ? this.state.pm.emails.map((email, index) => {
                      return (
                      <div key={index} className="form-group">
                        <label>Email</label>
                        <input
                          key={index}
                          name='Project Manager Email'
                          className="form-control"
                          value={email.address}
                          placeholder='(***) ***-****'
                          readOnly
                        />
                      </div>
                      )
                    }) : '' : ''}
              </div>
              <div className="col-md-1 form-group">
                    <AddEmailModal belongsToId={this.state.pm.id}/>
              </div>
            </div> */}
<br /><br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">ONSITE CONTACT</h4>
                  <img className="tabHeaderLogo" role="presentation" src='/images/Site_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              <SearchSelectWithCreate props={
                {
                  label: 'Onsite Contact',
                  placeholder:'Point of Contact',
                  className: "form-group col-md-6",
                  options: this.props.customers.getPeople.map((customer, index)=>{
                    return {key: index, text: `${customer.firstName} ${customer.lastName}`, value: customer.id}
                  }),
                  value: '',
                  onChange: this.setPM,
                  createModal: null,
                  createMutation: null,
                  refetchQuery: null
                }
              } />

              {/*<div className="col-md-6 form-group">
                <label>Search for a Site Point of Contact</label>
                <Search
                  loading={this.state.isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={this.handleSearchChange}
                  results={this.state.results}
                  value={this.state.value}
                  resultRenderer={resultRenderer}
                />
              </div>*/}
            </div>
              {/*<div className='col-md-6 form-group'>
                <label>Create / View Quotes</label>
                <div>
                  <Button color="teal" content='Add / View Quotes' icon='plus' labelPosition='left' onClick={this.viewQuotes} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 form-group">
                <label>Add a new contact</label>
                <AddNewSiteContact />
              </div>
            </div>
          <div className="row">
            <div className="col-md-5 form-group">
                <label>**Site Contact Phone**</label>
               <input
                  name='Site Contact Phone'
                  className="form-control"
                  value={this.state.sitecontactPhone ? this.state.sitecontactPhone: ''}
                  placeholder='(***) ***-****'
                  onChange={(e) => this.setState({ sitecontactPhone: e.target.value })}
                  onBlur={this.handleBlur}
                />
            </div>
            <div className="col-md-1 form-group">
              <label>**Add**</label>
              <AddPhoneModal belongsToId={this.state.siteContact}/>
            </div>

            <div className="col-md-5 form-group">
                <label>**Site Contact Email**</label>
               <input
                  name='Site Contact Email'
                  className="form-control"
                  value={this.state.sitecontactEmail ? this.state.sitecontactEmail: ''}
                  placeholder='you@email.com'
                  onChange={(e) => this.setState({ sitecontactEmail: e.target.value })}
                  onBlur={this.handleBlur}
                />
            </div>
            <div className="col-md-1 form-group">
              <label>**Add**</label>
              <Button color='teal' onClick={this.handleOpen}>+</Button>
            </div>
          </div> */}
        </div>
      </div>


    )
  }
}



export default SiteTab;
