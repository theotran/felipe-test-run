import React, { Component } from 'react';
import { EquipmentNav, InvertersWithQuery} from './EquipmentComponents';
import MediaQueryable from 'react-media-queryable';
import { Link } from 'react-router';

console.log(EquipmentNav)


class EquipmentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    let subPath = this.props.location.pathname.split('/');
    if (subPath.length < 3) {
      subPath = 'inverters';
    } else {
      subPath = subPath[subPath.length - 1];
    }
    let mediaQueries = {
      small: '(max-width: 1100px)',
      large: '(min-width: 1101px)'
    };
    return (
      <div>
        <div className="panel panel-success">
          <div className="panel-body">
            <MediaQueryable mediaQueries={mediaQueries} defaultMediaQuery="small">
              <EquipmentNav subPath={subPath}/>
            </MediaQueryable>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default EquipmentPage;
