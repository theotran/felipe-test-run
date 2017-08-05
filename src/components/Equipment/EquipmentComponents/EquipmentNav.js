import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import { Menu } from 'semantic-ui-react'



class EquipmentNav extends Component {
  constructor(props) {
    super(props);
    console.log('SOME PROPS', props.subPath)
    switch (props.subPath) {
      case 'inverters':
        this.state = { activeItem: 'Inverters'};
        break;
      case 'modules':
        this.state = { activeItem: 'Modules'};
        break;
      case 'optimizers':
        this.state = { activeItem: 'Optimizers'};
        break;
      case 'combiners':
        this.state = { activeItem: 'Combiners'};
        break;
      case 'panelboards':
        this.state = { activeItem: 'Panelboards'};
        break;
      case 'disconnects':
        this.state = { activeItem: 'Disconnects'};
        break;
      case 'meters':
        this.state = { activeItem: 'Meters'};
        break;
      default:
        this.state = { activeItem: 'Inverters'};
        break;
    }
  }

  render() {
    const { activeItem } = this.state;
    console.log('Media Query', this.props.mediaQuery)
    let EquipmentNavInline = (
        <div>
          <Menu inverted color={'teal'} fluid widths={7} icon='labeled' size='mini'>

            <Menu.Item name='Inverters' active={activeItem === 'Inverters'} onClick={(e, data) => {
              this.setState({ activeItem: 'Inverters'})
              browserHistory.push(`/equipment/inverters`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Inverter_Icon_White.svg'/>
              Inverters
            </Menu.Item>

            <Menu.Item name='Modules' active={activeItem === 'Modules'} onClick={(e, data) => {
              this.setState({ activeItem: 'Modules'})
              browserHistory.push(`/equipment/modules`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Module_Icon_White.svg'/>
              Modules
            </Menu.Item>

            <Menu.Item name='Optimizers' active={activeItem === 'Optimizers'} onClick={(e, data) => {
              this.setState({ activeItem: 'Optimizers'})
              browserHistory.push(`/equipment/optimizers`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Optimizer_Icon_White.svg'/>
              Optimizers
            </Menu.Item>

            <Menu.Item name='Combiners' active={activeItem === 'Combiners'} onClick={(e, data) => {
              this.setState({ activeItem: 'Combiners'})
              browserHistory.push(`/equipment/combiners`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Combiner_Icon_White.svg'/>
              Combiners
            </Menu.Item>

            <Menu.Item name='Panelboards' active={activeItem === 'Panelboards'} onClick={(e, data) => {
              this.setState({ activeItem: 'Panelboards'})
              browserHistory.push(`/equipment/panelboards`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Panelboard_Icon_White.svg'/>
              Panelboards
            </Menu.Item>

            <Menu.Item name='Disconnects' active={activeItem === 'Disconnects'} onClick={(e, data) => {
              this.setState({ activeItem: 'Disconnects'})
              browserHistory.push(`/equipment/disconnects`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Disconnect_Icon_White.svg'/>
              Disconnects
            </Menu.Item>

            <Menu.Item name='Meters' active={activeItem === 'Meters'} onClick={(e, data) => {
              this.setState({ activeItem: 'Meters'})
              browserHistory.push(`/equipment/meters`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Meter_Icon_White.svg'/>
              Meters
            </Menu.Item>

          </Menu>
        </div>
    );

    let EquipmentNavStacked = (
        <div className="stackContainer">
          <Menu inverted color={'teal'} fluid widths={4} icon='labeled' size='mini'>

            <Menu.Item name='Inverters' active={activeItem === 'Inverters'} onClick={(e, data) => {
              this.setState({ activeItem: 'Inverters'})
              browserHistory.push(`/equipment/inverters`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Inverter_Icon_White.svg'/>
              Inverters
            </Menu.Item>

            <Menu.Item name='Modules' active={activeItem === 'Modules'} onClick={(e, data) => {
              this.setState({ activeItem: 'Modules'})
              browserHistory.push(`/equipment/modules`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Module_Icon_White.svg'/>
              Modules
            </Menu.Item>

            <Menu.Item name='Optimizers' active={activeItem === 'Optimizers'} onClick={(e, data) => {
              this.setState({ activeItem: 'Optimizers'})
              browserHistory.push(`/equipment/optimizers`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Optimizer_Icon_White.svg'/>
              Optimizers
            </Menu.Item>

            <Menu.Item name='Combiners' active={activeItem === 'Combiners'} onClick={(e, data) => {
              this.setState({ activeItem: 'Combiners'})
              browserHistory.push(`/equipment/combiners`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Combiner_Icon_White.svg'/>
              Combiners
            </Menu.Item>

          </Menu>
          <Menu inverted color={'teal'} fluid widths={3} icon='labeled' size='mini' style={{'marginTop': '-12px'}}>

            <Menu.Item name='Panelboards' active={activeItem === 'Panelboards'} onClick={(e, data) => {
              this.setState({ activeItem: 'Panelboards'})
              browserHistory.push(`/equipment/panelboards`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Panelboard_Icon_White.svg'/>
              Panelboards
            </Menu.Item>

            <Menu.Item name='Disconnects' active={activeItem === 'Disconnects'} onClick={(e, data) => {
              this.setState({ activeItem: 'Disconnects'})
              browserHistory.push(`/equipment/disconnects`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Disconnect_Icon_White.svg'/>
              Disconnects
            </Menu.Item>

            <Menu.Item name='Meters' active={activeItem === 'Meters'} onClick={(e, data) => {
              this.setState({ activeItem: 'Meters'})
              browserHistory.push(`/equipment/meters`)
            }}>
              <img className="projectTabIcon" role="presentation" src='/images/equipment/Meter_Icon_White.svg'/>
              Meters
            </Menu.Item>

          </Menu>
        </div>
    );

    if(this.props.mediaQuery === 'large') {
      return EquipmentNavInline;
    } else {
      return EquipmentNavStacked;
    }
  }
}

export default EquipmentNav;
