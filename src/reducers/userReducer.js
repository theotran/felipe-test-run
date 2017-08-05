// const initialState = [{
//   fetching: false,
//   fetched: false,
//   users: [],
//   error: null,
// }];

// export const userReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "FETCH_USERS_PENDING": // PENDING, REJECTED, FULFILLED are custom actions from the promise() middleware
//       return  {...state, fetching: true}
//       break;
    
//     case "FETCH_USERS_REJECTED": 
//       return {...state, fetching: false, error: action.payload}
//       break;
    
//     case "FETCH_USERS_FULFILLED": 
//       return {
//         ...state,
//         fetching: false,
//         fetched: true,
//         users: action.payload,
//       }
//       break;
    
//     default: 
//       return state
//   }
// }


export function weaponsReducer(state = [], action){
  switch (action.type) {
    case 'FETCH_WEAPONS_FULFILLED': 
      return {
        ...state,
        weapons: action.payload,
      }
    
    default: 
      return state;
    
  }
}

export function incomeReducer(state = [], action){
  switch (action.type) {
    case 'FETCH_INCOME_FULFILLED':
    return {
      ...state,
      income: action.payload,
    }

    default: 
      return state;
  }
}
