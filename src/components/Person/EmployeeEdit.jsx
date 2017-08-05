import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import client from './../../index.js';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import InputMask from 'react-input-mask';
import GetPersonQuery from './../../queries/GetPersonQuery';

const createEmployeeInfoMutation = gql`
  mutation createEmployeeInfo($title: String!, $dob: DateTime, $ssn: String, $employeeNumber: String, $startDate: DateTime, $endDate: DateTime, $employeeStatus: String, $PersonId: ID!) {
    createEmployeeInfo(input: {title: $title, dob: $dob, ssn: $ssn, employeeNumber: $employeeNumber, startDate: $startDate, endDate: $endDate, employeeStatus: $employeeStatus, PersonId: $PersonId}) {
      id
      title
      dob
      ssn
      employeeNumber
      startDate
      endDate
      employeeStatus
      success
      message
      field
    }
  }
`;

const UpdateEmployeeInfoMutation = gql`
  mutation UpdateEmployeeInfo($id: ID!, $title: String!, $dob: DateTime, $ssn: String, $employeeNumber: String, $startDate: DateTime, $endDate: DateTime, $employeeStatus: String, $PersonId: ID!) {
    updateEmployeeInfo(input: {id: $id, title: $title, dob: $dob, ssn: $ssn, employeeNumber: $employeeNumber, startDate: $startDate, endDate: $endDate, employeeStatus: $employeeStatus, PersonId: $PersonId}) {
      id
      title
      dob
      ssn
      employeeNumber
      startDate
      endDate
      employeeStatus
      success
      message
      field
    }
  }
`;

let cachedPersonQuery;

class EmployeeEditForm extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      firstName: this.props.person ? this.props.person.firstName : '',
      lastName: this.props.person ? this.props.person.lastName : '',
      PersonId: this.props.person ? this.props.person.id : '',
      title: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.title : '',
      dob: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.dob : '',
      ssn: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.ssn : '',
      employeeNumber: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.employeeNumber : '',
      startDate: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.startDate : '',
      endDate: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.endDate : '',
      employeeStatus: this.props.person.employeeInfo !== null ? this.props.person.employeeInfo.employeeStatus : '',
      field: "",
      error: null
    }
  }

  handleBlur() {

    cachedPersonQuery = client.readQuery({
      query: GetPersonQuery,
      variables: {
        id: this.props.person.id
      }
    });

    console.log('CACHED PERSON QUERY', cachedPersonQuery.person);
    if(cachedPersonQuery.person.employeeInfo === null){
      this.props.CreateEmployeeInfo({
        variables: {
          PersonId: cachedPersonQuery.person.id,
          title: this.state.title,
          dob: this.state.dob,
          ssn: this.state.ssn,
          employeeNumber: this.state.employeeNumber,
          employeeStatus: this.state.employeeStatus,
          startDate: this.state.startDate,
        }
      }).then(info => {
        if(info.data.createEmployeeInfo.success === false){
          this.setState({
            field: info.data.createEmployeeInfo.field,
            error: info.data.createEmployeeInfo.message
          })
        }
      })
    } else if(cachedPersonQuery.person.employeeInfo.title !== this.state.title || cachedPersonQuery.person.employeeInfo.dob !== this.state.dob || cachedPersonQuery.person.employeeInfo.ssn !== this.state.ssn || cachedPersonQuery.person.employeeInfo.employeeNumber !== this.state.employeeNumber || cachedPersonQuery.person.employeeInfo.employeeStatus !== this.state.employeeStatus || cachedPersonQuery.person.employeeInfo.startDate !== this.state.startDate || cachedPersonQuery.person.employeeInfo.endDate !== this.state.endDate ){
      client.mutate({
        mutation: UpdateEmployeeInfoMutation,
        variables: {
          id: cachedPersonQuery.person.employeeInfo.id,
          PersonId: cachedPersonQuery.person.id,
          title: this.state.title,
          dob: this.state.dob,
          ssn: this.state.ssn,
          employeeNumber: this.state.employeeNumber,
          employeeStatus: this.state.employeeStatus,
          startDate: this.state.startDate,
          endDate: this.state.endDate
        },
        optimisticResponse: {
          id: cachedPersonQuery.person.employeeInfo.id,
          PersonId: cachedPersonQuery.person.id,
          title: this.state.title,
          dob: this.state.dob,
          ssn: this.state.ssn,
          employeeNumber: this.state.employeeNumber,
          employeeStatus: this.state.employeeStatus,
          startDate: this.state.startDate,
          endDate: this.state.endDate
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy)

          console.log('RESULT', result)

          // Read data from cached
          const data = proxy.readQuery({
            query: GetPersonQuery,
            variables: {
              id: this.props.person.id
            }
          });
          console.log('data', data)

          if("updateEmployeeInfo" in result.data){

            if(result.data.updateEmployeeInfo.success === false){
              this.setState({
                error: result.data.updateEmployeeInfo.message,
                field: result.data.updateEmployeeInfo.field
              });
            } else {
              // Combine original query data with mutation result
              data.person.employeeInfo.title = result.data.updateEmployeeInfo.title;
              data.person.employeeInfo.dob = result.data.updateEmployeeInfo.dob;
              data.person.employeeInfo.ssn = result.data.updateEmployeeInfo.ssn;
              data.person.employeeInfo.employeeNumber = result.data.updateEmployeeInfo.employeeNumber;
              data.person.employeeInfo.employeeStatus = result.data.updateEmployeeInfo.employeeStatus;
              data.person.employeeInfo.startDate = result.data.updateEmployeeInfo.startDate;
              data.person.employeeInfo.endDate = result.data.updateEmployeeInfo.endDate;

            }
          } else {
            data.person.employeeInfo.title = result.data.title;
            data.person.employeeInfo.dob = result.data.dob;
            data.person.employeeInfo.ssn = result.data.ssn;
            data.person.employeeInfo.employeeNumber = result.data.employeeNumber;
            data.person.employeeInfo.employeeStatus = result.data.employeeStatus;
            data.person.employeeInfo.startDate = result.data.startDate;
            data.person.employeeInfo.endDate = result.data.endDate;
          }
          console.log('DATA POST UPDATE', data);

          // Write combined data back to the cache
          proxy.writeQuery({
            query: GetPersonQuery,
            variables: {
              id: this.props.person.id
            },
            data
          });
        }
      });

      // Update the variable
      cachedPersonQuery = client.readQuery({
        query: GetPersonQuery,
        variables: {
          id: this.props.person.id
        }
      });
    }
  }

  render() {
    let errorTitle;
    let errorDOB;
    let errorStartDate;
    let errorSSN;

    let errorStyles = {
      color: 'red'
    };

    if(this.props.person.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.person.error) {
      console.log(this.props.person.error);
      return (<div>An unexpected error occurred</div>);
    }

    switch(this.state.field){
      case "title":
        errorTitle = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "ssn":
        errorSSN = <div style={errorStyles}>{this.state.error}</div>;
      case "dob":
        errorDOB = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "startDate":
        errorStartDate = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
    }

    return (

      <div>
        <div className="col-md-12 tabHeader" style={{marginBottom: 15}}>
          <h4 className="tabHeaderText">Employee Details - {this.state.firstName} {this.state.lastName}</h4>
          <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
        </div>

          <div className="form-group">

            <div className="row">
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <label className="mdl-textfield__label" htmlFor="">Job Title</label>
                <input
                  name='title'
                  className='mdl-textfield__input form-control'
                  value={this.state.title}
                  onChange={(e) => this.setState({title: e.target.value})}
                  onBlur={this.handleBlur}
                  required
                />
                {errorTitle}
              </div>
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <label className="mdl-textfield__label" htmlFor="">Employee Number</label>
                <input
                  name='employeeNumber'
                  className='mdl-textfield__input form-control'
                  value={this.state.employeeNumber}
                  onChange={(e) => this.setState({employeeNumber: e.target.value})}
                  onBlur={this.handleBlur}
                  required
                />

              </div>
            </div>

            <div className="row">
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <label className="mdl-textfield__label" htmlFor="">SSN</label>
                <InputMask
                  mask="999-99-9999"
                  type="text"
                  className='mdl-textfield__input form-control'
                  value={this.state.ssn}
                  onChange={(e) => this.setState({ssn: e.target.value})}
                  onBlur={this.handleBlur}
                  required
                />
                {errorSSN}
              </div>
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <label className="mdl-textfield__label" htmlFor="">Employee Status</label>
                <input
                  name='employeeStatus'
                  className='mdl-textfield__input form-control'
                  value={this.state.employeeStatus}
                  onChange={(e) => this.setState({employeeStatus: e.target.value})}
                  onBlur={this.handleBlur}
                  required
                />

              </div>
            </div>

            <div className="row">
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <DatePicker errorText={errorDOB} hintText="Date of Birth" autoOk={true} floatingLabelFixed={true} floatingLabelText="Date of Birth" id="2" value={this.state.dob ? moment(this.state.dob)._d : {} } onChange={(e, date) => this.setState({ dob: moment(date)._d}, this.handleBlur)} />
              </div>
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <DatePicker errorText={errorStartDate} hintText="Start Date" autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="2" value={this.state.startDate ? moment(this.state.startDate)._d : {} } onChange={(e, date) => this.setState({ startDate: moment(date)._d}, this.handleBlur)} />
              </div>
            </div>

            <div className="row">
              <div className="mdl-textfield mdl-js-textfield form-group col-md-6">
                <DatePicker hintText="End Date" autoOk={true} floatingLabelFixed={true} floatingLabelText="End Date" id="2" value={this.state.endDate ? moment(this.state.endDate)._d : {} } onChange={(e, date) => this.setState({ endDate: moment(date)._d}, this.handleBlur)} />
              </div>
            </div>
          </div>

      </div>
    )
  }
};

const EmployeeEditFormWithMutation = compose(
  graphql(UpdateEmployeeInfoMutation),
  graphql(createEmployeeInfoMutation, { name: "CreateEmployeeInfo" })
  )(withRouter(EmployeeEditForm));

export default EmployeeEditFormWithMutation;
