import React from 'react';
import { graphql } from 'react-apollo';

function withSelectQuery(Component, Query, queryName, fields) {
  // ...and returns another component...
  class DropdownWithQuery extends React.Component {
    constructor(props) {
      super(props);
      console.log(this); 
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        defaultOption: this.props.defaultOption,
        defaultId: this.props.defaultId
      };
    }
    handleChange() {
      // this.setState({
      //   data: selectData(DataSource, this.props)
      // });
    }

    render() {
      console.log(this);
      let selectItems;
      let defaultOption = this.state.defaultOption;
      console.log("defaultOption", defaultOption);

      if(this.props.data && this.props.data[queryName]){
        let selectWithData = []
        this.props.data[queryName].map((item,index) => {
          let selectDisplay = '';
          for(let i=0; i<fields.length; i++){
            if(i === 0){
              selectDisplay+= this.props.data[queryName][index][fields[i]];
            } else {
              selectDisplay+= (' ' + this.props.data[queryName][index][fields[i]]);
            }
          }
          if(item.id === this.props.defaultId){
            defaultOption = selectDisplay;
          }
          console.log("item.id: ", item.id, "defaultId: ", this.props.defaultId, "SelectDisplay: ", selectDisplay, "DefaultOption: ", defaultOption);
          return selectWithData.push(selectDisplay);
        });
        console.log(defaultOption);
        if(selectWithData.indexOf(defaultOption) === -1){
          console.log("adding default option", defaultOption);
          selectWithData.unshift(defaultOption);
        }
        selectItems = selectWithData;
      } else {
        selectItems = null;
      }
      return <Component selectItems={selectItems} defaultOption={defaultOption} {...this.props}/>;
    }
  };
  const ComponentWithSelectQuery = graphql(Query)(DropdownWithQuery);
  return ComponentWithSelectQuery;
}

export default withSelectQuery;