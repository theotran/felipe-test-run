

export function itemsHasErrored(state = false, action){
  switch (action.type) {
    case 'ITEMS_HAS_ERRORED':
      return action.hasErrored;
    default: 
      return state;
  }
}

export function itemsIsLoading(state = false, action){
  switch (action.type) {
    case 'ITEMS_IS_LOADING':
      return action.isLoading;
    default:
      return state;
  }
}

export const data = (state = [], action) => {// es6 default parameter value 
  switch (action.type) {
    case 'ITEMS_FETCH_DATA_SUCCESS':
      return action.data;// .data comes from the action

    case 'ITEMS_REMOVE_ITEM':
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];

    default:
      return state;
  }
}

