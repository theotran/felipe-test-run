import React, { Component } from 'react';
import GoogleMapReact from 'google-maps-react';
import { Icon } from 'semantic-ui-react'

const AnyReactComponent = ({ text }) => (
  // <div style={{
  //   position: 'relative', color: 'white', background: 'red',
  //   height: 40, width: 60, top: -20, left: -30,
  // }}>
  //   {text}
  // </div>
  <Icon color='teal' size='big' circular name='marker' />
);

class SimpleMap extends React.Component {
  static defaultProps = {
    center: {lat: 37.7831, lng: -122.4041},
    zoom: 11
  };

  render() {
    return (
      <div style={{width: '100%', height: '900px'}}>
       <GoogleMapReact
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      >
        <AnyReactComponent
          lat={37.7831}
          lng={-122.4041}
          text={'Kreyser Avrora'}
        />
      </GoogleMapReact>
    </div>
    );
  }
}

export default SimpleMap;
