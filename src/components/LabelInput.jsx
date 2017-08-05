import React from 'react';
// import { graphql, compose } from 'react-apollo';
// import gql from 'graphql-tag';

export default (props) => {
  return(
    <div className={"form-group " + props.className}>
        <label>{props.label}</label>
        <input
          type={props.type}
          name={props.name}
          className='form-control'
          value={props.value ? props.value : ''}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
          readOnly={props.readOnly}
          min={props.min}
          max={props.max}
        />
    </div>
  )
}
