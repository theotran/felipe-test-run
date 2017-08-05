import React, { Component } from 'react';

class TextInput extends Component {
  constructor(props) {
    super(props);

    state = {
      currentValue: this.props.children
    }
  }

  render() {
    return (
      <textarea name="body"
        onChange={(e) => { this.setState({ currentValue: e.target.value })}}
        value={this.state.currentValue} /> 
    )
  }
}

export default TextInput;