import React, { Component } from 'react';
import LabelInput from './../../LabelInput';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import { Button } from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import AddQuoteModal from './AddQuoteModal';
import QuoteItem from './QuoteItem';
import client from './../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';

import { Dropdown } from 'semantic-ui-react';

const UpdateItemSetMutation = gql`
  mutation updateItemSet($id: ID, $percentMarkup: Float) {
    updateItemSet(input: {
      id: $id, percentMarkup: $percentMarkup
    }) {
      id
      percentMarkup
    }
  }
`;

const CreateQuoteItemMutation = gql`
  mutation createItem( $type: String, $count: Float, $costPer: Float, $ItemSetId: ID, $description: String, $unit: String ) {
    createItem(input: { type: $type, count: $count, costPer: $costPer, ItemSetId: $ItemSetId, description: $description, unit: $unit }) {
      id
      type
      description
      count
      unit
      costPer
    }
  }
`;

const UpdateQuoteItemMutation = gql`
  mutation updateItem( $id: ID, $type: String, $count: Float, $costPer: Float, $description: String, $unit: String ) {
    updateItem(input: { id: $id, type: $type, count: $count, costPer: $costPer, description: $description, unit: $unit }) {
      id
      type
      description
      count
      unit
      costPer
    }
  }
`;

class QuoteTab extends Component {
  constructor(props) {
    super(props);

    this.addQuoteItem = this.addQuoteItem.bind(this);
    this.applyMarkup = this.applyMarkup.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);

    this.state = {
      itemSet: this.props.job.quotes[0] ? this.props.job.quotes[0].itemSet : {
        items: []
      },
      quoteNumber: this.props.job.quotes[0] ? 0 : null,
      quotes: this.props.job ? this.props.job.quotes : [],
      selected: this.props.job.quotes[0] ? this.props.job.quotes[0].id : '',
      quote: this.props.job.quotes[0] ? this.props.job.quotes[0] : {},
      totalAmount: this.props.job.quotes[0] ? this.props.job.quotes[0].itemSet.items.reduce((a, v, i) => {
        return (v.count * v.costPer) + a
      },0) : null,
      percentMarkup: this.props.job.quotes[0] ? this.props.job.quotes[0].itemSet.percentMarkup : null,
      totalAmountWMarkup: null,
    };
  }

  addQuoteItem(){
    let newItem = [{
      itemSetId: this.state.itemSet.id,
      type: '',
      description: '',
      count: 0,
      unit: ''
    }];
    let newItemState;
    newItemState = update(this.state, {
      quote: { itemSet: { items: {$push: newItem}}},
      quotes: { [this.state.quoteNumber]: { itemSet: { items: {$push: newItem}}}}
    });
    this.setState(newItemState, this.handleAddItem)
    console.log('add item', this.state)
  }

  handleAddItem() {
    console.log('item added')
    console.log("handleBlur from System Tab", this.state.itemSet.id);
    let cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    console.log(cachedJobQuery);
    console.log("onBlur new made", this);
    client.mutate({
      mutation: CreateQuoteItemMutation,
      variables: {
        id: '',
        type: this.state.type,
        count: this.state.count,
        ItemSetId: this.state.itemSet.id,
        description: this.state.description,
        unit: this.state.unit,
        costPer: this.state.costPer,
      },
      update: (proxy, result) => {
        console.log('Proxy',proxy)
        console.log('Result', result);

        const data = proxy.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          }
        });

        console.log('data', data);
        console.log('onBlur result', result);
        console.log(data.job.quotes[this.state.quoteNumber].itemSet.items.length)
        data.job.quotes[this.state.quoteNumber].itemSet.items[data.job.quotes[this.state.quoteNumber].itemSet.items.length] = result.data.createItem;

        console.log('data after adding data', data);
        console.log('result after adding data', result);

        proxy.writeQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
          },
          data
        });
      }
    });
    // end client.mutate
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    })
    console.log(cachedJobQuery)
  }

  returnToSiteTab = () => {
    browserHistory.push(`/commercial/project/${this.props.job.id}/site` );
  }

  applyMarkup() {
    let markupAmount = this.state.percentMarkup * this.state.totalAmount
    this.setState({totalAmountWMarkup: this.state.totalAmount + markupAmount})
    this.handleBlur()
  }

  handleBlur() {
    console.log('changeing')
    console.log("handleBlur from System Tab", this);
    let cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    let cachedMarkupInfo = cachedJobQuery.job.quotes[this.state.quoteNumber].itemSet

    if (cachedMarkupInfo !== this.state.markup) {
      client.mutate({
        mutation: UpdateItemSetMutation,
        variables: {
          id: this.state.itemSet.id,
          percentMarkup: this.state.percentMarkup
        },
        update: (proxy, result) => {
          console.log(proxy)
          console.log(result)

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          data.job.quotes[this.props.quoteIndex] = result.data.updateItemSet;

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });

      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }
  }

  handleItemChange(key, value, index) {
    console.log(key, value, index)
    console.log(this.state)
    let newData = update(this.state, {
      quote: { itemSet: { items: { [index]: { [key]: { $set: value }}}}},
      quotes: { [this.state.quoteNumber]: { itemSet: { items: { [index]: { [key]: { $set: value }}}}}}
    });
    //triggering these elements by default because they're not actual onBlur inputs, this is how we invoke handleBlur on whatever action it was
    console.log('asdfasdf')
    this.setState(newData, () => {
      this.handleItemBlur(this.state.quote.itemSet.items[index], index, key);
    })
  }

  handleItemBlur(quote, index, key) {
    console.log('qerqwerqewrew')
    let cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    let cachedQuoteInfo =  cachedJobQuery.job.quotes[this.state.quoteNumber].itemSet.items[index]
    console.log(cachedQuoteInfo)
    if(this.state.count !== null && this.state.costPer !== null) {

      let totalArray = []; cachedJobQuery.job.quotes[this.state.quoteNumber].itemSet.items.map((item, index) => {
        return totalArray.push(item.count * item.costPer)
      })
      let totalReduced = totalArray.reduce((x, y) => x + y)

      this.setState({
        total: this.state.count * this.state.costPer,
        totalAmount: totalReduced
      })
    }

    if (!cachedQuoteInfo) {
      client.mutate({
        mutation: CreateQuoteItemMutation,
        variables: {
          id: '',
          type: this.state.type,
          count: this.state.count,
          ItemSetId: this.props.itemSetId,
          description: this.state.description,
          unit: this.state.unit,
          costPer: this.state.costPer,
        },

        update: (proxy, result) => {
          console.log('Proxy',proxy)
          console.log('Result', result);

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          console.log('data', data);
          console.log('onBlur result', result);

          data.job.quotes[this.state.quoteNumber].itemSet.items[index] = result.data.createItem;

          console.log('data after adding data', data);
          console.log('result after adding data', result);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      // end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.JobId
        }
      });
    } else if (cachedQuoteInfo['key'] !== this.state.quote.itemSet.items[index][key] ) {
      client.mutate({
        mutation: UpdateQuoteItemMutation,
        variables: {
          id: cachedQuoteInfo.id,
          type: quote.type,
          count: quote.count,
          costPer: quote.costPer,
          description: '',
          unit: ''
        },
        update: (proxy, result) => {
          console.log('Proxy',proxy)
          console.log('Result', result);

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          console.log('data', data.job.quotes[this.state.quoteNumber].itemSet.items[index]);
          console.log('onBlur result', result);

          // if('updateItem' in result.data){
            data.job.quotes[this.state.quoteNumber].itemSet.items[index] = result.data.updateItem;
          // } else {
          //   data.job.quotes[this.props.quoteIndex].itemSet.items[this.props.itemIndex] = result.data;
          // }

          console.log('data after adding data', data);
          console.log('result after adding data', result);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      // end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }
  }

  render() {
    console.log("QUOTES", this);
    // let quotes = this.state.quotes.map((quote, index) => {
    //   return (<MenuItem value={quote.id} key={index} primaryText={quote.name}  />);
    // });

    let items = null;
    if('itemSet' in this.state.quote) {
      items = this.state.quote.itemSet.items.map((item, index) => {
        return (
          <QuoteItem key={index} quoteIndex={this.state.quoteNumber} itemIndex={index}  item={item} job={this.props.job} itemSetId={this.state.itemSet.id} updateTotalQuoteAmt={this.updateTotalQuoteAmt} handleItemChange={this.handleItemChange} />
        )
      })
    };

    if(this.state.percentMarkup !== null && this.state.totalAmount !== null) {
      // ((this.state.percentMarkup * this.state.totalAmount) + this.state.totalAmount)
      this.state.totalAmountWMarkup = ((this.state.percentMarkup * this.state.totalAmount) + this.state.totalAmount)
    }

    let quoteDisplay;
    if (this.state.quotes.length === 0) {
      quoteDisplay = <div className='row'><br />There are no Quotes! <br /> Please create a quote by clicking the button above!</div>
    } else {
      quoteDisplay =
      <div>
        <div className='row'>
          <Button color="teal" content='ADD ITEM' icon='plus' labelPosition='left' onClick={this.addQuoteItem} />
        </div>

        <div className='row form-group'>
          <LabelInput className="col-md-6"
            label='Total Markup (Decimal Value)'
            name='Total Markup (Decimal Value)'
            value={this.state.percentMarkup}
            type='number'
            placeholder='Total Markup'
            onChange={(e) => this.setState({percentMarkup: e.target.value})}
            onBlur={this.applyMarkup}
          />
          <LabelInput className="col-md-6"
            label='Total Quote Amount'
            name='Total Quote Amount'
            value={this.state.totalAmount}
            placeholder='0.00'
            readOnly
          />
        </div>
        <div className='row form-group'>
          <div className='col-md-6'></div>
          <LabelInput className="col-md-6"
            label='Total Quote Amount w/ Markup'
            name='Total Quote Amount w/ Markup'
            value={this.state.totalAmountWMarkup}
            placeholder='0.00'
            readOnly
          />
        </div>
      </div>
    }

    let quoteDropdown;
    if (this.state.quotes.length !== 0) {
      quoteDropdown =
      <div>
      <div className='col-md-3'>
        <Dropdown
          placeholder='Quotes'
          fluid selection options={this.state.quotes.map((quote, index) => {
            return {
              key: index,
              text: quote.name,
              value: quote.id
            }
          })}
          value={this.state.selected}
          onChange={(e, data) => {
            console.log("VALUE IN DROPDOWN ", this.state)
            for (let i=0; i < this.state.quotes.length; i++) {
              if (this.state.quotes[i].id === data.value) {
                this.setState({
                  quoteNumber: i,
                  itemSet: this.props.job.quotes[i] ? this.props.job.quotes[i].itemSet : {
                    items: []
                  },
                  selected: data.value,
                  quote: this.props.job.quotes[i],
                  // totalAmount: this.props.job.quotes[i] ? this.props.job.quotes[i].itemSet.items.reduce((a, v, i) => {
                  //   return (v.count * v.costPer) + a
                  // }) : null,
                  totalAmount: '',
                  percentMarkup: this.props.job.quotes[i] ? this.props.job.quotes[i].itemSet.percentMarkup : null,
                  totalAmountWMarkup: this.props.job.quotes[i] ? this.props.job.quotes[i].itemSet.items.reduce((a, v, i) => {
                    let markupTotal = ((v.count * v.costPer) + a) * this.props.job.quotes[i].itemSet.percentMarkup
                    return (v.count * v.costPer) + a + markupTotal
                  }, 0) : null
                })
              }
            }
          }}
        />
      </div>
      <div className='col-md-1'></div>
      </div>
    }

    return (
      <div className="panel panel-default">
        <div className='panel-body'>
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">QUOTES</h4>
              <img className="tabHeaderLogo" role="presentation" src='/images/Site_Icon_p.svg' height="30"/>
            </div>
          </div>
          <div className='row'>
            {quoteDropdown}
            <div className='col-md-3'>
              <AddQuoteModal JobId={this.props.job.id}/>
            </div>
            <Button color="teal" content='Return to Site' icon='chevron left' labelPosition='left' onClick={this.returnToSiteTab} />
          </div>
          {items}
          {quoteDisplay}
        </div>
      </div>
    );
  }
}

const UpdateItemSetWithMutation = graphql(UpdateItemSetMutation)(QuoteTab);

export default UpdateItemSetWithMutation;
