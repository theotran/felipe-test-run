import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import LabelInput from '../LabelInput';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import AddIcon from 'material-ui/svg-icons/content/add';
import { Dropdown, Button } from 'semantic-ui-react';


const CreateSectionMutation = gql`
  mutation createSection($name: String, $status: String, $startDate: DateTime, $endDate: DateTime, $dueDate: DateTime, $approvalDate: DateTime, $ContactId: ID, $belongsTo: String, $belongsToId: ID) {
    createSection(input: { name: $name, status: $status, startDate: $startDate, endDate: $endDate, dueDate: $dueDate, approvalDate: $approvalDate, ContactId: $ContactId, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
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
    }
  }
`;

class AddSectionModal extends Component {

  constructor(props) {
    super(props);
    console.log(this.props)

    this.state = {
      open: false,
      name: '',
      status: '',
      startDate: null,
      endDate: null,
      dueDate: null,
      approvalDate: null,
      contactId: '',
      buttonText: this.props.buttonText ? this.props.buttonText : 'ADD SECTION'
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    this.props.CreateSection({
      variables: {
        name: this.state.name,
        status: this.state.status,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        dueDate: this.state.dueDate,
        approvalDate: this.state.approvalDate,
        ContactId: this.state.contactId,
        belongsTo: this.props.belongsTo,
        belongsToId: this.props.belongsToId,
      }
    }).then((value) => {
      console.log("value from callback", value);
      window.location.reload();
    })
  }

  render() {
    console.log("SECTION MODALS STATE ", this.state)
    console.log("SECTION MODALS PROPS ", this.props)
    if(this.props.data.loading) {
      return(
        <div>loading...</div>
      )
    }

    if(this.props.data.error) {
      return (
        <div>Error</div>
      )
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        backgroundColor={"#00B1B3"}
        labelColor={"#fff"}
        label="Submit"
        onTouchTap={this.handleSave}
      />
    ];

    let addSectionModalButton;

    if(this.props.belongsToId !== null) {
      addSectionModalButton = <Button color="teal" content={this.state.buttonText} icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} />
    } else {
      addSectionModalButton = <Button color="teal" content={this.state.buttonText} icon='plus' labelPosition='left' onClick={(e, data) => {this.handleOpen()}} disabled/>
    }

    return (
      <div className="col-md-6">
        {addSectionModalButton}
        <Dialog
          title={this.state.buttonText}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="">Contact</label>
                  <Dropdown
                    placeholder='Contact'
                    fluid selection options={this.props.data.getPeople.map((designer, index) => {
                      return {
                        key: index,
                        text: designer.firstName + " " + designer.lastName,
                        value: designer.id
                      }
                    })}
                    value={this.state.contactId}
                    onChange={(e, data) => {
                      console.log("VALUE IN DROPDOWN ", data)
                      this.setState({ contactId: data.value }, this.handleBlur)
                    }}
                  />
                </div>
                <div className='form-group col-md-6'>
                  <label htmlFor="">Name</label>
                  <Dropdown
                    placeholder='Select One'
                    fluid selection options={[
                      { text: 'D.P.P. (City & County)', value: 'D.P.P. (City & County)', },
                      { text: 'Electrical Review', value: 'Electrical Review', },
                      { text: 'Building Review', value: 'Building Review', },
                      { text: 'Zoning Review', value: 'Zoning Review', },
                      { text: 'Special Management Area', value: 'Special Management Area', },
                      { text: 'Environmental Assesment', value: 'Environmental Assesment', },
                      { text: 'Conditional Use Permit', value: 'Conditional Use Permit', },
                      { text: 'DLNR', value: 'DLNR', },
                      { text: 'Permit Deposit Costs', value: 'Permit Deposit Costs' },
                      { text: 'Permit Final Costs', value: 'Permit Final Costs' },
                      { text: 'Other', value: 'Other', },
                    ]}
                    value={this.state.name}
                    onChange={(e, data) => {
                      console.log("VALUE IN DROPDOWN ", data)
                      this.setState({ name: data.value })
                    }}
                  />
                </div>
              </div>

              <div className="row">

                {/* <LabelInput className={'col-md-6'} label='Name' value={this.state.name} placeholder='Name' onChange={(e) => { this.setState({ name: e.target.value }) }} onBlur={this.handleBlur}/> */}
                {/* <LabelInput className={'col-md-6'} label='Status' value={this.state.status} placeholder='Status' onChange={(e) => { this.setState({ status: e.target.value }) }} onBlur={this.handleBlur}/> */}
              </div>
              <div className="row">
                <div className='form-group col-md-6'>
                  <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="1" value={this.state.startDate ? moment(this.state.startDate)._d : {}} onChange={(e, date) => {
                    this.setState({ startDate: moment(date)._d }, this.handleBlur)
                  } }/>
                </div>
                <div className='form-group col-md-6'>
                  <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Due Date" id="3" value={this.state.dueDate ? moment(this.state.dueDate)._d : {}} onChange={(e, date) => {
                    this.setState({ dueDate: moment(date)._d }, this.handleBlur)
                  } }/>
                </div>
              </div>
        </Dialog>
      </div>
    );
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group: "Employee", type:"Person"){
      id
      firstName
      lastName
    }
  }
`;

const AddSectionModalWithMutation = compose(
  graphql(getPeopleQuery),
  graphql(CreateSectionMutation, {
    name: "CreateSection"
  }),
)(AddSectionModal);

export default AddSectionModalWithMutation;
