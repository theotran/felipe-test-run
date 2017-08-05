import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';

// const colors = [
//   'Red',
//   'Orange',
//   'Yellow',
//   'Green',
//   'Blue',
//   'Purple',
//   'Black',
//   'White',
// ];

/**
 * `AutoComplete` search text can be implemented as a controlled value,
 * where `searchText` is handled by state in the parent component.
 * That value is reseted with the `onNewRequest` callback.
 */
export default class AutoCompleteExampleControlled extends Component {
  state = {
    searchText: this.props.searchText ? this.props.searchText : '',
    users: this.props.users.map((user, index) => {
      return {
        key: index,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    })
  };

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  };

  handleNewRequest = () => {
    this.setState({
      searchText: '',
    });
  };

  render() {
    console.log('AUTOCOMPLETES USERS ', this.state.users)
    return (
      <div>
        <AutoComplete
          hintText="Type 'r', case insensitive"
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.users}
          filter={(searchText, key) => (key.firstName.indexOf(searchText) !== -1)}
          openOnFocus={true}
        />
      </div>
    );
  }
}
