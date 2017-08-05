import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
 
import PMSelect from './PMSelect';
import SiteAddress from './SiteAddress';

let SiteTab = React.createClass({

  getInitialState() {
    return {
      name: this.props.job.name,
      number: this.props.job.number,
      type: this.props.job.type,
      status: this.props.job.status,
    }
  },


  handleBlur() {
    if (this.props.job.name !== this.state.name || this.props.job.number !== this.state.number || this.props.job.type !== this.state.type || this.props.job.status !== this.state.status){
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
  },

  componentWillUpdate(nextProps, nextState) {
    //console.log(nextState)
  },

  render() {
    if(this.props.job.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    return (

      <div className="panel panel-default">
        <div className="panel-heading">Job Site Info</div>
        <div className="panel-body">

            <div className="form-group">
              <div className="mdl-textfield mdl-js-textfield">
                <label>Name</label>
                <input
                  name='Name'
                  className='mdl-textfield__input'
                  value={this.state.name}
                  placeholder='Name'
                  onChange={(e) => this.setState({name: e.target.value})}
                  onBlur={this.handleBlur}
                />
                <label className="mdl-textfield__label" htmlFor=""></label>
              </div>

              <div className="mdl-textfield mdl-js-textfield">
                <label>Number</label>
                <input
                  name='Number'
                  className='mdl-textfield__input'
                  value={this.state.number}
                  placeholder='Number'
                  onChange={(e) => this.setState({number: e.target.value})}
                  onBlur={this.handleBlur}
                />
                <label className="mdl-textfield__label" htmlFor=""></label>
              </div>
            </div>

            <div className="form-group"> 
              <label htmlFor="">Type</label>
              <select value={this.state.type} onChange={(e) => this.setState({type: e.target.value})} onBlur={this.handleBlur} className="form-control">
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="utility">Utility</option>
              </select>
            </div>

            <div className="form-group"> 
              <label htmlFor="">Status</label>
              <select value={this.state.status} onChange={(e) => this.setState({status: e.target.value})} onBlur={this.handleBlur} className="form-control">
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="on-hold">On-Hold</option>
                <option value="cancelled">Cancelled</option>
                <option value="complete">Complete</option>
                <option value="as-built">As-Built</option>
              </select>
            </div>

            <PMSelect job={this.props.job} pm={this.props.pm}/>

            <SiteAddress job={this.props.job} address={this.props.address}/>


        </div> 
      </div>

    
    )
  } 
});

const UpdateJobMutation = gql`
  mutation updateJob($id: ID!, $name: String!, $number: String!, $type: String!, $status: String!) {
    updateJob (id: $id, input: {name: $name, number: $number, type: $type, status: $status}) {
      id
      name
      number
      type
      status
    }
  }
`;



const SiteTabWithMutation = compose(
  graphql(UpdateJobMutation, { 
    name: 'JobUpdateMutation',//naming the mutation so you can call it  
    options: { 
      fetchPolicy: 'cache-and-network'
    } 
  })
)(withRouter(SiteTab));

export default SiteTabWithMutation;











