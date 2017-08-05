import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import { Button } from 'semantic-ui-react';
import LabelInput from './../../LabelInput';
import { Dropdown } from 'semantic-ui-react';

const createPlaneMutation = gql`
  mutation createPlane($JobId: ID!, $watts: Float, $type: String, $racking: String, $isBallast: Boolean, $age: Float, $needsReRoof: Boolean, $compass: Float, $pitch: Float, $northLength: Float, $southLength: Float, $eastLength: Float, $westLength: Float, $height: Float, $interior: String, $deck: String, $coating: String)
   {
    createPlane(input: {JobId: $JobId, watts: $watts, type: $type, racking: $racking, isBallast: $isBallast, age: $age, needsReRoof:$needsReRoof, compass: $compass, pitch: $pitch, northLength: $northLength, southLength: $southLength, eastLength: $eastLength, westLength: $westLength, height: $height, interior: $interior, deck: $deck, coating: $coating}) {
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

class AddRoofPlane extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)

    this.state = {
      open: false,
      description: '',
      JobId: this.props.jobId,
      hasSkyLight: null,
      isBallast: null,
      needsReRoof: null
    };

  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSave = () => {
    console.log(this.state);
    this.props.mutate({variables: {JobId: this.state.JobId, watts: this.state.watts, type: this.state.type, racking: this.state.racking, isBallast: this.state.isBallast, age: this.state.age, needsReRoof: this.state.needsReRoof, compass: this.state.compass, pitch: this.state.pitch, northLength: this.state.northLength, southLength: this.state.southLength, eastLength: this.state.eastLength, westLength: this.state.westLength, height: this.state.height, interior: this.state.interior, deck: this.state.deck, coating: this.state.coating}})
      .then((value) => {
        window.location.reload();
        return value;
      });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        backgroundColor={"#00B1B3"}
        labelColor={"#fff"}
        label="Submit"
        onTouchTap={this.handleSave}
      />
    ];

    return (
      <div>
        <Button color="teal" content='ADD ROOF PLANE' icon='plus' labelPosition='left' onClick={this.handleOpen} />
        <Dialog
          title="ADD ROOF PLANE"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <div className="modal-body">
            <div className="row">
              <LabelInput className="col-md-6"
                label='Description'
                name='Description'
                value={this.state.description}
                placeholder='description'
                onChange={(e) => {
                  this.setState({description: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='Roof Type'
                name='Type'
                value={this.state.type}
                placeholder='Type'
                onChange={(e) => {
                  this.setState({type: e.target.value})
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
                  this.setState({coating: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='Watts (Numbers Only)'
                name='Watts'
                value={this.state.watts}
                placeholder='Watts'
                type='number'
                onChange={(e) => {
                  this.setState({watts: e.target.value})
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Age (Numbers only)'
                name='Age'
                value={this.state.age}
                placeholder='Age'
                type='number'
                onChange={(e) => {
                  this.setState({age: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='Racking'
                name='Racking'
                value={this.state.racking}
                placeholder='Racking'
                onChange={(e) => {
                  this.setState({racking: e.target.value})
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
                  value={this.state.isBallast ? this.state.isBallast : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ isBallast: data.value })
                  }}
                />
              </div>
              <div className='form-group col-md-6'>
                <label htmlFor="">Has Skylights</label>
                <Dropdown
                  placeholder='Has Skylights'
                  fluid selection options={[
                    { text: 'True', value: true, },
                    { text: 'False', value: false, },
                  ]}
                  value={this.state.hasSkylight ? this.state.hasSkylight : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ hasSkylight: data.value })
                  }}
                />
              </div>

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
                  value={this.state.needsReRoof ? this.state.needsReRoof : ''}
                  onChange={(e, data) => {
                    console.log("VALUE IN DROPDOWN ", data)
                    this.setState({ needsReRoof: data.value })
                  }}
                />
              </div>
              <LabelInput className="col-md-6"
                label='Compass (Inches)'
                name='Compass'
                value={this.state.compass}
                placeholder='Compass'
                type='number'
                onChange={(e) => {
                  this.setState({compass: e.target.value})
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='Pitch (Inches)'
                name='Pitch'
                value={this.state.pitch}
                placeholder='Pitch'
                type='number'
                onChange={(e) => {
                  this.setState({pitch: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='Height (Inches)'
                name='Height'
                value={this.state.height}
                placeholder='Height'
                type='number'
                onChange={(e) => {
                  this.setState({height: e.target.value})
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='North Length (Inches)'
                name='North Length'
                value={this.state.northLength}
                placeholder='North Length'
                type='number'
                onChange={(e) => {
                  this.setState({northLength: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='South Length (Inches)'
                name='South Length'
                value={this.state.southLength}
                placeholder='South Length'
                type='number'
                onChange={(e) => {
                  this.setState({southLength: e.target.value})
                }}
              />
            </div>
            <div className="row">
              <LabelInput className="col-md-6"
                label='East Length (Inches)'
                name='East Length'
                value={this.state.eastLength}
                placeholder='East Length'
                type='number'
                onChange={(e) => {
                  this.setState({eastLength: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='West Length (Inches)'
                name='West Length'
                value={this.state.westLength}
                placeholder='West Length'
                type='number'
                onChange={(e) => {
                  this.setState({westLength: e.target.value})
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
                  this.setState({interior: e.target.value})
                }}
              />
              <LabelInput className="col-md-6"
                label='Deck'
                name='Deck'
                value={this.state.deck}
                placeholder='Deck'
                onChange={(e) => {
                  this.setState({deck: e.target.value})
                }}
              />
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}


const AddRoofPlaneWithMutation = graphql(createPlaneMutation)(withRouter(AddRoofPlane));

export default AddRoofPlaneWithMutation;
