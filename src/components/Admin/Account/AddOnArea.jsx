import React, { Component } from 'react';
// import { graphql, compose } from 'react-apollo';
// import gql from 'graphql-tag';
// import { browserHistory } from 'react-router';
// import { Dropdown } from 'semantic-ui-react';


class AddOnArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      number: '',
      name: '',
      exp: '',
      cvc: '',
      focused: '',
    };
  }
  render() {
    console.log(this.props);
    return (
      <div>
        "Add-on area"
      </div>
    )
  }
}



export default AddOnArea;