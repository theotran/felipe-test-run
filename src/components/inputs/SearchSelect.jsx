import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export default ({props}) => {
  return(
    <div className={props.className}>
      <label htmlFor={props.label.replace(" ", '')}>{props.label}</label>
      <Dropdown
        id={props.label.replace(" ", '')}
        placeholder={props.placeholder}
        fluid
        search
        selection
        options={props.options}
        value={props.value}
        onChange={props.onChange}
      />
    </div>

  )
}