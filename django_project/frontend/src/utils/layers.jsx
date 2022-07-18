/**
 * Change Layers to groups
 */
export function layerInGroup(layers) {
  const groups = {};
  layers.map(
    layer => {
      const groupName = layer.group ? layer.group : ''
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(layer)
    }
  )
  const currentGroups = groups;
  let orderedGroups = {}
  if (currentGroups[""]) {
    orderedGroups[""] = currentGroups[""]
  }
  delete currentGroups[""]
  orderedGroups = Object.assign({}, orderedGroups, currentGroups);
  return orderedGroups
}