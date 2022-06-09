import alasql from "alasql";
import parser from 'js-sql-parser';

export const IDENTIFIER = 'indicator_'

/**
 * Return indicator query
 * @param {array} indicatorData
 */
export function queryIndicator(indicatorData) {
  return alasql('SELECT * FROM ?', [indicatorData])
}

/**
 * Change indicators to indicatorsByID
 * @param {array} indicators
 */
export function indicatorsDataToById(indicators) {
  const indicatorsByID = {}
  indicators.forEach((indicator) => {
    indicator.data = indicator.rawData;
    indicatorsByID[indicator.id] = indicator.rawData;
  });
  return indicatorsByID
}

/**
 * Change indicators to indicatorsByID
 * @param {array} indicators
 */
export function indicatorsToById(indicators) {
  const indicatorsByID = {}
  indicators.forEach((indicator) => {
    indicator.data = indicator.rawData;
    indicatorsByID[indicator.id] = indicator;
  });
  return indicatorsByID
}

/**
 * Return data with querying
 * @param {dict} indicatorsByID
 * @param {str} query
 */
export function queryFilter(indicatorsByID, query) {
  parsingQuery(query)
  var separators = ['FROM ' + IDENTIFIER, 'JOIN ' + IDENTIFIER];
  const indicators_from = query.split(new RegExp(separators.join('|'), 'g'))
  const indicators = [];
  indicators_from.forEach((indicator, idx) => {
    const indicatorData = indicatorsByID[indicator.split(" ")[0]]
    if (indicatorData) {
      indicators.push(indicatorData)
    }
  })
  return alasql(query.replaceAll('FROM', 'FROM ?').replaceAll('JOIN', 'JOIN ?'), indicators)
}

/**
 * Query indicators
 * @param {array} indicators
 * @param {str} query
 */
export function queryIndicators(indicators, query) {
  const indicatorsByID = {}
  indicators.forEach((indicator) => {
    indicator.data = indicator.rawData;
    indicatorsByID[indicator.id] = indicator.rawData;
  });
  return queryFilter(indicatorsByID, query)
}

/**
 * Return geometry codes that working through the query
 * @param {dict} indicatorsByID
 * @param {str} query
 */
export function queryGeoms(indicatorsByID, query) {
  return queryFilter(indicatorsByID, query).map(data => {
    return data.geometry_code;
  })
}

/**
 * Return parsed query
 * @param {str} query
 */
export function parsingQuery(query) {
  const ast = parser.parse(query.replaceAll(' ?', ''));
}