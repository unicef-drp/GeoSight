/**
 * Base reducer for an api request.
 *
 * @param {object} state The state.
 * @param {object} action The action.
 * @param {string} actionName The action name to use as suffix.
 */
export function APIReducer(state, action, actionName) {
  switch (action.type) {
    case `REQUEST/${actionName}`:
      return {
        fetching: true,
        fetched: false,
        data: {},
        error: null
      };
    case `RECEIVE/${actionName}`:
      let newState = {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {},
        error: null
      };

      if (action.error) {
        newState.error = action.error;
      } else {
        newState.data = action.data;
      }
      return newState;
  }
  return state;
}
