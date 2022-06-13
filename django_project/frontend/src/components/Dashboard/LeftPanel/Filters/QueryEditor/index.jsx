/* ==========================================================================
   QUERY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import parser from 'js-sql-parser';
import { useSelector } from "react-redux";
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
  IDENTIFIER,
  indicatorsToById,
  queryIndicator
} from '../../../../../utils/queryExtraction'

import Filters from './Filters'
import Froms from './Froms'

/***
 * Return All From as List
 */
function getFrom(from, upperForm) {
  let fromQuery = []
  switch (from.type) {
    case "TableFactor":
      fromQuery = fromQuery.concat([[from.value.value, upperForm, from]])
      break
    default:
      fromQuery = fromQuery.concat(
        getFrom(from.left, null)).concat(getFrom(from.right, from));
      break
  }
  return fromQuery;
}

/**
 * Query editor
 * @param {str} queryInit Query Data
 * @param {function} onQueryChangeFn When the query changed.
 */
export default function QueryEditor({ queryInit, onQueryChangeFn }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  const [query, setQuery] = useState(
    queryInit ? queryInit : `SELECT *
                             FROM ${IDENTIFIER}0`);
  let astInit = null
  try {
    astInit = parser.parse(query);
  } catch (err) {
  }
  const [ast, setAst] = useState(astInit);

  // Format indicator list
  const indicatorById = indicatorsToById(indicators);
  const indicatorList = indicators.map(indicator => {
    return {
      'id': `${IDENTIFIER}${indicator.id}`,
      'name': indicator.name
    }
  })

  useEffect(() => {
    if (queryInit) {
      setQuery(queryInit);
    }
  }, [queryInit]);

  useEffect(() => {
    if (query) {
      try {
        setAst(parser.parse(query));
      } catch (err) {
        setAst(null);
      }
    }
  }, [query]);


  const saveQuery = (query) => {
    onQueryChangeFn(query.replace(/ +(?= )/g, ''));
  }
  /** Set new Ast for query */
  const setNewAst = (newAst) => {
    setAst(newAst);
    saveQuery(parser.stringify(newAst));
  }

  const updateAst = () => {
    setNewAst({ ...ast })
  }

  /**
   * Add new Where
   */
  const addWhere = () => {
    let query = parser.stringify(ast);
    if (!query.includes('WHERE')) {
      query += ' WHERE field=""'
    } else {
      if (query.includes('ORDER BY')) {
        query = query.replaceAll(
          'ORDER BY', ' AND field="" ORDER BY'
        )
      } else {
        query += ' AND field=""'
      }
    }
    saveQuery(query);
  }

  if (!ast) {
    return <div>The query is error</div>
  }
  // get indicator fields
  let indicatorFields = []
  let indicatorFieldsIds = []
  const froms = getFrom(ast.value.from.value[0].value);
  froms.map((from, idx) => {
    const indicator = indicatorById[from[0].replaceAll(IDENTIFIER, '')]
    if (indicator && indicator.data) {
      const indicatorData = queryIndicator(indicator.data)[0];
      for (const [key, value] of Object.entries(indicatorData)) {
        const id = `${from[0]}.${key}`;
        if (!indicatorFieldsIds.includes(id)) {
          indicatorFields.push({
            'id': id,
            'name': `${indicator.name}.${key}`,
          })
          indicatorFieldsIds.push(id);
        }
      }
    }
    indicatorFields = [...new Set(indicatorFields)];
  })

  return <Fragment>
    <Froms
      ast={ast} froms={froms} saveQuery={saveQuery} updateAst={updateAst}
      indicatorList={indicatorList}
      indicatorFields={indicatorFields}
    />
    <div className='section'>
      <b className='light section__add'>WHERE <AddBoxIcon
        onClick={addWhere}/></b>
    </div>
    <Filters
      ast={ast} saveQuery={saveQuery} updateAst={updateAst}
      indicatorFields={indicatorFields}
    />
  </Fragment>
}