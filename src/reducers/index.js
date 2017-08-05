import {combineReducers} from 'redux';
import { data  } from './items';//importing our reducers 
import { weaponsReducer, incomeReducer } from './userReducer';
import { customersReducer, customerReducer } from './customerReducer';


const rootReducer = combineReducers({//then export them using combineReducers
  data: data,
  weaponsReducer: weaponsReducer,
  customerReducer: customerReducer,
  customersReducer: customersReducer,
  incomeReducer: incomeReducer,
  // apollo: client.reducer()
});//In order to create a store with nested objects, we define each section with a reducer 

console.log(client);

export default rootReducer;