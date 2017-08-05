import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import SectionIcon from 'material-ui/svg-icons/action/label-outline';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import client from './../../../index.js';
import { withRouter } from 'react-router';
import LabelInput from './../../LabelInput';
import { Dropdown } from 'semantic-ui-react';
import GetJobQuery from './../../../queries/GetJobQuery';
import moment from 'moment';
import AddNoteModal from '../Design/AddNoteModal';

let cachedJobQuery

const UpdatePlaneMutation = gql`
  mutation updatePlane($id: ID!, $watts: Float, $type: String, $racking: String, $isBallast: Boolean, $age: Float, $needsReRoof: Boolean, $compass: Float, $pitch: Float, $northLength: Float, $southLength: Float, $eastLength: Float, $westLength: Float, $height: Float, $interior: String, $deck: String, $coating: String)
   {
    updatePlane(input: {id: $id, watts: $watts, type: $type, racking: $racking, isBallast: $isBallast, age: $age, needsReRoof:$needsReRoof, compass: $compass, pitch: $pitch, northLength: $northLength, southLength: $southLength, eastLength: $eastLength, westLength: $westLength, height: $height, interior: $interior, deck: $deck, coating: $coating}) {
		id
    watts
    type
    racking
    isBallast
    age
    needsReRoof
    compass
    pitch
    northLength
    southLength
    eastLength
    westLength
    height
    interior
    deck
    coating
    safetyNotes {
      id
    }
    generalNotes {
      id
    }
    createdAt
    updatedAt
    }
  }
`;

class roofPlaneInfo extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      expanded: false,
      roofPlane: this.props.roofPlane,
      age: this.props.roofPlane ? this.props.roofPlane.age : null,
      coating: this.props.roofPlane ? this.props.roofPlane.coating : '',
      compass: this.props.roofPlane ? this.props.roofPlane.compass : '',
      deck: this.props.roofPlane ? this.props.roofPlane.deck : '',
      eastLength: this.props.roofPlane ? this.props.roofPlane.eastLength : '',
      generalNotes: this.props.roofPlane ? this.props.roofPlane.generalNotes : [],
      height: this.props.roofPlane ? this.props.roofPlane.height : null,
      id: this.props.roofPlane ? this.props.roofPlane.id : '',
      interior: this.props.roofPlane ? this.props.roofPlane.interior : '',
      isBallast: this.props.roofPlane ? this.props.roofPlane.isBallast : false,
      needsReRoof: this.props.roofPlane ? this.props.roofPlane.needsReRoof : false,
      northLength: this.props.roofPlane ? this.props.roofPlane.northLength : null,
      pitch: this.props.roofPlane ? this.props.roofPlane.pitch : null,
      racking: this.props.roofPlane ? this.props.roofPlane.racking : '',
      safetyNotes: this.props.roofPlane ? this.props.roofPlane.safetyNotes : [],
      southLength: this.props.roofPlane ? this.props.roofPlane.southLength : null,
      type: this.props.roofPlane ? this.props.roofPlane.type : '',
      watts: this.props.roofPlane ? this.props.roofPlane.watts : null,
      westLength: this.props.roofPlane ? this.props.roofPlane.westLength : null,
      roofPlaneIndex: this.props.roofPlaneIndex
    }
    console.log(this.state)
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleBlur() {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.JobId
      }
    });

    const cachedRoof = cachedJobQuery.job.planes[this.state.roofPlaneIndex];

    if(cachedRoof.age !== this.state.age || cachedRoof.coating !== this.state.coating || cachedRoof.compass !== this.state.compass || cachedRoof.deck !== this.state.deck || cachedRoof.eastLength !== this.state.eastLength || cachedRoof.height !== this.state.height || cachedRoof.interior !== this.state.interior || cachedRoof.isBallast !== this.state.isBallast || cachedRoof.needsReRoof !== this.state.needsReRoof || cachedRoof.northLength !== this.state.northLength || cachedRoof.pitch !== this.state.pitch || cachedRoof.racking !== this.state.racking || cachedRoof.southLength !== this.state.southLength || cachedRoof.type !== this.state.type || cachedRoof.watts !== this.state.watts || cachedRoof.westLength !== this.state.westLength) {

      client.mutate({
        mutation: UpdatePlaneMutation,
        variables: {
          age: this.state.age,
          coating: this.state.coating,
          compass: this.state.compass,
          deck: this.state.deck,
          eastLength: this.state.eastLength,
          generalNotes: this.state.generalNotes,
          height: this.state.height,
          id: this.state.id,
          interior: this.state.interior,
          isBallast: this.state.isBallast,
          needsReRoof: this.state.needsReRoof,
          northLength: this.state.northLength,
          pitch: this.state.pitch,
          racking: this.state.racking,
          safetyNotes: this.state.safetyNotes,
          southLength: this.state.southLength,
          type: this.state.type,
          watts: this.state.watts,
          westLength: this.state.westLength,
        },
        update: (proxy, result) => {
          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            }
          });

          console.log("proxy", proxy);
          console.log("result", result);
          console.log("data", data);

          data.job.costs[this.state.costNumber] = result.data.updateCost;

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.JobId
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.JobId
        }
      });
      console.log(cachedJobQuery)
    }
  }

  render() {

    let safetyNotes;
    if(this.state.safetyNotes.length >= 1){
      safetyNotes = this.state.safetyNotes.map((note, key) => {
      return (
        <div key={key} className="note">
          <div className='row'>
            <div className='col-md-3'>
              <div>{moment(note.createdOn).format('lll')}</div>
            </div>
            <div className='col-md-3'>
              <div>{note.createdBy.firstName + ' ' + note.createdBy.lastName}</div>
            </div>
            <div className='col-md-6'>
              <div>{note.text}</div>
            </div>
          </div>
        </div>);
      });
    } else {
      safetyNotes = null;
    }

    let generalNotes;
    if(this.state.generalNotes.length >= 1){
      generalNotes = this.state.generalNotes.map((note, key) => {
        console.log(note)
      return (
        <div key={key} className="note">
          <div className='row'>
            <div className='col-md-3'>
              <div>{moment(note.createdOn).format('lll')}</div>
            </div>
            <div className='col-md-3'>
              <div>{note.createdBy.firstName + ' ' + note.createdBy.lastName}</div>
            </div>
            <div className='col-md-6'>
              <div>{note.text}</div>
            </div>
          </div>
        </div>);
      });
    } else {
      generalNotes = null;
    }

    return(
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          avatar={<SectionIcon />}
          title={this.state.type}
          // subtitle={'qwer'}
          subtitleColor={" #00B1B3"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Roof Type'
                name='Type'
                value={this.state.type}
                placeholder='Type'
                onChange={(e) => {
                  this.setState({type: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='Watts'
                name='Watts'
                value={this.state.watts}
                placeholder='Watts'
                onChange={(e) => {
                  this.setState({watts: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Coating'
                name='Coating'
                value={this.state.coating}
                placeholder='Coating'
                onChange={(e) => {
                  this.setState({coating: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='Racking'
                name='Racking'
                value={this.state.racking}
                placeholder='Racking'
                onChange={(e) => {
                  this.setState({racking: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <div className='form-group col-md-6'>
                <label htmlFor="">Is Ballast</label>
                <Dropdown
                  placeholder='Is Ballast'
                  fluid selection options={[
                    { text: 'True', value: true, },
                    { text: 'False', value: false, },
                  ]}
                  value={this.state.isBallast}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ isBallast: data.value }, this.handleBlur)
                  }}
                />
              </div>
              <LabelInput className="col-md-6"
                label='Age'
                name='Age'
                value={this.state.age}
                placeholder='Age'
                onChange={(e) => {
                  this.setState({age: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <div className='form-group col-md-6'>
                <label htmlFor="">Needs ReRoof</label>
                <Dropdown
                  placeholder='Needs ReRoof'
                  fluid selection options={[
                    { text: 'True', value: true, },
                    { text: 'False', value: false, },
                  ]}
                  value={this.state.needsReRoof}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ needsReRoof: data.value }, this.handleBlur)
                  }}
                />
              </div>
              <LabelInput className="col-md-6"
                label='Compass'
                name='Compass'
                value={this.state.compass}
                placeholder='Compass'
                onChange={(e) => {
                  this.setState({compass: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Pitch'
                name='Pitch'
                value={this.state.pitch}
                placeholder='Pitch'
                onChange={(e) => {
                  this.setState({pitch: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='Height'
                name='Height'
                value={this.state.height}
                placeholder='Height'
                onChange={(e) => {
                  this.setState({height: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='North Length'
                name='North Length'
                value={this.state.northLength}
                placeholder='North Length'
                onChange={(e) => {
                  this.setState({northLength: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='South Length'
                name='South Length'
                value={this.state.southLength}
                placeholder='South Length'
                onChange={(e) => {
                  this.setState({southLength: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='East Length'
                name='East Length'
                value={this.state.eastLength}
                placeholder='East Length'
                onChange={(e) => {
                  this.setState({eastLength: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='West Length'
                name='West Length'
                value={this.state.westLength}
                placeholder='West Length'
                onChange={(e) => {
                  this.setState({westLength: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Interior'
                name='Interior'
                value={this.state.interior}
                placeholder='Interior'
                onChange={(e) => {
                  this.setState({interior: e.target.value}, this.handleBlur)
                }}
              />
              <LabelInput className="col-md-6"
                label='Deck'
                name='Deck'
                value={this.state.deck}
                placeholder='Deck'
                onChange={(e) => {
                  this.setState({deck: e.target.value}, this.handleBlur)
                }}
              />
            </div>
            <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">GENERAL NOTES</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="30"/>
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-md-12">
                <div className='row'>
                  <div className='col-md-3'>
                    <label>Created On</label>
                  </div>
                  <div className='col-md-3'>
                    <label>Created By</label>
                  </div>
                  <div className='col-md-6'>
                    <label>Note</label>
                  </div>
                </div>
              </div>
            </div>
            {generalNotes}
            <br />
            <div className='row'>
              <AddNoteModal jobId={this.props.JobId} type={"General"} belongsTo={"Plane"} belongsToId={this.state.id}/>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                <h4 className="tabHeaderText">SAFETY NOTES</h4>
                <img className="tabHeaderLogo" role="presentation" src='/images/Preview_Icon_p.svg' height="30"/>
              </div>
            </div>
            <div className='row'>
              <div className="form-group col-md-12">
                <div className='row'>
                  <div className='col-md-3'>
                    <label>Created On</label>
                  </div>
                  <div className='col-md-3'>
                    <label>Created By</label>
                  </div>
                  <div className='col-md-6'>
                    <label>Note</label>
                  </div>
                </div>
              </div>
            </div>
            {safetyNotes}
            <br />
            <div className='row'>
              <AddNoteModal jobId={this.props.JobId} type={"Safety"} belongsTo={"Plane"} belongsToId={this.state.id}/>
            </div>
          </div>
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    )
  }
}

const RoofPlaneInfoWithMutation = graphql(UpdatePlaneMutation)(withRouter(roofPlaneInfo));

export default RoofPlaneInfoWithMutation;
