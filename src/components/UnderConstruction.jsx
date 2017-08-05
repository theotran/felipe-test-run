import React, { Component, Image } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import underConstruction from '../../public/images/ComingSoon.png';


class UnderConstructionPage extends Component {

  render(){
    console.log("ERRORPAGE");
    return(
      <div>
        <img className="img-responsive" src={underConstruction}/>
      </div>
    )
  };
}


export default UnderConstructionPage;
