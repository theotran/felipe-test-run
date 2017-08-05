import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import DatePicker from 'material-ui/DatePicker';
import LabelInput from './../../LabelInput';
import AddStagingModal from '../AddStagingModal';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import AddPreviewModal from './AddPreviewModal';
import GetJobQuery from '../../../queries/GetJobQuery';
import client from './../../../index.js';
import AddRoofPlaneModal from './AddRoofPlaneModal';
import RoofPlaneInfo from './RoofPlaneInfo';

import UpdatePreviewMutation from './../../../mutations/UpdatePreview';
import CreateTaskMutation from './../../../mutations/CreateTask';

import GetEmployeesQuery from './../../../queries/GetEmployees';

let cachedJobQuery;

class PreviewContainer extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      previews: this.props.job.previews ? this.props.job.previews : [],
      previewNumber: this.props.job.previews[0] ? 0 : null,
      selected: this.props.job.previews[0] ? this.props.job.previews[0].id : '',
      previewer: this.props.job.previews[0] ? this.props.job.previews[0].previewer.id : null,
      dateTime: this.props.job.previews[0] ? this.props.job.previews[0].dateTime : null,
      previewTime: this.props.job.previews[0] ? this.props.job.previews[0].dateTime : null,
      weather: this.props.job.previews[0] ? this.props.job.previews[0].weather : '',
      temperature: this.props.job.previews[0] ? this.props.job.previews[0].temperature : null,
      stagings: this.props.job.previews[0] ? this.props.job.previews[0].stagings : null,
      roofPlane: this.props.job.previews[0] ? this.props.job.planes : null
    }
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({previewTime: date}, () => {
    });
  }

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    const cachedPreviewContainer = cachedJobQuery.job.previews[this.state.previewNumber];

    if(cachedPreviewContainer.previewer !== this.state.previewer || cachedPreviewContainer.dateTime !== this.state.dateTime || cachedPreviewContainer.weather !== this.state.weather || cachedPreviewContainer.temperature !== this.state.temperature) {

      // DO NOT TOUCH, SETSTATE WILL BREAK THIS
      // let savedDateTime = cachedPreviewContainer.dateTime ? cachedPreviewContainer.dateTime.toString().split('T')[1].split('.')[0] : ' ';
      // let savedPreviewTime = this.state.previewTime ? this.state.previewTime.toString().split(' ')[4] : ' ';
      // if (savedDateTime !== savedPreviewTime) {
      //   let updateTime = this.state.dateTime.toString().split(' ')
      //   updateTime.splice(4, 1, savedDateTime)
      //   this.state.dateTime = moment(updateTime.join(' '))
      // }

      client.mutate({
        mutation: UpdatePreviewMutation,
        variables: {
          id: cachedPreviewContainer.id,
          PreviewerId: this.state.previewer,
          dateTime: this.state.dateTime,
          weather: this.state.weather,
          temperature: this.state.temperature
        },
        optimisticResponse: {
          id: cachedPreviewContainer.id,
          PreviewerId: this.state.previewer,
          dateTime: this.state.dateTime,
          weather: this.state.weather,
          temperature: this.state.temperature
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          // console.log("proxy", proxy);
          // console.log("result", result);
          // console.log("data", data);

          if('updatePreview' in result.data) {
            data.job.previews[this.state.previewNumber] = result.data.updatePreview;
          } else {
            data.job.previews[this.state.previewNumber] = result.data;
          }

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }
  }

  render() {
    if(this.props.data.loading) {
      return ( <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Preview Information
        </div>
        );
    }

    if(this.props.data.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred. <br />Click here to reload this page. <br />If problems persist please contact customer service.</div>);
    }

    const previews = this.state.previews.map((preview, index) => {
      return (<MenuItem value={preview.id} key={index} primaryText={moment(preview.dateTime).format('lll')}  />);
    });

    let previewInfo;
    if (this.state.previews.length === 0) {
      previewInfo =
      <div className='row'>
        <div className='col-md-6'>
          <br />
          <div>Currently There are no saved site previews. <br />To add one click the "ADD PREVIEW" button above.</div>
        </div>
      </div>
    }

    let stagingInfo;
    if (this.props.job.stagings.length === 0) {
      stagingInfo = <div>There are no saved staging areas.</div>
    } else {
      stagingInfo = this.props.job.stagings.map((staging, index) => {
        return (
          <div className='col-md-12' key={index}>
            <div className="form-group col-md-12">
                <label htmlFor="">Staging Area</label>
                <input
                  name='Staging Area'
                  className="form-control"
                  value={staging.description}
                  readOnly
                />
            </div>
          </div>
        )
      })
    }

    let roofPlaneInfo;
    if (this.props.job.planes.length === 0) {
      roofPlaneInfo = <div>There are no Roof Planes saved!</div>
    } else {
      roofPlaneInfo = this.props.job.planes.map((roofPlane, index) => {
        return (
          <RoofPlaneInfo JobId={this.props.job.id} roofPlane={roofPlane} key={index} roofPlaneIndex={index}/>
        )
      })
    }

    if(this.state.previews.length !== 0){
      previewInfo =
      <div>
        <div className='row'>
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
              value={this.state.previewer}
              onChange={(e, data) => {
                this.setState({
                  previewer: data.value,
                }, this.handleBlur);
              }}
            />
          </div>
        </div>

        <div className='row'>
          {/* <div className={"form-group col-md-6"}>
            <TimePicker
              floatingLabelText="Preview Time"
              floatingLabelFixed={true}
              autoOk={true}
              format="ampm"
              hintText="12hr Format"
              value={moment(this.state.previewTime)._d}
              onChange={this.handleChangeTimePicker12}
            />
          </div> */}
          <div className='form-group col-md-6'>
            <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Preview Date (YYYY-MM-DD)" id="1"
              value={this.state.dateTime ? moment(this.state.dateTime)._d : {}}
              onChange={
                (e, date) => {
                  this.setState({ dateTime: moment(date)._d}, this.handleBlur);
                  this.props.CreateTask({
                    variables: {
                      status: 'Some Status',
                      endField: 'Date',
                      endValue: 'Date Value',
                      path: 'commercial/project/' + this.props.job.id + '/preview',
                      completedAt: this.state.dateTime,
                      belongsTo: 'Preview',
                      belongsToId: this.state.preview.id,
                      PersonId: this.state.previewer,
                      JobId: this.props.job.id
                    }
                  }).then((value) => {
                    console.log("value in the create task mutation callback ", value);
                  })
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
              value={this.state.weather}
              onChange={(e, data) => {
                console.log("VALUE IN DROPDOWN ", data)
                this.setState({ weather: data.value }, this.handleBlur)
              }}
            />
          </div>
          <LabelInput className="col-md-6" label='Preview Temp' name='Preview Temp' value={this.state.temperature} placeholder='Preview Temp' onChange={(e, key, value) => this.setState({ temperature: e.target.value })} onBlur={this.handleBlur}/>
        </div>
<br /> <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">STAGING AREAS</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {stagingInfo}
              <AddStagingModal jobId={this.props.job.id} />
            </div>
<br /> <br />
         <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">ROOF PLANES</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className="row">
              {roofPlaneInfo}
              <br />
              <AddRoofPlaneModal jobId={this.props.job.id} />
            </div>
      </div>
    }

    let previewsDropdown;
    if (this.state.previews.length !== 0) {
      previewsDropdown =
      <div>
      <div className='col-md-3'>
        <Dropdown
          placeholder='Previews'
          fluid selection options={this.state.previews.map((preview, index) => {
            return {
              key: index,
              text: moment(preview.dateTime).format('lll'),
              value: preview.id
            }
          })}
          value={this.state.selected}
          onChange={(e, data) => {
            console.log("VALUE IN DROPDOWN ", this.state)
            for (let i=0; i < this.state.previews.length; i++) {
              if (this.state.previews[i].id === data.value) {
                this.setState({
                  preview: this.props.job.previews[i],
                  previewNumber: i,
                  previewer: this.props.job.previews[i].previewer ? this.props.job.previews[i].previewer.id : '',
                  dateTime: this.props.job.previews[i].dateTime,
                  previewTime: this.props.job.previews[i].dateTime,
                  weather: this.props.job.previews[i].weather ? this.props.job.previews[i].weather : '',
                  temperature: this.props.job.previews[i].temperature ? this.props.job.previews[i].temperature : '',
                  stagings: this.props.job.previews[i].stagings,
                  selected: data.value
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
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">PREVIEW INFO</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
              </div>
            </div>
            <div className='row'>
              {previewsDropdown}
              <div className='col-md-3'>
                <AddPreviewModal jobId={this.props.job.id} />
              </div>
            </div>
            {previewInfo}
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

const PrevewTabWithData = compose(
  graphql(getPeopleQuery),
  graphql(UpdatePreviewMutation),
  graphql(CreateTaskMutation, { name: 'CreateTask' })
)(PreviewContainer)
export default PrevewTabWithData;
