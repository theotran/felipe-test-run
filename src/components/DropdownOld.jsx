import React from 'react';
// import { graphql, compose } from 'react-apollo';
// import gql from 'graphql-tag';
class Dropdown extends React.Component{
  constructor(props){
    super(props);
    console.log(props);
    // if(this.props.defaultOption){
      this.state = {
          defaultValue: this.props.defaultOption ? this.props.defaultOption : null
      }
    // }
  }
  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    console.log(nextProps.defaultValue);
    if(nextProps.defaultValue){
      this.setState({defaultValue: nextProps.defaultValue}, ()=> console.log(this.state) )
    }
  }
  render() {
    console.log(this);
    let selectItems;
    let defaultOption;
    if(this.props.selectItems){
      selectItems = this.props.selectItems.map((item, index)=>{
        if(index === 2){
          return <option key={index} defaultValue>{item}</option>
        } else {
          return <option key={index}>{item}</option>
        }
      });
    } else {
      console.log("no select items", this.props);
      selectItems = null;
    }
    if(this.props.defaultOption){
      console.log("has default option");
      defaultOption = this.props.defaultOption;
    } else {
      defaultOption = null;
    }
    return(
      <div className={"form-group " + this.props.className}>
        <label htmlFor="">{this.props.label}</label>
        <select className="form-control" defaultValue={this.state.defaultValue}>
          {selectItems}
        </select>
      </div>
    )
  }
}

export default Dropdown;