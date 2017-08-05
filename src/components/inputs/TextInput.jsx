import React from 'react';
import { toLaxTitleCase } from 'titlecase';

export default ({props}) => {
  let newValue = props.value;
  if(props.titleCase){
    newValue = toLaxTitleCase(props.value)
  }
  return(
    <div className={"form-group " + props.className}>
        <label htmlFor={props.label.replace(" ", '')}>{props.label}</label>
        <input
          id={props.label.replace(" ", '')}
          type={props.type}
          name={props.name}
          className='form-control'
          value={newValue ? newValue : ''}
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