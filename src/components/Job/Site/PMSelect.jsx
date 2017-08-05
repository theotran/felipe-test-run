import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown } from 'semantic-ui-react';


class PMSelect extends React.Component {
  constructor(props) {
    super(props);
    if(this.props.job) {
      this.state = {
        id: this.props.job.pm ? this.props.job.pm.id : "",
      };
    }
  }

  // handleChange (event, index, value) {
  //   this.setState({
  //     id: value,
  //   });
  //
  //   this.props.SetPM({
  //     variables: {
  //       job: this.props.job.id,
  //       pm: value
  //     }
  //   });
  // }

  render() {
    console.log("PM SELECT STATE ", this.state)
    if(this.props.data.loading) {
      return <div>loading</div>;
    }

    if(this.props.data.error) {
      return <div>No data to display</div>;
    }

    return (
      <div>
        <div className={"form-group " + this.props.className}>
          <label htmlFor="">Project Manager</label>
          {/* <SelectField
          style={{ width: '100%'}}
           floatingLabelText="Project Manager"
           floatingLabelFixed={true}
           value={this.state.id}
           onChange={this.handleChange}
          >
            {this.props.data.getPeople.map(option => {
              return <MenuItem value={option.id} key={option.id} primaryText={option.firstName + " " + option.lastName} />
            })}
          </SelectField> */}
          <Dropdown
            placeholder='Project Manager'
            fluid selection options={this.props.data.getPeople.map((person, index) => {
              return {
                key: person.id,
                text: person.firstName + " " + person.lastName,
                value: person.id
              }
            })}
            value={this.state.id}
            onChange={(e, data) => {
              console.log(data)
              this.setState({
                id: data.value,
              });
              this.props.SetPM({
                variables: {
                  job: this.props.job.id,
                  pm: data.value
                }
              });
            }}
          />
        </div>
      </div>

    )
  }
}

const getPeopleQuery = gql`
  query {
    getPeople(group:"Employee" type:"Person"){
      id
      firstName
      lastName
      user {
        id
        username
        password
      }
    }
  }
`;

const SetPMMutation = gql`
  mutation setJobPM ($job: ID!, $pm: ID!) {
    setJobPM (job: $job, pm: $pm) {
      id
      pm {
        id
        firstName
        lastName
        phones {
          id
          number
        }
        emails {
          id
          address
        }
      }
    }
  }
`;

const PMSelectWithData = compose(
  graphql(getPeopleQuery),
  graphql(SetPMMutation, { name: "SetPM"}),
)(PMSelect);

export default PMSelectWithData;
