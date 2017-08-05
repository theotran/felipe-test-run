import React, { Component } from 'react';
import moment from 'moment';
import RevisionDateEdit from './RevisionDateEdit';

class ViewComments extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    console.log(this.props.mapOver)
    // mapOver passed in will be the array of comments
    const comments = this.props.mapOver.map((comment, key) => {
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
                <p>{comment.commenter ? comment.commenter.firstName : ' '} {comment.commenter ? comment.commenter.lastName : ' '}</p>
              </div>
            </div>
            <div className='col-md-3'>
              <div>
                <label>Date: </label>
                <p>{moment(comment.date).format('lll')}</p>
              </div>
            </div>
            <RevisionDateEdit comment={comment}/>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <label>Description</label>
              <div>{comment.description}</div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className='panel-body'>
        <div className="panel panel-default">
          {comments}
        </div>
      </div>
    )
  }
}

export default ViewComments;
