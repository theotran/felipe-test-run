import React from 'react';
import { Input, Label } from 'semantic-ui-react';
import Cleave from 'cleave.js/react';
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.us'

export default ({props}) => {
  let leftLabel = null;
  let rightLabel = null;
  if(props.leftLabel){
    leftLabel = <Label>{props.leftLabel}</Label>
  }
  if(props.rightLabel){
    rightLabel = <Label>{props.rightLabel}</Label>
  }
  let newVal = props.value;
  if(newVal > props.max){
    newVal = props.max
  }
  if(newVal < props.min){
    newVal = props.min
  }
  return(
    <div className={"form-group " + props.className}>
        <label htmlFor={props.label.replace(" ", '')}>{props.label}</label>
        <Input
          id={props.label.replace(" ", '')}
          name={props.name}
          readOnly={props.readOnly}
          type="number"
          label={props.sLabel}
        >
          {leftLabel}
          <Cleave
            min={props.min}
            max={props.max}
            value={newVal ? newVal : ''}
            placeholder={props.placeholder}
            options={props.cleaveOptions}
            onChange={props.onChange}
            onBlur={props.onBlur}
            style={{height: '2.9rem'}}
          >
          </Cleave>
          {rightLabel}
        </Input>

    </div>
  )
}