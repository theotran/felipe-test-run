import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import GetJobQuery from '../../queries/GetJobQuery';
import { Header } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import MediaQueryable from 'react-media-queryable';
import ProjectNav from './ProjectNav';



class JobPage extends Component {

  goBack() {
    this.props.router.replace('/');
  }

  render() {


    let mediaQueries = {
      small: "(max-width: 1100px)",
      large: "(min-width: 1101px)"
    };
    return (
      <div>
        <Header as='h2' color='grey' textAlign='center'>{"Test Job Name"}</Header>
        <ProjectNav />
        {React.cloneElement(this.props.children)}
      </div>
    );
  }
}




export default JobPage;
