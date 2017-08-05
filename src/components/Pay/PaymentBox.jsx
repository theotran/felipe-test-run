import React from 'react';
import {Elements} from 'react-stripe-elements';

import PaymentForm from './PaymentForm';

// const stripe = stripe('pk_test_0KsddA5DIdYOuDzZ4id12DOi');

class PaymentBox extends React.Component {
  render() {
  	const formStyle = {
      width: '200px'
    }
    return (
      <Elements style={formStyle}>
        <PaymentForm style={formStyle}/>
      </Elements>
    );
  }
}

export default PaymentBox;
