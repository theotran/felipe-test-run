import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
// import AddIcon from 'material-ui/svg-icons/navigation/more-horiz';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';

import LabelInput from '../../LabelInput';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import gql from 'graphql-tag';
import client from '../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';

import ReviewInfo from './../Review/ReviewInfo';
import AddReviewModal from './../Review/AddReviewModal';

import AddCostModal from '../Accounting/AddCostModal';
import { Dropdown } from 'semantic-ui-react';
let asdf;
const UpdateSectionMutation = gql`
  mutation updateSection($id: ID, $name: String, $status: String, $startDate: DateTime, $endDate: DateTime, $dueDate: DateTime, $approvalDate: DateTime, $ContactId: ID, $belongsTo: String, $belongsToId: ID) {
    updateSection(input: { id: $id, name: $name, status: $status, startDate: $startDate, endDate: $endDate, dueDate: $dueDate, approvalDate: $approvalDate, ContactId: $ContactId, belongsTo: $belongsTo, belongsToId: $belongsToId}) {
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


let cachedJobQuery;

class UtilitySection extends Component {

  constructor(props) {
    super(props);
    console.log(this.props)

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      name: this.props.section.name,
      status: this.props.section.status,
      startDate: this.props.section.startDate,
      endDate: this.props.section.endDate,
      dueDate: this.props.section.dueDate,
      approvalDate: this.props.section.approvalDate,
      contactId: this.props.section.contact.id
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    console.log("cachedJobQuery is ", cachedJobQuery);

    const currentSection = cachedJobQuery.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey];

    if(cachedJobQuery.job.designs[this.props.designNumber].permitting.sections && (currentSection.name !== this.state.name || currentSection.status !== this.state.status || currentSection.startDate !== this.state.startDate || currentSection.endDate !== this.state.endDate || currentSection.dueDate !== this.state.dueDate || currentSection.approvalDate !== this.state.approvalDate || currentSection.contact.id !== this.state.contactId )) {
      client.mutate({
        mutation: UpdateSectionMutation,
        variables: {
          id: this.props.section.id,
          name: this.state.name,
          status: this.state.status,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          dueDate: this.state.dueDate,
          approvalDate: this.state.approvalDate,
          ContactId: this.state.contactId,
          belongsTo: "Permitting",
        },
        optimisticResponse: {
          id: this.props.section.id,
          name: this.state.name,
          status: this.state.status,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          dueDate: this.state.dueDate,
          approvalDate: this.state.approvalDate,
          belongsTo: "Permitting",
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy);

          console.log('RESULT', result);

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
             id: this.props.job.id
            }
          });

          console.log('data', data);
          console.log('onBlur result', result);

          if('updateSection' in result.data) {
            console.log("2. ACTUAL RESPONSE ")
            data.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey] = result.data.updateSection;
          } else {
            console.log("1. OPTIMISTIC RESPONSE ")
            data.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey] = result.data;
          }

          console.log('data after updating section ', data);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
           data
         });
        }
      });
      //end client mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id,
        }
      });
    }



    return cachedJobQuery;
  }

  render() {
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

    const reviews = this.props.section.reviews ? this.props.section.reviews.map((review, key) => {
      return <ReviewInfo key={key} designNumber={this.props.designNumber} reviewNumber={key} job={this.props.job}  review={this.props.section.reviews[key]} sectionKey={this.props.sectionKey} />
    }) : <div></div>;

    const filteredCosts = this.props.job.costs.filter((cost) => {
      return cost.type === this.state.name
    })

    const costs = filteredCosts.map((cost, key) => {
      return (
        <div key={key}>
          <div className='row'>
            <div className='col-md-4'>
              <div>{moment(cost.createdAt).format('lll')}</div>
            </div>
            <div className='col-md-4'>
              <div>{cost.amount}</div>
            </div>
            <div className='col-md-4'>
              <div>{cost.description}</div>
            </div>
          </div>
        </div>
      )
    })

    let addReview;
    if (this.props.belongsTo !== 'Permitting') {
      addReview = <div>
                    <AddReviewModal belongsToId={this.props.section.id} buttonText={'ADD REVIEW'} belongsTo={"Section"} />
                  </div>
    }

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={this.state.name}
          subtitle={"Status : " + this.state.status}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className="row">
            <div className='form-group col-md-6'>
              <label htmlFor="">Name</label>
              <Dropdown
                placeholder='Select One'
                fluid selection options={[
                  { text: 'Intake review', value: 'Intake review', },
                  { text: 'Technical Review', value: 'Technical Review', },
                  { text: 'Supplmental Review', value: 'Supplmental Review', },
                  { text: 'Inspection', value: 'Inspection', },
                  { text: 'Other', value: 'Other', },
                ]}
                value={this.state.name}
                onChange={(e, data) => {
                  console.log("VALUE IN DROPDOWN ", data)
                  this.setState({ name: data.value }, this.handleBlur)
                }}
              />
            </div>
            {/* <LabelInput className={'col-md-6'} label='Name' value={this.state.name} placeholder='Name' onChange={(e) => { this.setState({ name: e.target.value }) }} onBlur={this.handleBlur}/> */}
            {/* <LabelInput className={'col-md-6'} label='Status' value={this.state.status} placeholder='Status' onChange={(e) => { this.setState({ status: e.target.value }) }} onBlur={this.handleBlur}/> */}
          </div>
          <div className="row">
            <div className='form-group col-md-3'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="1" value={this.state.startDate ? moment(this.state.startDate)._d : {}} onChange={(e, date) => {
                this.setState({ startDate: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
            <div className='form-group col-md-3'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="End Date" id="2" value={this.state.endDate ? moment(this.state.endDate)._d : {}} onChange={(e, date) => {
                this.setState({ endDate: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
            <div className='form-group col-md-3'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Due Date" id="3" value={this.state.dueDate ? moment(this.state.dueDate)._d : {}} onChange={(e, date) => {
                this.setState({ dueDate: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
            <div className='form-group col-md-3'>
              <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Approval Date" id="4" value={this.state.approvalDate ? moment(this.state.approvalDate)._d : {}} onChange={(e, date) => {
                this.setState({ approvalDate: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
          </div>
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
          </div>
          <div className="panel-heading comm-jobs-panel-heading">{this.state.name} Cost</div>
          <div className='row'>
            <div className='col-md-4'>
              <div>Date Added</div>
            </div>
            <div className='col-md-4'>
              <div>Amount</div>
            </div>
            <div className='col-md-4'>
              <div>Description</div>
            </div>
          </div>
          {costs}
          <br />
          <AddCostModal JobId={this.props.job.id} belongsTo={'Section'} type={this.state.name} belongsToId={this.props.section.id} />
          <br />
          {reviews}
          <br />
          {addReview}
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    );
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Customer" type:"Person"){
      id
      firstName
      lastName
    }
  }
`;

const SectionWithData = compose(
  graphql(getPeopleQuery)
)(UtilitySection);

export default SectionWithData;
