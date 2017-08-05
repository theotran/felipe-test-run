import * as actionTypes from '../actions/actionTypes';


//for handling an array of books
export const customersReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.CREATE_CUSTOMER_SUCCESS:
      return [
        ...state,
        Object.assign({}, action.book)
      ];
    case actionTypes.FETCH_CUSTOMERS_SUCCESS:
      return action.customers;

    default:
      return state;
  }
};

//for handling a single book
export const customerReducer = (state = [], action) => {
  switch (action.type) {
    //handle fetch by id
    case actionTypes.FETCH_CUSTOMER_BY_ID_SUCCESS:
      return action.customer;

    default: 
      return state;
  }
};