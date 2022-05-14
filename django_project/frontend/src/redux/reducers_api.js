/**
 * Base reducer for an api request.
 *
 * @param {object} state The state.
 * @param {object} action The action.
 * @param {string} actionName The action name to use as suffix
 */
export function APIReducer(state, action, actionName) {
  switch (action.type) {
    case `REQUEST_${actionName}`:
      return {
        fetching: true,
        fetched: false,
        data: {},
        error: null
      };
    case `RECEIVE_${actionName}`:
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

/**
 * PerformFetchingData
 *
 * @param {Function} dispatch Url to query
 * @param {string} url Url to query
 * @param {object} options Options of request
 * @param {Function} receiveAction Function on receiveing data
 */
export const fetching = async function (dispatch, url, options, receiveAction) {
  try {
    const response = await fetchJSON(url, options);
    dispatch(receiveAction(response));
  } catch (error) {
    dispatch(receiveAction(null, error));
  }
};

/**
 * Perform request to fetch json
 *
 * @param {string} url Url to query
 * @param {object} options Options for fetch
 */
export async function fetchJSON(url, options) {
  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (response.status >= 400) {
      const err = new Error(json.message);
      err.data = json;
      throw err;
    }

    return json;
  } catch (error) {
    throw error;
  }
}