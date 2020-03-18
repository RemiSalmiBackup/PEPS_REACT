import {
    FETCH_ANSWER_BEGIN,
    FETCH_ANSWER_SUCCESS,
    FETCH_ANSWER_FAILURE,
    LIKE_SUCCESS,
    DISLIKE_SUCCESS
  } from '../actions/answerAction';
  
  var jwt = require('jsonwebtoken');

  const initialState = {
    byId : {},
    allIds : [],
    loading: false,
    error: null
  };
  
  export default function userReducer(state = initialState, action) {
    switch(action.type) {
      case FETCH_ANSWER_BEGIN:
        // Mark the state as "loading" so we can show a spinner or something
        // Also, reset any errors. We're starting fresh.
        return {
            ...state,
            loading: true,
            error: null
        };
  
      case FETCH_ANSWER_SUCCESS:
        // All done: set loading "false".
        // Also, replace the items with the ones from the server
        let newById = {}
        action.payload.answers.map(answer => {
            answer.likes = []
            return newById[answer.idAnswer] = answer
        })

        let newAllIds = []
        action.payload.answers.map(answer => {
            return newAllIds.push(answer.idAnswer)
        })

        action.payload.likes.map(like => {
            return newById[like.idAnswer].likes.push(like.idUser)
            
        })
        return {
            ...state,
            loading: false,
            byId : newById,
            allIds : newAllIds
        };
  
      case FETCH_ANSWER_FAILURE:
        // The request failed. It's done. So set loading to "false".
        // Save the error, so we can display it somewhere.
        // Since it failed, we don't have items to display anymore, so set `items` empty.
        //
        // This is all up to you and your app though:
        // maybe you want to keep the items around!
        // Do whatever seems right for your use case.
        return {
            ...state,
            loading: false,
            error: action.payload.error,
            byId : {},
            allIds : [],
        };
      case LIKE_SUCCESS:
        console.log("action.payload.answer")
        console.log(action.payload.answer)
        let byIdLike = state.byId
        let answerToLike = action.payload.answer
        answerToLike.likes.push(jwt.decode(action.payload.token).idUser)
        byIdLike[action.payload.answer.idAnswer] = answerToLike
        let allIdsLike = state.allIds
        return {
          ...state,
          loading: false,
          byId : byIdLike,
          allIds : allIdsLike
      };

      case DISLIKE_SUCCESS:
        let byIdDislike = state.byId
        let answerToDislike = action.payload.answer
        answerToDislike.likes.push(jwt.decode(action.payload.token).idUser)
        byIdDislike[action.payload.answer.idAnswer] = answerToDislike
        let allIdsDislike = state.allIds
        return {
          ...state,
          loading: false,
          byId : byIdDislike,
          allIds : allIdsDislike
      };
  
      default:
        // ALWAYS have a default case in a reducer
        return state;
    }
  }