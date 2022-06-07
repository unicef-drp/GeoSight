import parser from 'js-sql-parser';

/**
 * Return indicators by ID
 * @param {dict} indicatorsByID
 * @param {str} query
 *
 * TODO:
 *  Find in elegant way
 */
export function queryGeoms(indicatorsByID, query) {
  const ast = parser.parse(query);
  // this is utils for filtering
  const indicators = {}
  ast.value.from.value.map((table) => {
    indicators[table.value.value.value] = indicatorsByID[table.value.value.value];
  })

  return whereCheck(indicators, ast.value.where);
}

/**
 * Return geoms for where filter
 * @param {dict} indicatorsByID Indicators by ID
 * @param {dict} where Where
 */
export function whereCheck(indicatorsByID, where) {
  let geoms = [];
  const operator = where.operator;
  switch (operator) {
    case 'AND': {
      const geoms_1 = whereCheck(indicatorsByID, where.left);
      const geoms_2 = whereCheck(indicatorsByID, where.right);
      geoms = geoms_1.filter(function (n) {
        return geoms_2.indexOf(n) !== -1;
      });
      break;
    }
    case 'OR': {
      const geoms_1 = whereCheck(indicatorsByID, where.left);
      const geoms_2 = whereCheck(indicatorsByID, where.right);
      geoms = geoms_1.concat(geoms_2);
      break;
    }
    default: {
      const property = where.left.value;
      const value = where.right.value.replaceAll('"', '');
      geoms = queryIndicator(indicatorsByID, operator, property, value);
      break;
    }
  }
  return geoms
}


/**
 * Return geoms list in equal
 * @param {dict} indicatorsByID Indicators by ID
 * @param {str} operator Operator of operation
 * @param {str} property Property that will be checked
 * @param {str} value Value that will be checked
 */
export function queryIndicator(indicatorsByID, operator, property, value) {
  let geoms = [];
  for (const [indicatorId, indicatorData] of Object.entries(indicatorsByID)) {
    const identifier = property.replaceAll(indicatorId + '.', '').replaceAll('"', '');
    geoms = geoms.concat(operateQuery(indicatorData, operator, identifier, value));
  }
  return geoms;
}

/**
 * Operate query
 * @param {array} indicatorData
 * @param {str} operator Operator of operation
 * @param {str} property Property that will be checked
 * @param {str} value Value that will be checked
 */
export function operateQuery(indicatorData, operator, property, value) {
  const geoms = [];
  let compVal = isNaN(parseFloat(value)) ? value : parseFloat(value);
  indicatorData.forEach((properties) => {
    let propVal = isNaN(parseFloat(properties[property])) ?
      properties[property] :
      parseFloat(properties[property]);
    switch (operator) {
      case '=': {
        if (propVal === compVal) {
          geoms.push(properties.geometry_code)
        }
        break;
      }
      case '>': {
        if (propVal > compVal) {
          geoms.push(properties.geometry_code)
        }
        break;
      }
      case '>=': {
        if (propVal >= compVal) {
          geoms.push(properties.geometry_code)
        }
        break;
      }
      case '<': {
        if (propVal < compVal) {
          geoms.push(properties.geometry_code)
        }
        break;
      }
      case '<=': {
        if (propVal <= compVal) {
          geoms.push(properties.geometry_code)
        }
        break;
      }
    }
  });
  return geoms;
}