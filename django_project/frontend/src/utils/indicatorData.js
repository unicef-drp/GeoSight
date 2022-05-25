/**
 * Return data from indicators.
 * @param {int} layer_id ID Of Layer
 * @param {string} layer_used Layer that used.
 * @param {string} layersData Layers that used.
 * @param {string} property_value Key of property that will be used.
 * @param {boolean} ignore_property_value Ignore property_value.
 */

export function cleanLayerData(
  layer_id, layer_used, layersData, property_value,
  ignore_property_value
) {
  switch (layer_used) {
    case definition.WidgetLayerUsed.INDICATOR:
      if (layersData) {
        const layers = layersData.filter((layer) => {
          return layer.id === layer_id;
        })

        if (layers[0]) {
          if (layers[0]['data']) {
            const output = [];
            layers[0]['data'].forEach(function (layer) {
              if (ignore_property_value) {
                output.push(layer)
              } else if (layer[property_value] !== undefined) {
                output.push({
                  ...layer,
                  'value': layer[property_value],
                })
              }
            })
            return output;
          } else {
            return null;
          }
        } else {
          throw new Error(`${layer_used} with id '${layer_id}' is not found.`);
        }
      }
      return null;
    default:
      throw new Error(`Plugin using Layer : ${layer_used} does not work.`);
  }
}