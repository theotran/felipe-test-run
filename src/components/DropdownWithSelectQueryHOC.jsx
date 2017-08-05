import React from 'react';
import { graphql } from 'react-apollo';

const withSelectQuery = (Component, Query, queryName, fields) => {
  // ...and returns another component...
  const ComponentWithSelectQuery = graphql(Query)(Component);

  return class DropdownWithQuery extends React.Component {
    constructor(props) {
      super(props);
      console.log(this);
      this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
      // this.setState({
      //   data: selectData(DataSource, this.props)
      // });
    }
    render() {
      return <ComponentWithSelectQuery {...this.props}/>;
    }

  };
}

export default withSelectQuery;
