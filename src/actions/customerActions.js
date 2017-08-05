import * as actionTypes from './actionTypes';
import axios from 'axios';

const apiUrl = 'http://mysafeinfo.com/api/data?list=employers&format=json';

//sync action
export const fetchCustomersSuccess = (customers) => {
  return {
    type: 'FETCH_CUSTOMERS_SUCCESS',
    customers
  }
};

//async
export const fetchCustomers = () => {
  //Returns a dispatcher function that dispatches an action at a later time
  return (dispatch) => {
    //returns a promise
    return axios.get(apiUrl)
      .then(response => {
        //dispatch another action to consume data
        dispatch(fetchCustomersSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      }); 
  };
};

//sync action
export const createCustomerSuccess = (customer) => {
  return {
    type: 'CREATE_CUSTOMER_SUCCESS',
    customer
  }
}

//async
export const createCustomer = (customer) => {
  return (dispatch) => {
    return axios.post(apiUrl, customer)
      .then(response => {
        //dispatch a synchronous action to handle data
        dispatch(createCustomerSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

//sync action 
export const fetchCustomerByIdSuccess = (customer) => {
  return {
    type: actionTypes.FETCH_CUSTOMER_BY_ID_SUCCESS,
    customer
  }
};

//async action
export const fetchCustomerById = (customerId) => {
  return (dispatch) => {
    return axios.get(apiUrl + '/' +customerId)
      .then(response => {
        //handle data with async action
        dispatch(fetchCustomerByIdSuccess(response.data));
      })
      .catch(error => {
        throw(error);
      });
  };
};







