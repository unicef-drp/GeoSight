import { combineReducers } from 'redux';
import { DECREASE_COUNTER, INCREASE_COUNTER } from './actions/counter'

/**
 * User reducer
 */
const userInitialState = user;

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

/**
 * COUNTER reducer
 */
const counterInitialState = {
  value: 0
};

function counterReducer(state = counterInitialState, action) {
  switch (action.type) {
    case INCREASE_COUNTER:
      return { ...state, value: state.value + 1 };
    case DECREASE_COUNTER:
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
}

export default combineReducers({
  counter: counterReducer,
  user: userReducer,
});
