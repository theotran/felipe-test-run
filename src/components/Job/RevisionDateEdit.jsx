// Takes in comment (specific mapped comment)
import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import gql from 'graphql-tag';

const UpdateCommentMutation = gql`
  mutation updateComment( $id: ID, $belongsToId: ID, $revisionDate: DateTime ) {
    updateComment(input: { id: $id, belongsToId: $belongsToId, revisionDate: $revisionDate }) {
  		id
	    revisionDate
    }
  }
`;

class RevisionDateEdit extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)

    this.state = {
      revisionDate: this.props.comments ? this.props.comments.revisionDate : null
    }
  }

  setRevisionDate() {
    this.props.updateComment({
      variables: {
        id: this.props.comments.id,
        revisionDate: this.state.revisionDate
      }
    })
  }

  render() {
    return (
      <div className='col-md-3'>
        <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Revision Date" value={this.state.revisionDate ? moment(this.state.revisionDate)._d : {}} onChange={(e, date) => this.setState({ revisionDate: moment(date)._d}, this.setRevisionDate)} />
      </div>
    )
  }
}

const RevisionDateEditWithDate = compose( graphql(UpdateCommentMutation, { name: 'updateComment' }) )(RevisionDateEdit)

export default RevisionDateEditWithDate;
