import React from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';

export default ({props}) => {
  return(
  			<div className={"form-group " + props.className}>
  			    <label htmlFor={props.label.replace(" ", '')}>{props.label}</label>
	  			<Input style={{width: '100%', font: 'inherit'}}>
					<DatePicker
						style={{width: '100%', font: 'inherit'}}
						textFieldStyle={{width: '100%', height: '2.9rem', border: '1px solid #00B1B3', backgroundColor: 'white', font: 'inherit', paddingLeft: '14px'}}
						locale="en-US"
      					firstDayOfWeek={0}
						autoOk={props.autoOk} 
						underlineStyle={{display: 'none'}}
						id={props.label.replace(" ", '')} 
						value={props.value ? moment(props.value)._d : {}}
						onChange={props.onChange} 
					/>
				</Input>
			</div>
  )
}
	 {/*<FlatButton
	   label="Clear Date"
	   onClick={this.clearSignedDate}
	   style={{marginRight: 5}}
	 />*/}