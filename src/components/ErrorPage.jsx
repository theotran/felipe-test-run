import React, { Component, Image } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import pdfError from '../../public/images/RYION_UI_ERROR_BG.png';


class ErrorPage extends Component {

  render(){
    console.log("ERRORPAGE");
    return(
      <div>
        <img className="img-responsive" src={pdfError}/>
      </div>
    )
  };
}


export default ErrorPage;
