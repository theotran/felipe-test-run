export function itemsHasErrored(bool){
  return {
    type: 'ITEMS_HAS_ERRORED',
    hasErrored: bool
  };
}

export function itemsIsLoading(bool){
  return {
    type: 'ITEMS_IS_LOADING',
    isLoading: bool
  };
}

export function itemsFetchDataSuccess(data){
  return {
    type: 'ITEMS_FETCH_DATA_SUCCESS',
    data//es6 shorthand for data: data
  }
}

//Action Creator using Thunk
export function itemsFetchData(url){
  return (dispatch) => {
    dispatch(itemsIsLoading(true));

    fetch(url)
      .then((response) => {
        if(!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(itemsIsLoading(false));

        return response;
      })
      .then((response) => response.json())
      .then((items) => dispatch(itemsFetchDataSuccess(items)))
      .catch(() => dispatch(itemsHasErrored(true)));
  };
}

export function itemsRemoveItem(index){
  return {
    type: 'ITEMS_REMOVE_ITEM',
    index
  }
}






