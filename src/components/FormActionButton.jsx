import React from 'react';
// import { graphql, compose } from 'react-apollo';
// import gql from 'graphql-tag';

export default (props) => {
  console.log("in add button",this);
  // this.addInverter = () => {
  //   console.log("onClick");
  // }
  return(
    <button type="button" onClick={props.onClick} className={"form-group btn btn-primary " + props.className}>{props.text}</button>
  )
}