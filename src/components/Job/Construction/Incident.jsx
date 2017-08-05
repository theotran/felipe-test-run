

import React, { Component } from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/assignment';


import LabelInput from '../../LabelInput';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

import { Dropdown } from 'semantic-ui-react';



class Incident extends Component {

  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      type: this.props.incident.type ? this.props.incident.type : '',
      description: this.props.incident.description ? this.props.incident.description : '',
      location: this.props.incident.location ? this.props.incident.location : '',
      date: this.props.incident.date ? this.props.incident.date : null,
      explanation: this.props.incident.explanation ? this.props.incident.explanation : '',
      incidentPeople: this.props.incident.people ? this.props.incident.people : []
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleToggle = (event, toggle) => {
    this.setState({expanded: toggle});
  };

  handleExpand = () => {
    this.setState({expanded: true});
  };

  handleReduce = () => {
    this.setState({expanded: false});
  };

  handleBlur() {
    this.props.UpdateIncident({
      variables: {
        id: this.props.incident.id,
        description: this.state.description,
        location: this.state.description,
        date: this.state.date,
        explanation: this.state.explanation,
      }
    })
  }

  render() {
    console.log(this.props)
    if(this.props.data.loading) {
      return <div>Loading...</div>
    }

    if(this.props.data.error) {
      return <div>Error</div>
    }

    console.log("INCIDENT PEOPLE STATE ", this.state.incidentPeople)
    let arrayVar = this.state.incidentPeople.slice();
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={"Incident"}
          subtitle={this.state.description}
          subtitleColor={"#00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div className="row">
            <div className='form-group col-md-3'>
              <DatePicker style={{width: "100%"}} autoOk={true} floatingLabelFixed={true} floatingLabelText="Date" id="1" value={this.state.date ? moment(this.state.date)._d : {}} onChange={(e, date) => {
                this.setState({ date: moment(date)._d }, this.handleBlur)
              } }/>
            </div>
          </div>
          <div className="row">
            <LabelInput className={'col-md-4'} label='Location' value={this.state.location} placeholder='Location' onChange={(e) => { this.setState({ location: e.target.value }) }} onBlur={this.handleBlur}/>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label>Description</label>
              <textarea rows="4" className="form-control" value={this.state.description} onChange={(e) => { this.setState({ description: e.target.value })}} />
            </div>
            <div className="form-group col-md-6">
              <label>Explanation</label>
              <textarea rows="4" className="form-control" value={this.state.explanation} onChange={(e) => { this.setState({ explanation: e.target.value })}} />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="">Add Person Involved</label>
              <Dropdown
                placeholder='Person Involved'
                fluid selection options={this.props.data.getPeople.map((person, index) => {
                  // let obj = person;
                  // let arr = Object.keys(obj).map(function (key) {
                  //   return obj[key];
                  // })
                  // console.log("THE ARR IS ", arr)
                  return {
                    key: index,
                    text: person.firstName + " " + person.lastName,
                    value: index
                  }
                })}
                value="Placeholder!!!"
                onChange={(e, data) => {
                  console.log(data)
                  arrayVar.push(this.props.data.getPeople[data.value]);
                  this.setState({
                    incidentPeople: arrayVar,//data.value
                  });
                  this.props.AddIncidentPerson({
                    variables: {
                      IncidentId: this.props.incident.id,
                      PersonId: this.props.data.getPeople[data.value].id
                    }
                  });
                }}
              />
            </div>
            {this.state.incidentPeople ? this.state.incidentPeople.map((person, index) => {
              return (
                <div key={index}>
                  <div>{person.firstName + person.lastName}</div>
                </div>
              )
            }) : ''}
          </div>
        </CardText>
        <CardActions>

        </CardActions>
      </Card>
    );
  }
}

const getPeopleQuery = gql`
  query {
    getPeople {
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

const AddIncidentPerson = gql`
  mutation addIncidentPerson($IncidentId: ID!, $PersonId: ID!) {
    addIncidentPerson(input: { IncidentId: $IncidentId, PersonId: $PersonId }) {
      id
      people {
        id
        firstName
        lastName
      }
    }
  }
`

const UpdateIncidentMutation = gql`
  mutation updateIncident($id: ID, $type: String, $description: String, $location: String, $date: DateTime, $explanation: String) {
    updateIncident(input: { id: $id, type: $type, description: $description, location: $location, date: $date, explanation: $explanation }) {
      id
      type
      description
      location
      date
      explanation
    }
  }
`;

const IncidentWithMutation = compose(
  graphql(getPeopleQuery),
  graphql(AddIncidentPerson, { name: 'AddIncidentPerson' }),
  graphql(UpdateIncidentMutation, { name: 'UpdateIncident' }),
)(Incident);

export default IncidentWithMutation;
