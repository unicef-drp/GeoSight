import alasql from "alasql";
import parser from 'js-sql-parser';

/**
 * Return geometry codes that working through the query
 * @param {dict} indicatorsByID
 * @param {str} query
 */
export function queryGeoms(indicatorsByID, query) {
  parsingQuery(query)
  const indicators_from = query.split('? indicator_')
  const indicators = [];
  indicators_from.forEach((indicator, idx) => {
    const indicatorData = indicatorsByID[indicator.split(" ")[0]]
    if (indicatorData) {
      indicators.push(indicatorData)
    }
  })
  return alasql(query, indicators).map(data => {
    return data.geometry_code;
  })
}

/**
 * Return parsed query
 * @param {str} query
 */
export function parsingQuery(query) {
  const ast = parser.parse(query.replaceAll(' ?', ''));
  console.log(ast)
}