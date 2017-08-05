import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import {StripeProvider} from 'react-stripe-elements';
import PaymentBox from './PaymentBox';
import scriptLoader from 'react-async-script-loader';

import { Image } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';

import AddPlanModal from './AddPlanModal';

const submitStripeTokenMutation = gql`
  mutation submitStripeToken ($token: String) {
    submitStripeToken (input: {token: $token}) {
      success
      message
      field
    }
  }
`;


class PaymentPage extends Component {
  constructor(props) {
    super(props);

  }
 componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initPaymentPage();
        console.log("STRIPE LOAD SUCCEEDED willRecieve");
      }
      else this.props.onError()
    }
  }
  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initPaymentPage()
      console.log("STRIPE LOAD SUCCEEDED didMount");
    }
  }

  render(){
    console.log("PAYMENT PAGE", this);
    const formStyle = {
      width: '100%'
    }

    return (
      <div id="PaymentPageId">
        <div className="row">
          <Image centered size="massive" src='images/RyionPricesheet.svg' />
        </div>
        <StripeProvider apiKey="pk_test_0KsddA5DIdYOuDzZ4id12DOi" style={formStyle}>
          <PaymentBox style={formStyle}/>
        </StripeProvider>
      </div>
    )
  };
}

const PaymentPageWithMutation = graphql(submitStripeTokenMutation)(PaymentPage);

export default PaymentPageWithMutation;
