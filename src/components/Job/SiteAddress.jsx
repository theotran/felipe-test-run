import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import client from './../../index.js';

const GetJobQuery = gql`
  query {
    job (id: $id) {
      id
      name
      number
      type
      status
      pm {
        id
        firstName
        lastName
      }
      address {
        id
        type
        level
        line1
        zip
      }
    }
  }
`;

const CreateOrUpdateAddressMutation = gql`
  mutation createOrUpdateJobAddress($jobId: ID!, $addressId: ID, $type: String!, $level: String!, $line1: String!, $zip: String!) {
    createOrUpdateJobAddress (jobId: $jobId, addressId: $addressId, input: {type: $type, level: $level, line1: $line1, zip: $zip} ) {
      id
      __typename
      type
      level
      line1
      zip
    }
  }
`;


let SiteAddress = React.createClass({
  getInitialState() {
    if (this.props.job.address) {
      return {
        addressId: this.props.job.address.id,
        addressType: this.props.job.address.type,
        level: this.props.job.address.level,
        line1: this.props.job.address.line1,
        zip: this.props.job.address.zip
      }
    } else {
      return {
        addressId: null,
        addressType: '',
        level: '',
        line1: '',
        zip: '',
        __typename: 'Address'
      }
    }
  },

  componentWillUpdate(nextProps, nextState) {
    console.log(nextState)
  },

  handleBlur() {
    console.log(this.state);
    console.log("STATE ADDRESS -->>> ", this.state.addressId);
      console.log("No address id, creating a new one");
      console.log("client--->>> ", client);
       const cachedJobQuery = client.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          }
        });
      console.log(cachedJobQuery);
      if(!cachedJobQuery.job.address || (this.state.addressType !== cachedJobQuery.job.address.type || this.state.level !== cachedJobQuery.job.address.level || this.state.line1 !== cachedJobQuery.job.address.line1 || this.state.zip !== cachedJobQuery.job.address.zip)){
        client.mutate({
          mutation: CreateOrUpdateAddressMutation,
          variables: {
            jobId: this.props.job.id,
            addressId: cachedJobQuery.job.address ? cachedJobQuery.job.address.id : null,
            type: this.state.addressType, 
            level: this.state.level, 
            line1: this.state.line1, 
            zip: this.state.zip
          },
          optimisticResponse: {
            id: this.state.addressId,
            type: this.state.addressType,
            level: this.state.level,
            line1: this.state.line1,
            zip: this.state.zip
          },
          update: (proxy, result) => {
            console.log('PROXY', proxy);

            console.log('result', result);
            // Read the data from our cache for this query.
            const data = proxy.readQuery({ 
              query: GetJobQuery,
              variables: {
                id: this.props.job.id
              }
            });
            console.log('data', data);
            // Add our todo from the mutation to the end.
            data.job.address = result.data.createOrUpdateJobAddress;
            // data.job.address = createOrUpdateAddress;

            console.log('data after adding address', data);
            // Write our data back to the cache.
            proxy.writeQuery({ 
              query: GetJobQuery, 
              variables: {
                id: this.props.job.id
              }, 
              data 
            });
          },
        }); 
      }
  },

  render() {
    // console.log(this.props.params)
    if(this.props.job.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    return (
      <div className="form-group">

        <div className="mdl-textfield mdl-js-textfield">
          <label>Address Type</label>
          <input
            name='AddressType'
            className='mdl-textfield__input'
            value={this.state.addressType}
            placeholder='Address Type'
            onChange={(e) => this.setState({addressType: e.target.value})}
            onBlur={this.handleBlur}
          />
          <label className="mdl-textfield__label" htmlFor=""></label>
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <label>Level</label>
          <input
            name='level'
            className='mdl-textfield__input'
            value={this.state.level}
            placeholder='Level'
            onChange={(e) => this.setState({level: e.target.value})}
            onBlur={this.handleBlur}
          />
          <label className="mdl-textfield__label" htmlFor=""></label>
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <label>Line 1</label>
          <input
            name='Line 1'
            className='mdl-textfield__input'
            value={this.state.line1}
            placeholder='Line 1'
            onChange={(e) => this.setState({line1: e.target.value})}
            onBlur={this.handleBlur}
          />
          <label className="mdl-textfield__label" htmlFor=""></label>
        </div>

        <div className="mdl-textfield mdl-js-textfield">
          <label>Zip</label>
          <input
            name='Zip'
            className='mdl-textfield__input'
            value={this.state.zip}
            placeholder='Zip'
            onChange={(e) => this.setState({zip: e.target.value})}
            onBlur={this.handleBlur}
          />
          <label className="mdl-textfield__label" htmlFor=""></label>
        </div>

      </div>  
    )
  } 
})

 
const SiteAddressWithMutations = 
compose(
  graphql(CreateOrUpdateAddressMutation, {
    name: 'AddressUpdateMutation',
  }),
)(withRouter(SiteAddress));

export default SiteAddressWithMutations;