import React, {Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LabelInput from './../../LabelInput';
import client from './../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';
import QuoteItem from './QuoteItem';

class ItemSet extends Component {
  constructor(props) {
    super(props);

    console.log(this.props)

    this.state = {
      itemSet: this.props.quote ? this.props.quote.itemSet : []
    }
  }

  render() {
    let quoteItem = this.state.itemSet.items.map((item, index) => {
      // console.log(item)
      return (<QuoteItem item={item} key={index} job={this.props.job} itemSet={this.state.itemSet} itemIndex={index} quoteKey={this.props.quoteKey} quoteId={this.props.quote.id} />)
    })
    return (
      <div>

        {quoteItem}
      </div>
    )
  }
}

export default ItemSet;
