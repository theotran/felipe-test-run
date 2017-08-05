import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import AddCommentModal from '../AddCommentModal';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ReviewIcon from 'material-ui/svg-icons/action/assessment';
import ViewComments from '../ViewComments';

import GetJobQuery from '../../../queries/GetJobQuery';
import client from '../../../index.js';
import { Dropdown } from 'semantic-ui-react';

const UpdateReviewMutation = gql`
  mutation updateReview( $id: ID, $startDate: DateTime, $endDate: DateTime, $status: String, $isTPR: Boolean ) {
    updateReview(input: {id: $id, startDate: $startDate, endDate: $endDate, status: $status, isTPR: $isTPR}) {
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
    }
  }
`;

let cachedJobQuery;

class ReviewInfo extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)

    this.handleBlur = this.handleBlur.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);

    this.state = {
      expanded: false,
      startDate: this.props.review.startDate ? this.props.review.startDate : null,
      endDate: this.props.review.endDate ? this.props.review.endDate : null,
      type: this.props.review.type ? this.props.review.type : '',
      status: this.props.review.status ? this.props.review.status : '',
      isTPR: this.props.review.isTPR ? this.props.review.isTPR : false,
      cardIndex: this.props.reviewNumber + 1
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    console.log("cachedJobQuery is ", cachedJobQuery);

    const currentCachedReview = cachedJobQuery.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey].reviews[this.props.reviewNumber];

    if(currentCachedReview.startDate !== this.state.startDate || currentCachedReview.endDate !== this.state.endDate || currentCachedReview.status !== this.state.status || currentCachedReview.isTPR !== this.state.isTPR) {
      client.mutate({
        mutation: UpdateReviewMutation,
        variables: {
          id: this.props.review.id,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
          status: this.state.status,
          isTPR: this.state.isTPR,
        },
        // optimisticResponse: {
        //   id: "someId",
        //   type: "inHouse",
        //   createdAt: "someDate",
        //   startDate: this.state.startDate,
        //   endDate: this.state.endDate,
        //   status: this.state.status,
        //   isTPR: this.state.isTPR,
        // },
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

          if('updateReview' in result.data) {
            console.log("2. ACTUAL RESPONSE ")
            data.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey].reviews[this.props.reviewNumber] = result.data.updateReview;
          } else {
            console.log("1. OPTIMISTIC RESPONSE ");
            data.job.designs[this.props.designNumber].permitting.sections[this.props.sectionKey].reviews[this.props.reviewNumber] = result.data;
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

  toggleCheckbox(key) {
    console.log("Toggling checkbox value! ");
    const nextKeyState = !this.state[key];
    this.setState({ [key]: nextKeyState }, () => {
      this.handleBlur()
    });
  }

  render() {
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<ReviewIcon />}
          title={"Review # " + this.state.cardIndex + " - " + this.state.type}
          subtitle={"Status : " + this.state.status}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>

            <div className="panel-heading comm-jobs-panel-heading">{this.state.type} Review</div>

            <div className='row'>
              <div className='col-md-6'>
                <label>Reviewed By:</label>
                <div>{this.props.review.reviewer ? this.props.review.reviewer.firstName : ' '} {this.props.review.reviewer ? this.props.review.reviewer.lastName : ' '}</div>
              </div>
            </div>

            <div className="row">
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="1" value={this.state.startDate ? moment(this.state.startDate)._d : {}} onChange={(e, date) => {
                  this.setState({ startDate: moment(date)._d }, this.handleBlur)
                }} />
              </div>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="End Date" id="1" value={this.state.endDate ? moment(this.state.endDate)._d : {}} onChange={(e, date) => {
                  this.setState({ endDate: moment(date)._d }, this.handleBlur)
                }} />
              </div>
            </div>

            <div className='row'>
              <div className="form-group col-md-6">
                <label htmlFor="">Status</label>
                <Dropdown
                  placeholder='Status'
                  fluid selection options={[
                     { text: 'In Review', value: 'In Review',},
                     { text: 'Approved', value: 'Approved',},
                     { text: 'Approved with comments', value: 'Approved with comments',},
                     { text: 'Rejected with comments', value: 'Rejected with comments',},
                   ]}
                  value={this.state.status}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ status: data.value }, this.handleBlur)
                  }}
                />
              </div>
              {/* <div className='form-group col-md-6'>
                <SelectField
                  floatingLabelText="Status"
                  value={this.state.status ? this.state.status : ''}
                  onChange={(e,key,value) => {
                    this.setState({ status: value }, this.handleBlur)
                  }}
                >
                  <MenuItem value='In Review' primaryText='In Review'/>
                  <MenuItem value='Approved' primaryText='Approved' />
                  <MenuItem value='Approved with Comments' primaryText='Approved with Comments' />
                  <MenuItem value='Rejected with Comments' primaryText='Rejected with Comments' />
                </SelectField>
              </div> */}
              <div className="form-group col-md-6">
                <div className="ui checkbox">
                  <input id="isTPR" checked={ this.state.isTPR } type="checkbox" onChange={() => { this.toggleCheckbox('isTPR') }}/>
                  <label htmlFor="isTPR">Is third party review?</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="panel-heading comm-jobs-panel-heading">Comments</div>
              <ViewComments mapOver={this.props.review.comments}/>
              <br />
              <div>
                <AddCommentModal belongsTo='Review' belongsToId={this.props.review.id} />
              </div>
            </div>

          </div>
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    )
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

const ReviewInfoWithData = compose(graphql(getPeopleQuery))(ReviewInfo)

export default ReviewInfoWithData;
