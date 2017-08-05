import React, {Component} from 'react';
import LabelInput from './../../LabelInput';

class QuoteItem extends Component {
  constructor(props) {
    super(props);

    this.handleItemChange = this.handleItemChange.bind(this);

    this.state = {
      id: '',
      type: this.props.item ? this.props.item.type : '',
      count: this.props.item ? this.props.item.count : null,
      costPer: this.props.item ? this.props.item.costPer : null,
      description: '',
      unit: '',
      itemIndex: this.props.itemIndex,
      total: this.props.item ? this.props.item.count * this.props.item.costPer : null,
      itemSet: this.props.itemSet ? this.props.itemSet : []
    }
  }

  handleItemChange(key, value) {
    if(this.props.item.count !== null && this.props.item.costPer !== null) {
      this.setState({total: this.props.item.count * this.props.item.costPer})
    }
    this.props.handleItemChange(key, value, this.state.itemIndex);
  }

  render() {

    return (
      <div>
        <div className='row form-group'>
          <LabelInput className="col-md-6"
            label='Item'
            name='Item'
            value={this.props.item.type}
            placeholder='Item'
            onChange={(e) => {
              this.handleItemChange('type', e.target.value)
            }}
          />
          <LabelInput className="col-md-3"
            label='Count'
            name='Count'
            value={this.props.item.count}
            placeholder='Count'
            onChange={(e) => {
              this.handleItemChange('count', e.target.value)
            }}
          />
          <LabelInput className="col-md-3"
            label='Cost'
            name='Cost'
            value={this.props.item.costPer}
            placeholder='Cost'
            onChange={(e) => {
              this.handleItemChange('costPer', e.target.value)
            }}
          />
        </div>
        <div className='row form-group'>
          <LabelInput className="col-md-6"
            label='Total'
            name='Total'
            value={this.props.item.count * this.props.item.costPer}
            placeholder='0.00'
            readOnly
          />
        </div>
      </div>
    )
  }
}

export default QuoteItem;
