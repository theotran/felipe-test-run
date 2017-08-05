import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import AddCommentModal from '../AddCommentModal';
import RevisionDateEdit from '../RevisionDateEdit';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import { Dropdown } from 'semantic-ui-react';
import GetJobQuery from '../../../queries/GetJobQuery';

// let reviewer;

class DesignReviewInfo extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleReviewChange = this.handleReviewChange.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);

    this.state = {
      expanded: false,
      cardIndex: this.props.reviewNumber + 1
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleChange(key, value) {
    this.props.handleReviewChange(this.props.reviewNumber, key, value)
  }

  handleBlur() {
    this.props.blurHandler(this.props.review, this.props.reviewNumber);
  }

  handleReviewChange(key, value){
    this.props.handleReviewChange(this.props.reviewNumber, key, value);
  }

  toggleCheckbox(key) {
    const nextKeyState = !this.props.review[key];
    this.handleReviewChange(this.props.reviewNumber, key, nextKeyState)
  }

  render() {

    let comments;

    if(this.props.job.designs[this.props.designNumber].reviews[this.props.reviewNumber]) {
      comments = this.props.job.designs[this.props.designNumber].reviews[this.props.reviewNumber].comments ? this.props.job.designs[this.props.designNumber].reviews[this.props.reviewNumber].comments.map((comment, key) => {
        return (
          <div key={key} className='comment'>
            <div className='row'>
              <div className='col-md-3'>
                <div>
                  <label>Title: </label>
                  <p>{comment.title}</p>
                </div>
              </div>
              <div className='col-md-3'>
                <div>
                  <label>Created By: </label>
                  <p>{this.props.review.comments[key].commenter ? this.props.review.comments[key].commenter.firstName : ' '} {this.props.review.comments[key].commenter ? this.props.review.comments[key].commenter.lastName : ' '}</p>
                </div>
              </div>
              <div className='col-md-3'>
                <div>
                  <label>Date: </label>
                  <p>{comment.date}</p>
                </div>
              </div>
              <RevisionDateEdit comments={comment} />
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <label>Description</label>
                <div>{comment.description}</div>
              </div>
            </div>
          </div>
        )
      }) : <div></div>;
    } else {
      comments = null;
    }

    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={"Review # " + this.state.cardIndex + " - " + this.props.review.type}
          subtitle={"Status : " + this.props.review.status}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>

            <div className="panel-heading comm-jobs-panel-heading">{this.props.review.type} Review</div>

            <div className='row'>
              {/* <div className='col-md-6'>
                <label>Reviewed By:</label>
                <div>{this.props.review.reviewer ? this.props.review.reviewer.firstName : ' '} {this.props.review.reviewer ? this.props.review.reviewer.lastName : ' '}</div>
              </div> */}
              <div className="form-group col-md-6">
                <label htmlFor="">Reviewer</label>
                <Dropdown
                  placeholder='Reviewer'
                  value={this.props.review.reviewer ? this.props.review.reviewer.id : null}
                  fluid selection options={this.props.data.getPeople.map((reviewer, index) => {
                    return {
                      key: index,
                      text: reviewer.firstName + " " + reviewer.lastName,
                      value: reviewer.id
                    }
                  })}
                  onChange={(e, data) => {
                    for(let i=0; i < this.props.data.getPeople.length; i++) {
                      if(this.props.data.getPeople[i].id === data.value) {
                        return this.handleReviewChange('reviewer', this.props.data.getPeople[i]);
                      }
                    }


                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Start Date" id="1" value={this.props.review.startDate ? moment(this.props.review.startDate)._d : {}} onChange={(e, date) => this.handleChange('startDate', moment(date)._d)} />
              </div>
              <div className='form-group col-md-6'>
                <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="End Date" id="1" value={this.props.review.endDate ? moment(this.props.review.endDate)._d : {}} onChange={(e, date) => this.handleChange('endDate', moment(date)._d)} />
              </div>
            </div>

            <div className='row'>
              <div className="form-group col-md-6">
                <label htmlFor="">Status</label>
                <Dropdown
                  placeholder='Status'
                  fluid selection options={[
                     { key: 0, text: 'In Review', value: 'In Review',},
                     { key: 1, text: 'Approved', value: 'Approved',},
                     { key: 2, text: 'Approved with comments', value: 'Approved with comments',},
                     { key: 3, text: 'Rejected with comments', value: 'Rejected with comments',},
                   ]}
                  value={this.props.review.status}
                  onChange={(e, data) => {
                    this.handleReviewChange('status', data.value)
                  }}
                />
              </div>
              {/* <div className="form-group col-md-6">
                <div className="ui checkbox">
                  <input id="isTPR" checked={ this.props.review.isTPR } type="checkbox" onChange={() => { this.toggleCheckbox('isTPR') }}/>
                  <label htmlFor="isTPR">Is third party review?</label>
                </div>
              </div> */}
            </div>

            <div className="row">
              <div className="panel-heading comm-jobs-panel-heading">Comments</div>
              {comments}
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

const DesignReviewInfoWithData = compose(graphql(getPeopleQuery))(DesignReviewInfo)

export default DesignReviewInfoWithData;
