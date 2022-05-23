/**
 * Base reducer for an api request.
 *
 * @param {object} state The state.
 * @param {object} action The action.
 * @param {string} actionName The action name to use as suffix
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

/**
 * PerformFetchingData
 *
 * @param {Function} dispatch Dispatch
 * @param {string} url Url to query
 * @param {object} options Options of request
 * @param {Function} receiveAction Function on receiveing data
 * @param {int} id ID of request
 */
export const fetching = async function (dispatch, url, options, receiveAction, id) {
  try {
    const response = await fetchJSON(url, options);
    dispatch(receiveAction(response, null, id));
  } catch (error) {
    dispatch(receiveAction(null, error, id));
  }
};
/**
 * PerformFetchingData
 *
 * @param {string} url Url to query
 * @param {object} options Options of request
 * @param {Function} receiveAction Function on receiveing data
 */
export const fetchingData = async function (
  url, options, receiveAction
) {
  try {
    const response = await fetchJSON(url, options);
    receiveAction(response, null);
  } catch (error) {
    receiveAction(null, error);
  }
};

/**
 * Perform request to fetch json
 *
 * @param {string} url Url to query
 * @param {object} options Options for fetch
 */
// TODO:
//  Make cache in elegant way
const responseCaches = {}

export async function fetchJSON(url, options) {
  if (!responseCaches[url]) {
    try {
      const response = await fetch(url, options);
      const json = await response.json();

      if (response.status >= 400) {
        const err = new Error(json.message);
        err.data = json;
        throw err;
      }
      responseCaches[url] = json;
      return json;
    } catch (error) {
      throw error;
    }
  } else {
    return responseCaches[url]
  }
}