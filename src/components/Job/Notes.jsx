import React, { Component } from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import moment from 'moment';

class Note extends Component {

  constructor(props) {
    super(props);


    this.state = {
      expanded: false,
    };
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


  render() {
    console.log("NOTE PROPS", this.props)
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          //avatar={<SectionIcon />}
          title={"Created By: " + this.props.note.createdBy.firstName + this.props.note.createdBy.lastName + " at " + moment(this.props.note.createdAt).format('lll')}
          subtitle={"Description: " + this.props.note.text}
          titleColor={" #00B1B3"}
        />

      </Card>
    );
  }
}

export default Note;
