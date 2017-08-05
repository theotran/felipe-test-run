import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { rootReducer } from '../index';//combined reducers
import promise from 'redux-promise-middleware';


export default function configureStore(initialState){
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(promise(), thunk, logger())
  );
}


