

import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';

import Payment from 'payment';
import Cards from 'react-credit-cards';
import 'react-credit-cards/lib/styles.scss';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {CardNumberElement} from 'react-stripe-elements';

//Theos
import {CardExpiryElement, CardCVCElement, PostalCodeElement} from 'react-stripe-elements';

class CreditCardComponent extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);

    this.state = {
      id: '',
      number: '',
      name: '',
      exp: '',
      cvc: '',
      focused: '',
    };
  }

  componentDidMount() {
    Payment.formatCardNumber(document.querySelector('[name="number"]'));
    Payment.formatCardExpiry(document.querySelector('[name="expiry"]'));
    Payment.formatCardCVC(document.querySelector('[name="cvc"]'));
  }

  handleInputFocus = (name) => {
    // const target = e.target;
    // console.log(target.name);
    // this.setState({
    //   focused: target.name,
    // });

    this.setState({
      focused: name,
    });
  };

  handleInputChange = (e) => {
    const target = e.target;

    if (target.name === 'number') {
      this.setState({
        [target.name]: target.value.replace(/ /g, ''),
      });
    }
    else if (target.name === 'expiry') {
      this.setState({
        [target.name]: target.value.replace(/ |\//g, ''),
      });
    }
    else {
      this.setState({
        [target.name]: target.value,
      });
    }
  };

  handleCallback(type, isValid) {
    console.log(type, isValid); //eslint-disable-line no-console
  }

  render() {
    const { name, number, expiry, cvc, focused } = this.state;
    return (
      <div className="rccs__demo">
        {/*<h3>Credit Cards</h3>*/}
        <div className="rccs__demo__content">
          <Cards
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focused}
            callback={this.handleCallback}
          />

            <div className="ccInputArea">
              <div>
                  <input
                    className="field"
                    type="tel"
                    name="number"
                    placeholder="Card Number"
                    onKeyUp={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                  {/*<CardNumberElement onChange={(obj,e,v)=>{console.log(obj,e,v)}} onFocus={(e) => {this.handleInputFocus('number')}}/>*/}
              </div>
              <div>
                <input
                  className="field"
                  type="text"
                  name="name"
                  placeholder="Name"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div>
                {/* <input
                  className="field"
                  type="tel"
                  name="expiry"
                  placeholder="Valid Thru"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                /> */}
                <CardExpiryElement onChange={this.handleInputChange} onFocus={this.handleInputFocus}/>
                {/* <input
                  className="field"
                  type="tel"
                  name="cvc"
                  placeholder="CVC"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                /> */}
                <CardCVCElement onChange={this.handleInputChange} onFocus={this.handleInputFocus} />
              </div>
            </div>

        </div>
      </div>
    );
  }
}


export default CreditCardComponent;
