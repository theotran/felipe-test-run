

import React from 'react';

export default (props) => {
  return(
    <div className={props.className}>
        <label>{props.label}</label>
        <input
          type="checkbox"
          name={props.name}
          value={props.label}
          checked={props.isChecked}
          onChange={props.onChange}
        />
    </div>
  )
}

















