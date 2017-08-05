import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import client from './../../../index.js';
import LabelInput from './../../LabelInput';

import GetJobQuery from '../../../queries/GetJobQuery';

import { Dropdown } from 'semantic-ui-react';

const UpdateAddressMutation = gql`
  mutation updateAddress ($id: ID!, $belongsTo: String!, $belongsToId: ID!, $line1: String!, $line2: String, $city: String, $state: String, $zip: String!, $country: String) {
    updateAddress (id: $id, belongsTo: $belongsTo, belongsToId: $belongsToId, input: { line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip, country: $country }) {
      id
      line1
      line2
      city
      state
      zip
      country
    }
  }
`;

const AddAddressMutation = gql`
  mutation addAddressTo ($belongsTo: String!, $belongsToId: ID!, $line1: String!, $line2: String, $city: String, $state: String, $zip: String!, $country: String) {
    addAddressTo (belongsTo: $belongsTo, belongsToId: $belongsToId, input: { line1: $line1, line2: $line2, city: $city, state: $state, zip: $zip, country: $country }) {
      id
      line1
      line2
      city
      state
      zip
      country
    }
  }
`;

// const subscribeToSiteAddress = gql `
//   subscription siteAddressChange($jobId: ID) {
//     siteAddressChange(jobId: $jobId) {
//         id
//         type
//         level
//         line1
//         line2
//         city
//         state
//         zip
//         country
//     }
//   }
// `;

let cachedJobQuery;

class SiteAddress extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    if (this.props.job.address) {
      this.state = {
        addressId: this.props.job.address.id,
        line1: this.props.job.address.line1 ? this.props.job.address.line1 : '',
        line2: this.props.job.address.line2 ? this.props.job.address.line2 : '',
        city: this.props.job.address.city ? this.props.job.address.city : '',
        state: this.props.job.address.state ? this.props.job.address.state : '',
        zip: this.props.job.address.zip ? this.props.job.address.zip : '',
        country: this.props.job.address.country ? this.props.job.address.country : '',
        __typename: 'Address'
      }
    } else {
      this.state = {
        addressId: '',
        line1: '',
        line2: this.props.job.address ? this.props.job.address.line2 : '',
        city: this.props.job.address ? this.props.job.address.city : '',
        state: this.props.job.address ? this.props.job.address.state : '',
        zip: this.props.job.address ? this.props.job.address.zip : '',
        country: this.props.job.address ? this.props.job.address.country : '',
        __typename: 'Address'
      }
    }

  }

  //call subscription for the site address portion of the job query
  // componentDidMount() {
  //   const jobId = this.props.job.id;

  //   this.subscribe(jobId, GetJobQuery,this);
  // }
  // componentWillUnmount() {
  //   this.subscriptionObserver.unsubscribe();
  // }
  // //attaching a subscriptionObserver to the component

  // subscribe(jobId, updateQuery, component){
  //   this.subscriptionObserver = client.subscribe({
  //     query: subscribeToSiteAddress,
  //     variables: {
  //       jobId : jobId
  //     }
  //   }).subscribe({
  //     next(data) {
  //       console.log("observable data", data);
  //       //making a new object to keep things immutable
  //       const newState = {
  //         addressId : data.siteAddressChange.id,
  //         line1 : data.siteAddressChange.line1,
  //         line2 : data.siteAddressChange.line2,
  //         zip : data.siteAddressChange.zip,
  //         city : data.siteAddressChange.city,
  //         state : data.siteAddressChange.state,
  //         country : data.siteAddressChange.country,
  //       };
  //       component.setState(newState);
  //      },
  //     error(err) {console.error('err', err)}
  //   });
  // }

  handleBlur() {

    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    console.log('cached job query is: ', cachedJobQuery);

    if(!cachedJobQuery.job.address) {
      client.mutate({
        mutation: AddAddressMutation,
        variables: {
          belongsTo: "job",
          belongsToId: this.props.job.id,
          line1: this.state.line1,
          line2: this.state.line2,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip,
          country: this.state.country
        },
        optimisticResponse: {
          belongsTo: "job",
          belongsToId: this.props.job.id,
          line1: this.state.line1,
          line2: this.state.line2,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip,
          country: this.state.country,
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy);

          console.log('RESULT', result);

          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });
          console.log('data', data);

          //combining our original query data with mutation result
          data.job.address = result.data.addAddressTo;

          console.log('data after adding address', data);

          // Write our combined data back to the store cache
          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });

      //updating the variable after we change it
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }

    //UPDATE
    if(cachedJobQuery.job.address && (this.state.addressType !== cachedJobQuery.job.address.type || this.state.level !== cachedJobQuery.job.address.level || this.state.line1 !== cachedJobQuery.job.address.line1 || this.state.zip !== cachedJobQuery.job.address.zip || this.state.line2 !== cachedJobQuery.job.address.line2 || this.state.city !== cachedJobQuery.job.address.city || this.state.state !== cachedJobQuery.job.address.state)) {
      client.mutate({
        mutation: UpdateAddressMutation,
        variables: {
          id: cachedJobQuery.job.address ? cachedJobQuery.job.address.id : '',
          belongsTo: "job",
          belongsToId: this.props.job.id,
          line1: this.state.line1,
          line2: this.state.line2,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip,
          country: this.state.country
        },
        optimisticResponse: {
          id: this.state.addressId,
          belongsTo: "job",
          belongsToId: this.props.job.id,
          line1: this.state.line1,
          line2: this.state.line2,
          city: this.state.city,
          state: this.state.state,
          zip: this.state.zip,
          country: this.state.country,
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy);

          console.log('RESULT', result);

          // Read the data from our cache for this query.
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });
          console.log('data', data);

          //combining our original query data with mutation result
          data.job.address = result.data.updateAddress;

          console.log('data after adding address', data);

          // Write our combined data back to the store cache
          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });

      //updating the variable after we change it
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }
  }

  render() {
    console.log("STATE ", this.state.state)
    if(this.props.job.loading) {
      return (<div>Loading</div>);
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    return (
      <div>

        <div className="row">
          <LabelInput className={'col-md-6'} label='Address Line 1' name='Line 1' value={this.state.line1} placeholder='Line 1' onChange={(e) => this.setState({line1: e.target.value})} onBlur={this.handleBlur}/>
          <LabelInput className={'col-md-6'} label='Address Line 2 (optional)' name='Line 2' value={this.state.line2} placeholder='Line 2' onChange={(e) => this.setState({line2: e.target.value})} onBlur={this.handleBlur}/>
        </div>

        <div className="row">
          <LabelInput className={'col-md-6'} label='City' name='City' value={this.state.city} placeholder='City' onChange={(e) => this.setState({city: e.target.value})} onBlur={this.handleBlur}/>

          <div className="form-group col-md-3">
            <label htmlFor="">State</label>
            <Dropdown
              placeholder='Select a State'
              fluid selection options={[
                { value: "AL", text: "Alabama" },
                { value: "AK", text: "Alaska" },
                { value: "AZ", text: "Arizona" },
                { value: "AR", text: "Arkansas" },
                { value: "CA", text: "California" },
                { value: "CO", text: "Colorado" },
                { value: "CT", text: "Connecticut" },
                { value: "DE", text: "Delaware" },
                { value: "DC", text: "District Of Columbia" },
                { value: "FL", text: "Florida" },
                { value: "GA", text: "Georgia" },
                { value: "HI", text: "Hawaii" },
                { value: "ID", text: "Idaho" },
                { value: "IL", text: "Illinois" },
                { value: "IN", text: "Indiana" },
                { value: "IA", text: "Iowa" },
                { value: "KS", text: "Kansas" },
                { value: "KY", text: "Kentucky" },
                { value: "LA", text: "Louisiana" },
                { value: "ME",  text: "Maine" },
                { value: "MD", text: "Maryland" },
                { value: "MA", text: "Massachusetts" },
                { value: "MI", text: "Michigan" },
                { value: "MN", text: "Minnesota" },
                { value: "MS", text: "Mississippi" },
                { value: "MO",  text: "Missouri" },
                { value: "MT",  text: "Montana" },
                { value: "NE",  text: "Nebraska" },
                { value: "NV",  text: "Nevada" },
                { value: "NH",  text: "New Hampshire" },
                { value: "NJ",  text: "New Jersey" },
                { value: "NM",  text: "New Mexico" },
                { value: "NY",  text: "New York" },
                { value: "NC",  text: "North Carolina" },
                { value: "ND",  text: "North Dakota" },
                { value: "OH",  text: "Ohio" },
                { value: "OK",  text: "Oklahoma" },
                { value: "OR", text: "Oregon" },
                { value: "PA", text: "Pennsylvania" },
                { value: "RI", text: "Rhode Island" },
                { value: "SC", text: "South Carolina" },
                { value: "SD", text: "South Dakota" },
                { value: "TN", text: "Tennessee" },
                { value: "TX", text: "Texas" },
                { value: "UT", text: "Utah" },
                { value: "VT", text: "Vermont" },
                { value: "VA", text: "Virginia" },
                { value: "WA", text: "Washington" },
                { value: "WV", text: "West Virginia" },
                { value: "WI", text: "Wisconsin" },
                { value: "WY", text: "Wyoming" },
                { value: "AS", text: "American Samoa" },
                { value: "GU", text: "Guam" },
                { value: "MP", text: "Northern Mariana Islands" },
                { value: "PR", text: "Puerto Rico" },
                { value: "UM", text: "United States Minor Outlying Islands" },
                { value: "VI", text: "Virgin Islands" },
                { value: "AA", text: "Armed Forces Americas" },
                { value: "AP", text: "Armed Forces Pacific" },
                { value: "AE", text: "Armed Forces Others" },
               ]}
              value={this.state.state}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data)
                this.setState({ state: data.value }, this.handleBlur)
              }}
            />
          </div>

          <div className="form-group col-md-3">
            <label htmlFor="">Zip</label>
            <input
              name='Zip'
              className="form-control"
              value={this.state.zip}
              placeholder='Zip'
              onChange={(e) => this.setState({zip: e.target.value})}
              onBlur={this.handleBlur}
            />
          </div>

        </div>

        <div className="row">
          <p className="googleMapsLink">
            <a target="_blank" href={`https://www.google.com/maps/place/${this.state.line1 + ", " + this.state.zip}`}><font color="61385F">Google Maps</font></a>
          </p>
        </div>

      </div>
    )
  }
}


const SiteAddressWithMutations =
compose(
  graphql(UpdateAddressMutation),
)(withRouter(SiteAddress));

export default SiteAddressWithMutations;
