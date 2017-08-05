import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class AddPerson extends Component {
  state = {
    firstName: '',
    lastName: ''
  }

  render() {
    return (

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Modal Header</h4>
            </div>
            <div className="modal-body">
            
            <div>
              <input
                className=''
                value={this.state.firstName}
                onChange={(e) => this.setState({firstName: e.target.value})}
              />
              <input
                className=''
                value={this.state.lastName}
                onChange={(e) => this.setState({lastName: e.target.value})}
              />
            </div>
              
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button className="btn btn-default" onClick={this.handleSave} data-dismiss="modal">Save</button>
            </div>
          </div>

        </div>
      </div>
    )
  }


  // canSave = () => {
  //   return this.state.firstName && this.state.lastName;
  // }

  handleSave = () => {
    const {firstName, lastName} = this.state;

    this.props.mutate({variables: {firstName, lastName}})
      .then(() => {
        //this.props.router.replace('/')
      })
  }

  handleCancel = () => {
    this.props.router.replace('/')
  }
}




const createPersonMutation = gql`
  mutation createPerson($firstName: String!, $lastName: String!) {
    createPerson(input: {firstName: $firstName, lastName: $lastName}) {
      id
      firstName
      lastName
      getPeople {
        id
      }
    }
  }
`

const AddPersonWithMutation = graphql(createPersonMutation)(withRouter(AddPerson));

export default AddPersonWithMutation;





