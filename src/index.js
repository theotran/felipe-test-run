//React
import React from 'react';
import {render} from 'react-dom';
import 'react-datepicker/dist/react-datepicker.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

import fragmentMatcher from './fragmentMatcher';

// //Redux
// import {combineReducers} from 'redux';
// import { data } from './reducers/items';//importing our reducers
// import { weaponsReducer, incomeReducer } from './reducers/userReducer';
// import { customersReducer, customerReducer } from './reducers/customerReducer';
// import configureStore from './store/configureStore';
// import axios from 'axios';

//Apollo
import ApolloClient, { addTypeName } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createNetworkInterface } from 'apollo-upload-client';
console.log(createNetworkInterface)

//Components
import App from './App';

// Subscriptions
// import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';


injectTapEventPlugin();

// http://localhost:4000/graphql
// http://ryion-dev-server.us-west-2.elasticbeanstalk.com/graphql
// https://api.ryion.com/graphql
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
  opts: {
    credentials: 'same-origin',
  }
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('ryionAuthToken');
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pY2t0ZXN0IiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE0OTA4NDI5MDQsImV4cCI6MTQ5MDkyOTMwNH0.lsj0DFR9lvKL0gnOlE0cOqScvo-XYTLUE_zF21xis9g";
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    //console.log("request=", req);
    next();
  }
}]);

// Create WebSocket client
// const wsClient = new SubscriptionClient(`ws://localhost:5000/`, {
//     reconnect: true,
//     connectionParams: {
//         authorization : localStorage.getItem('ryionAuthToken')
//     }
// });


// Extend the network interface with the WebSocket
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//     networkInterface,
//     wsClient
// );



//Apollo client
const client = new ApolloClient({
  networkInterface: networkInterface,
  queryTransformer: addTypeName,
  dataIdFromObject: o => o.id,
  shouldBatch: true,
  connectToDevTools: true,
  fragmentMatcher: fragmentMatcher
});

export default client;

// //Root reducer
// export const rootReducer = combineReducers({//then export them using combineReducers
//   data: data,
//   weaponsReducer: weaponsReducer,
//   customerReducer: customerReducer,
//   customersReducer: customersReducer,
//   incomeReducer: incomeReducer,
//   apollo: client.reducer()
// });//In order to create a store with nested objects, we define each section with a reducer

// const store = configureStore();//you can also pass in initalState here

// store.dispatch({
//   type: 'FETCH_WEAPONS',
//   payload: axios.get("http://mysafeinfo.com/api/data?list=cod4weapons&format=json")
// });


render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
