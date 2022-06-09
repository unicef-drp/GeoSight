/**
 * Return filters in Group
 * @param {array} filters List of filters.
 */

export function returnInGroup(filters) {
  let filtersInGroup = null;
  if (filters) {
    filtersInGroup = {}
    filters.map((filter, idx) => {
      filter.id = idx;
      if (!filtersInGroup[filter.group]) {
        filtersInGroup[filter.group] = []
      }
      filtersInGroup[filter.group].push(filter);
    })
  }
  return filtersInGroup
}