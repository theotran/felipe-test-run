

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown } from 'semantic-ui-react';

const getStripeCustomer = gql`
  query {
    company{
      id
      account {
        id
        stripe
      }
    }
  }
`;

class CreditCardDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.stripeCustomer ? this.props.stripeCustomer.default_source : '',
      number: '',
      name: '',
      exp: '',
      cvc: '',
      focused: '',
    };
  }
  render() {
    console.log(this.props);
    if(this.props.data.loading){
      return <div>Loading</div>;
    }
    if(this.props.data.error){
      return <div>Error</div>;
    }
    return (
      <div className='form-group col-md-6'>
        {/*<label htmlFor="">Credit Cards</label>*/}
        <Dropdown
          placeholder='Credit Card'
          fluid selection options={this.props.stripeCustomer.sources.data.map((card, index) => {
            return {
              key: card.id,
              text: card.brand + " -" + card.last4 + "  EXP: " + card.exp_month + "/" + card.exp_year,
              value: card.id,
              icon: card.brand.toLowerCase()
            }
          })}
          value={this.state.id}
          onChange={(e, data) => {
            console.log(data)
            this.setState({
              id: data.value,
            }, ()=>{
              this.props.onSelect(data.value);
            });
          }}
        />
      </div>
    )
  }
}

const CreditCardDropdownWithQueries = compose(
  graphql(getStripeCustomer)
)(CreditCardDropdown)

export default CreditCardDropdownWithQueries;
