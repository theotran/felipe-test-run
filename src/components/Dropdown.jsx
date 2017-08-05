import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
class Dropdown extends React.Component{
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
      value: this.props.defaultVal ? this.props.defaultVal : null
    }
  }
  handleChange(event, key, value) {
    if(this.props.changeHandler){
    console.log("handleChange in Dropdown", event, key, value);
      this.props.changeHandler(value, key);
    }
  }
  render() {
    console.log(this);
    let MenuItems;
    let defaultVal;
    if(this.props.data && this.props.data[this.props.queryName]){
      MenuItems = this.props.data[this.props.queryName].map(item => {
        let text = '';
        for(let i=0; i<this.props.fields.length; i++){
          i === 0 ? text+= item[this.props.fields[i]] : text+= '' + item[this.props.fields[i]];
        }
        if(this.props.defaultId === item.id){
          defaultVal = item;
        }
        return <MenuItem value={item} key={item.id} primaryText={text} />
      })
    } else {
      if(this.props.menuItems){
        console.log("Dropdown has menuItems");
        MenuItems = this.props.menuItems.map((item, index, array) => {
          return <MenuItem value={item.id} key={index} primaryText={item.model} />
        })
      }
    }
    return (
        <div className={this.props.className}>
          <SelectField
           floatingLabelText={this.props.label}
           floatingLabelFixed={true}
           value={this.state.value ? this.state.value : defaultVal}
           onChange={(event, key, value) => {this.setState({value: value},this.handleChange(event,key,value))}}
          >
            {MenuItems}
          </SelectField>
        </div>
    )
  }
}

export default Dropdown;
