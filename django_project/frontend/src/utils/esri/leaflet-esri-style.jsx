/**
 * Read Symbol
 */
const readSymbol = (symbol) => {
  switch (symbol.type) {
    case 'esriSMS':
      switch (symbol.style) {
        case 'esriSMSCircle':
          return {
            type: 'circle',
            style: {
              radius: symbol.size,
              fillColor: symbol.color ? `rgba(${symbol.color.join(',')})` : null,
              color: symbol.outline && symbol.outline.color ? `rgba(${symbol.outline.color.join(',')})` : null,
              weight: symbol.outline && symbol.outline.width ? symbol.outline.width : null,
              fillOpacity: 0.7
            },
          };
        default:
          return
      }
    case 'esriPMS':
      let icon = {
        iconUrl: `data:image/png;base64,${symbol.imageData}`,
        rotation: symbol.angle,
      };
      if (symbol.height && symbol.width) {
        icon['height'] = symbol.height;
        icon['width'] = symbol.width;
        icon['iconSize'] = [symbol.width, symbol.height];
      }
      return {
        type: 'icon',
        style: icon
      };

    case 'esriSLS':
      return {
        type: 'line',
        style: {
          color: `rgba(${symbol.color.join(',')})`,
          width: symbol.width,
          fillOpacity: 0.7
        },
      };
    case 'esriSFS':
      let style = symbol.outline ? readSymbol(symbol.outline) : {};
      return {
        type: 'polygon',
        style: {
          color: style ? style['style']?.color : null,
          weight: style ? style['style']?.width : 0,
          fillColor: `rgba(${symbol.color.join(',')})`,
          fillOpacity: 0.7
        },
      };
    default:
      throw `Symbol type ${symbol.type} is not implemented yet.`;
  }
};

/** From degree to radians
 * @param degrees
 */
const toRadians = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi / 180);
}
export default function parseArcRESTStyle(data) {
  /**
   * Parse Arcrest layer style json for style details
   * ESRI Alpha is scaled up tp 255 - use maxTrans ceiling
   * @param  {json} data ArcREST response as json
   * @return {ol.style.Style}     Style to apply
   */
  const drawingInfo = data.drawingInfo;
  switch (drawingInfo.renderer.type) {
    case "classBreaks":
    case "uniqueValue": {
      let info = {
        type: data.type,
        geometryType: data.geometryType,
        classifications: []
      };

      // CHeck which field need to check as classification
      if (drawingInfo.renderer.field1) {
        info['fieldName'] = drawingInfo.renderer.field1
      } else if (drawingInfo.renderer.field) {
        info['fieldName'] = drawingInfo.renderer.field
      }

      let list = []
      if (drawingInfo.renderer.type === "classBreaks") {
        list = drawingInfo.renderer.classBreakInfos;
      } else if (drawingInfo.renderer.type === "uniqueValue") {
        list = drawingInfo.renderer.uniqueValueInfos;
      }
      list.forEach(
        renderer => {
          renderer['style'] = readSymbol(renderer.symbol);
          info['classifications'].push(renderer);
          info['classificationValueMethod'] = renderer.classMaxValue !== undefined ? 'classMaxValue' : 'classExactValue';
        }
      );
      return info;
    }
    case "simple": {
      let info = {
        type: data.type,
        geometryType: data.geometryType,
        classificationValueMethod: 'noClassification'
      };
      info['style'] = readSymbol(drawingInfo.renderer.symbol);
      return info;
    }
    default: {
      return null;
    }
  }
};
