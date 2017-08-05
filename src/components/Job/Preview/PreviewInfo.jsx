import React, { Component } from 'react';
import LabelInput from './../../LabelInput';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import AddStagingModal from '../AddStagingModal';
import AddPreviewModal from './AddPreviewModal';
import AddRoofPlaneModal from './AddRoofPlaneModal';
import RoofPlaneInfo from './RoofPlaneInfo';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

class PreviewInfo extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleBlur() {
    this.props.blurHandler(this.props.preview)
  }

  handleChange(key, value) {
    this.props.changeHandler(key, value)
  }

  render() {
    console.log("preview infos props ", this.props)
    return (
      <div>
        <div style={{ marginTop: "15px" }} className='row'>
          <div className='form-group col-md-6'>
            <label htmlFor="">Previewed By</label>
            <Dropdown
              placeholder='Previewed By'
              fluid selection options={this.props.data.getPeople.map((person, index) => {
                return {
                  key: index,
                  text: person.firstName + " " + person.lastName,
                  value: person.id
                }
              })}
              value={this.props.preview ? this.props.preview.previewer ? this.props.preview.previewer.id : '' : ''}
              onChange={(e, data) => {
                for(let i=0; i < this.props.data.getPeople.length; i++) {
                  if(this.props.data.getPeople[i].id === data.value) {
                    return this.handleChange('previewer', data.value);
                  }
                }
              }}
              // onBlur={(e, data) => { this.handleBlur()}}
            />
          </div>
        </div>

        <div className='row'>
          <div className='form-group col-md-6'>
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Preview Date (YYYY-MM-DD)" id="1"
              value={this.props.preview.dateTime ? moment(this.props.preview.dateTime)._d : {}}
              onChange={
                (e, date) => {
                  // this.setState({ dateTime: moment(date)._d}, this.handleBlur);
                  // this.props.CreateTask({
                  //   variables: {
                  //     status: 'Some Status',
                  //     endField: 'Date',
                  //     endValue: 'Date Value',
                  //     path: 'commercial/project/' + this.props.job.id + '/preview',
                  //     completedAt: this.state.dateTime,
                  //     belongsTo: 'Preview',
                  //     belongsToId: this.state.preview.id,
                  //     PersonId: this.state.previewer,
                  //     JobId: this.props.job.id
                  //   }
                  // }).then((value) => {
                  //   console.log("value in the create task mutation callback ", value);
                  // })
                }
              } />
          </div>
        </div>

        <div className='row'>
          <div className='form-group col-md-6'>
            <label htmlFor="">Weather</label>
            <Dropdown
              placeholder='Weather'
              fluid selection options={[
                { text: 'Sunny', value: 'Sunny', },
                { text: 'Partly Sunny', value: 'Partly Sunny', },
                { text: 'Partly Cloudy', value: 'Partly Cloudy', },
                { text: 'Cloudy', value: 'Cloudy', },
                { text: 'Overcast', value: 'Overcast', },
                { text: 'Showers', value: 'Showers', },
                { text: 'Rain', value: 'Rain', },
                { text: 'Thunderstorm', value: 'Thunderstorm', },
                { text: 'Hail', value: 'Hail', },
                { text: 'Snow', value: 'Snow', },
              ]}
              value={this.props.preview.weather ? this.props.preview.weather : ''}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data)
                // this.setState({ weather: data.value }, this.handleBlur)
              }}
            />
          </div>
          <LabelInput className="col-md-6" label='Preview Temp' name='Preview Temp' value={this.props.preview.temperature} placeholder='Preview Temp' onChange={(e, key, value) => this.setState({ temperature: e.target.value })} onBlur={this.handleBlur}/>
        </div>
  <br /> <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">STAGING AREAS</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {/* {stagingInfo} */}
              <AddStagingModal addStaging={this.props.addStaging} jobId={this.props.job.id} />
            </div>
  <br /> <br />
         <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">ROOF PLANES</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {/* {roofPlaneInfo} */}
              <br />
              <AddRoofPlaneModal jobId={this.props.job.id} />
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

const PreviewInfoWithData = compose(
  graphql(getPeopleQuery)
)(PreviewInfo)

export default PreviewInfoWithData;
