/**
 * Change Layers to groups
 */
export function layerInGroup(layers) {
  const groups = {
    'groups': {},
    'layers': []
  };
  layers.map(
    layer => {
      let groupDict = groups;
      const groupName  = layer.group ? layer.group : ''
      groupName.split('/').forEach(group => {
        if (!groupDict['groups'][group]) {
          groupDict['groups'][group] = {
            'groups': {},
            'layers': []
          }
        }

        groupDict = groupDict['groups'][group];
      })
      if (groupDict.layers) {
        groupDict.layers.push(layer)
      }
    }
  )
  return groups
}