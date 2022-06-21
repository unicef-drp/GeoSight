/**
 * Change context layers to groups
 */
export function contextLayerInGroup(contextLayers) {
  const groups = {
    'groups': {},
    'layers': []
  };
  contextLayers.map(
    layer => {
      let groupDict = groups;
      layer.group.split('/').forEach(group => {
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