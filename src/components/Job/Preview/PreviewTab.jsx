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
import update from 'immutability-helper';
let cachedJobQuery;

import PreviewInfo from './PreviewInfo';

const UpdatePreviewMutation = gql`
  mutation updatePreview($id: ID, $PreviewerId: ID, $dateTime: DateTime, $weather: String, $temperature: Float) {
    updatePreview(input: {id: $id, PreviewerId: $PreviewerId, dateTime: $dateTime, weather: $weather, temperature: $temperature}) {
  		id
      previewer {
        id
        firstName
        lastName
      }
      dateTime
      weather
      temperature
    }
  }
`;

const CreateTaskMutation = gql`
  mutation createTask($status: String, $endField: String, $endValue: String, $fields: String, $path: String, $assignedAt: DateTime, $dueAt: DateTime, $completedAt: DateTime, $belongsTo: String, $belongsToId: ID, $PersonId: ID, $JobId: ID){
    createTask(input: {status: $status, endField: $endField, endValue: $endValue, fields: $fields, path: $path, assignedAt: $assignedAt, dueAt: $dueAt, completedAt: $completedAt, belongsTo: $belongsTo, belongsToId: $belongsToId, PersonId: $PersonId, JobId: $JobId}) {
      id
      status
      endField
      endValue
      fields
      path
      assignedAt
      dueAt
      completedAt
      belongsTo {
        ...on Preview {
          id
        }
      }
      job {
        id
        name
      }
    }
  }
`;

class PreviewTab extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      previews: this.props.job.previews ? this.props.job.previews : [],
      previewNumber: this.props.job.previews[0] ? 0 : null,
      preview: this.props.job.previews[0] ? this.props.job.previews[0] : {},
      selected: this.props.job.previews[0] ? this.props.job.previews[0].id : '',
      // previewer: this.props.job.previews[0] ? this.props.job.previews[0].previewer.id : null,
      dateTime: this.props.job.previews[0] ? this.props.job.previews[0].dateTime : null,
      previewTime: this.props.job.previews[0] ? this.props.job.previews[0].dateTime : null,
      weather: this.props.job.previews[0] ? this.props.job.previews[0].weather : '',
      temperature: this.props.job.previews[0] ? this.props.job.previews[0].temperature : null,
      stagings: this.props.job.previews[0] ? this.props.job.previews[0].stagings : [],
      roofPlane: this.props.job.previews[0] ? this.props.job.planes : null
    }
  }

  handleChangeTimePicker12 = (event, date) => {
    this.setState({previewTime: date}, () => {
    });
  }

  handleChange(key, value) {
    let newChangeData = update(this.state, {
      preview: { [key]: { $set: value }},
      previews: { [this.state.previewNumber] : { [key] : { $set: value }}}
    });

    this.setState(newChangeData, () => {
      if(key === 'previewer' || key === 'dateTime' || key === 'weather'){
        this.handleBlur(this.state.preview);
      }
    })
  }

  handleBlur(preview) {
    console.log(preview)
    this.setState({ preview: preview })
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    const cachedPreviewTab = cachedJobQuery.job.previews[this.state.previewNumber];

    if(cachedPreviewTab.previewer !== preview.previewer || cachedPreviewTab.dateTime !== preview.dateTime || cachedPreviewTab.weather !== preview.weather || cachedPreviewTab.temperature !== preview.temperature) {

      // DO NOT TOUCH, SETSTATE WILL BREAK THIS
      // let savedDateTime = cachedPreviewTab.dateTime ? cachedPreviewTab.dateTime.toString().split('T')[1].split('.')[0] : ' ';
      // let savedPreviewTime = this.state.previewTime ? this.state.previewTime.toString().split(' ')[4] : ' ';
      // if (savedDateTime !== savedPreviewTime) {
      //   let updateTime = this.state.dateTime.toString().split(' ')
      //   updateTime.splice(4, 1, savedDateTime)
      //   this.state.dateTime = moment(updateTime.join(' '))
      // }

      client.mutate({
        mutation: UpdatePreviewMutation,
        variables: {
          id: cachedPreviewTab.id,
          PreviewerId: preview.previewer.id,
          dateTime: preview.dateTime,
          weather: preview.weather,
          temperature: preview.temperature
        },
        optimisticResponse: {
          id: cachedPreviewTab.id,
          PreviewerId: preview.previewer.id,
          dateTime: preview.dateTime,
          weather: preview.weather,
          temperature: preview.temperature
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

  addPreview = (previewInfo) => {
    this.props.CreatePreview({variables: previewInfo })
      .then((value) => {
        console.log("value in the create preview mutation ", value);
        let newData = update(this.state, {
          previews: {$push: [value.data.createPreview]}
        });
        this.setState(newData);
        return value;
      })
  }

  addStaging = (stagingInfo) => {
    this.props.CreateStaging({variables: stagingInfo })
      .then((value) => {
        console.log("value in the create staging mutation ", value);
        let stagingData = update(this.state, {
          stagings: {$push: [value.data.createStaging]}
        });
        this.setState(stagingData);
        return value;
      })
  }

  render() {
    console.log("Preview Tabs state ", this.state)
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

    // const previews = this.state.previews.map((preview, index) => {
    //   return (<MenuItem value={preview.id} key={index} primaryText={moment(preview.dateTime).format('lll')}  />);
    // });

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
      previewInfo = <PreviewInfo preview={this.state.preview} job={this.props.job} addStaging={this.addStaging} blurHandler={this.handleBlur} changeHandler={this.handleChange}/>
//       <div>
//         <div style={{ marginTop: "15px" }} className='row'>
//           <div className='form-group col-md-6'>
//             <label htmlFor="">Previewed By</label>
//             <Dropdown
//               placeholder='Previewed By'
//               fluid selection options={this.props.data.getPeople.map((person, index) => {
//                 return {
//                   key: index,
//                   text: person.firstName + " " + person.lastName,
//                   value: person.id
//                 }
//               })}
//               value={this.state.previewer}
//               onChange={(e, data) => {
//                 this.setState({
//                   previewer: data.value,
//                 }, this.handleBlur);
//               }}
//             />
//           </div>
//         </div>
//
//         <div className='row'>
//           {/* <div className={"form-group col-md-6"}>
//             <TimePicker
//               floatingLabelText="Preview Time"
//               floatingLabelFixed={true}
//               autoOk={true}
//               format="ampm"
//               hintText="12hr Format"
//               value={moment(this.state.previewTime)._d}
//               onChange={this.handleChangeTimePicker12}
//             />
//           </div> */}
//           <div className='form-group col-md-6'>
//             <DatePicker autoOk={true} floatingLabelFixed={true} floatingLabelText="Preview Date (YYYY-MM-DD)" id="1"
//               value={this.state.dateTime ? moment(this.state.dateTime)._d : {}}
//               onChange={
//                 (e, date) => {
//                   this.setState({ dateTime: moment(date)._d}, this.handleBlur);
//                   this.props.CreateTask({
//                     variables: {
//                       status: 'Some Status',
//                       endField: 'Date',
//                       endValue: 'Date Value',
//                       path: 'commercial/project/' + this.props.job.id + '/preview',
//                       completedAt: this.state.dateTime,
//                       belongsTo: 'Preview',
//                       belongsToId: this.state.preview.id,
//                       PersonId: this.state.previewer,
//                       JobId: this.props.job.id
//                     }
//                   }).then((value) => {
//                     console.log("value in the create task mutation callback ", value);
//                   })
//                 }
//               } />
//           </div>
//         </div>
//
//         <div className='row'>
//           <div className='form-group col-md-6'>
//             <label htmlFor="">Weather</label>
//             <Dropdown
//               placeholder='Weather'
//               fluid selection options={[
//                 { text: 'Sunny', value: 'Sunny', },
//                 { text: 'Partly Sunny', value: 'Partly Sunny', },
//                 { text: 'Partly Cloudy', value: 'Partly Cloudy', },
//                 { text: 'Cloudy', value: 'Cloudy', },
//                 { text: 'Overcast', value: 'Overcast', },
//                 { text: 'Showers', value: 'Showers', },
//                 { text: 'Rain', value: 'Rain', },
//                 { text: 'Thunderstorm', value: 'Thunderstorm', },
//                 { text: 'Hail', value: 'Hail', },
//                 { text: 'Snow', value: 'Snow', },
//               ]}
//               value={this.state.weather}
//               onChange={(e, data) => {
//                 console.log("VALUE IN DROPDOWN ", data)
//                 this.setState({ weather: data.value }, this.handleBlur)
//               }}
//             />
//           </div>
//           <LabelInput className="col-md-6" label='Preview Temp' name='Preview Temp' value={this.state.temperature} placeholder='Preview Temp' onChange={(e, key, value) => this.setState({ temperature: e.target.value })} onBlur={this.handleBlur}/>
//         </div>
// <br /> <br />
//             <div className="row">
//               <div className="col-md-12 tabHeader">
//                 <h4 className="tabHeaderText">STAGING AREAS</h4>
//                 <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
//               </div>
//             </div>
//             <div className="row">
//               {stagingInfo}
//               <AddStagingModal addStaging={this.addStaging} jobId={this.props.job.id} />
//             </div>
// <br /> <br />
//          <div className="row">
//               <div className="col-md-12 tabHeader">
//                 <h4 className="tabHeaderText">ROOF PLANES</h4>
//                 <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="35" width="50"/>
//               </div>
//             </div>
//             <div className="row">
//               {roofPlaneInfo}
//               <br />
//               <AddRoofPlaneModal jobId={this.props.job.id} />
//             </div>
//       </div>
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
                  preview: this.state.previews[i],
                  previewNumber: i,
                  // previewer: this.state.previews[i].previewer ? this.state.previews[i].previewer.id : '',
                  dateTime: this.state.previews[i].dateTime,
                  previewTime: this.state.previews[i].dateTime,
                  weather: this.state.previews[i].weather ? this.state.previews[i].weather : '',
                  temperature: this.state.previews[i].temperature ? this.state.previews[i].temperature : '',
                  stagings: this.state.previews[i].stagings,
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
                <AddPreviewModal addPreview={this.addPreview} jobId={this.props.job.id} />
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

const CreatePreviewMutation = gql`
  mutation createPreview($JobId: ID!, $PreviewerId: ID, $dateTime: DateTime, $weather: String, $temperature: Float) {
    createPreview(input: {JobId: $JobId, PreviewerId: $PreviewerId, dateTime: $dateTime, weather: $weather, temperature: $temperature}) {
      id
      previewer {
        id
        firstName
        lastName
      }
      dateTime
      weather
      temperature
    }
  }
`;

const createStagingMutation = gql`
  mutation createStaging($JobId: ID!, $description: String!) {
    createStaging(input: {JobId: $JobId, description: $description}) {
      id
      description
    }
  }
`;

const PrevewTabWithData = compose(
  graphql(getPeopleQuery),
  graphql(UpdatePreviewMutation),
  graphql(CreateTaskMutation, { name: 'CreateTask' }),
  graphql(CreatePreviewMutation, { name: 'CreatePreview' }),
  graphql(createStagingMutation, { name: 'CreateStaging' }),
)(PreviewTab)
export default PrevewTabWithData;
