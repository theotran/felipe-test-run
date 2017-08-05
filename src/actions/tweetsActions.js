import axios from 'axios';

export function fetchTweets() {
  return function(dispatch) {
    axios.get('http://test.learncode.academy/api/test123/tweets')
      .then((response) => {
        dispatch({type: 'FETCH_TWEETS_FULFILLED', payload: response.data})
      })
      .catch((err) => {
        dispatch({type: 'FETCH_TWEETS_REJECTED', payload: err})
      })
  }
}

export function addTweet(id, tweet) {
  return {
    type: 'ADD_TWEET',
    payload: {
      id,
      text
    },
  }
}

