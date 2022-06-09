/* ==========================================================================
   QUERY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import parser from 'js-sql-parser';
import { useSelector } from "react-redux";
import { Button, Input } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloseIcon from '@mui/icons-material/Close';

import { SelectPlaceholder } from '../../../Input'
import {
  IDENTIFIER,
  indicatorsToById,
  queryIndicator
} from '../../../../utils/queryExtraction'

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

/***
 * Return All Where as List
 */
function getWhere(where, upperWhere) {
  let fromQuery = []
  if (where) {
    switch (where.type) {
      case "ComparisonBooleanPrimary":
        const query = [[where.left.value, where.left], [where.operator, where], [where.right.value, where.right]]
        if (upperWhere) {
          query.push([upperWhere.operator, upperWhere])
        }
        fromQuery = fromQuery.concat([query])
        break
      case "OrExpression":
        fromQuery = fromQuery.concat(getWhere(where.left)).concat(getWhere(where.right, where))
        break
      case "AndExpression":
        fromQuery = fromQuery.concat(getWhere(where.left, upperWhere)).concat(getWhere(where.right, where))
        break
    }
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

  // Format indicator list
  const indicatorList = indicators.map(indicator => {
    return {
      'id': `${IDENTIFIER}${indicator.id}`,
      'name': indicator.name
    }
  })

  const [query, setQuery] = useState(
    queryInit ? queryInit : `SELECT *
                             FROM ${IDENTIFIER}0`);

  useEffect(() => {
    if (queryInit) {
      setQuery(queryInit);
    }
  }, [queryInit]);

  useEffect(() => {
    if (query) {
      setAst(parser.parse(query));
    }
  }, [query]);

  const [ast, setAst] = useState(parser.parse(query));
  const indicatorById = indicatorsToById(indicators);

  const saveQuery = (query) => {
    onQueryChangeFn(query.replace(/ +(?= )/g, ''));
  }
  /** Set new Ast for query */
  const setNewAst = (newAst) => {
    setAst(newAst);
    saveQuery(parser.stringify(newAst));
  }

  /** Change a value */
  const change = (value, obj) => {
    obj.value = value ? value : "0";
    setNewAst({ ...ast })
  }

  /** Change join type */
  const changeJoin = (value, obj) => {
    switch (value) {
      case "LEFT JOIN":
        obj.leftRight = "LEFT";
        obj.type = "LeftRightJoinTable";
        break
      case "RIGHT JOIN":
        obj.leftRight = "RIGHT";
        obj.type = "LeftRightJoinTable";
        break;
      case "INNER JOIN":
        obj.innerCrossOpt = "INNER";
        obj.type = "InnerCrossJoinTable";
        break;
    }
    setNewAst({ ...ast })
  }

  /** Delete join from the query for specific idx */
  const deleteJoin = (idx) => {
    let currentQuery = parser.stringify(ast);
    var separators = ['INNER_JOIN', 'LEFT_JOIN', 'RIGHT_JOIN', '_WHERE'];
    currentQuery = currentQuery
      .replaceAll('INNER JOIN', 'INNER_JOIN INNER JOIN')
      .replaceAll('LEFT JOIN', 'LEFT_JOIN LEFT JOIN')
      .replaceAll('RIGHT JOIN', 'RIGHT_JOIN RIGHT JOIN')
      .replaceAll('WHERE', '_WHERE WHERE')
    const splitted = currentQuery.split(
      new RegExp(separators.join('|'), 'g')
    ).filter((split, splitIdx) => {
      return splitIdx !== idx
    });
    saveQuery(splitted.join(''));
  }

  // Get indicators fields
  let indicatorFields = []
  let indicatorFieldsIds = []


  /**
   * Add new Join
   */
  const addJoin = () => {
    let query = parser.stringify(ast);
    if (query.includes('WHERE')) {
      query = query.replaceAll(
        'WHERE', 'INNER JOIN table ON field=field WHERE'
      )
    } else {
      query += ' INNER JOIN table ON field=field'
    }
    saveQuery(query);
  }

  /** Render From selector */
  const renderFrom = () => {
    const froms = getFrom(ast.value.from.value[0].value);
    return froms.map((from, idx) => {
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

      // if idx 0, it is main data
      if (idx === 0) {
        return <Fragment key={idx}>
          <div className='section'>
            <b className='light'>Indicator</b>
            <div className='content'>
              <SelectPlaceholder
                placeholder='Pick an indicator'
                list={indicatorList}
                initValue={from[0]}
                onChangeFn={(value) => {
                  change(value, from[2].value)
                }}/>
            </div>
          </div>
          <div className='section'>
            <b className='light section__add'>JOIN <AddBoxIcon
              onClick={addJoin}/></b>
          </div>
        </Fragment>
      } else {
        // Check join type
        const join = from[1];
        let joinType = "";
        switch (join.type) {
          case "LeftRightJoinTable":
            switch (join.leftRight) {
              case "LEFT":
                joinType = "LEFT JOIN";
                break
              case "RIGHT":
                joinType = "RIGHT JOIN";
                break
            }
            break;
          case "InnerCrossJoinTable":
            joinType = "INNER JOIN";
            break;
        }

        // Render join elements
        const comparison = from[1].condition.value;
        return <div key={idx} className='section'>
          <div className='section__wrapper'>
            <div className='section__divider section__delete'>
              <CloseIcon
                onClick={() => {
                  deleteJoin(idx)
                }}/>
            </div>
            <div className='content'>
              <SelectPlaceholder
                placeholder='Pick an indicator'
                list={
                  [
                    { id: 'INNER JOIN', name: 'INNER JOIN' },
                    { id: 'LEFT JOIN', name: 'LEFT JOIN' },
                    { id: 'RIGHT JOIN', name: 'RIGHT JOIN' },
                  ]
                }
                initValue={joinType}
                onChangeFn={(value) => {
                  changeJoin(value, join)
                }}/>
              <SelectPlaceholder
                placeholder='Pick an indicator'
                list={indicatorList}
                initValue={from[0]}
                onChangeFn={(value) => {
                  change(value, from[2].value)
                }}/>
            </div>
            <div className='section__divider'><b>ON</b></div>
            <div className='content'>
              <SelectPlaceholder
                placeholder='Pick the field'
                list={indicatorFields}
                initValue={comparison.left.value}
                onChangeFn={(value) => {
                  change(value, comparison.left)
                }}/>
              <div className='section__divider'><b>{comparison.operator}</b>
              </div>
              <SelectPlaceholder
                placeholder='Pick the field'
                list={indicatorFields}
                initValue={comparison.right.value}
                onChangeFn={(value) => {
                  change(value, comparison.right)
                }}/>
            </div>
          </div>
        </div>
      }
    })
  }

  /** Change where type */
  const changeWhere = (value, obj) => {
    switch (value) {
      case "OR":
        obj.operator = value;
        obj.type = "OrExpression";
        break
      case "AND":
        obj.operator = value;
        obj.type = "AndExpression";
        break;
    }
    setNewAst({ ...ast })
  }
  const changeWhereOperator = (value, obj) => {
    obj.operator = value;
    setNewAst({ ...ast })
  }

  /**
   * Add new Where
   */
  const addWhere = () => {
    let query = parser.stringify(ast);
    if (!query.includes('WHERE')) {
      query += ' WHERE field=0'
    } else {
      if (query.includes('ORDER BY')) {
        query = query.replaceAll(
          'ORDER BY', ' AND field=0 ORDER BY'
        )
      } else {
        query += ' AND field=0'
      }
    }
    saveQuery(query);
  }

  /** Delete where from the query for specific idx */
  const deleteWhere = (idx) => {
    let currentQuery = parser.stringify(ast);
    const querySplitted = currentQuery.split('WHERE')
    if (!querySplitted[1]) {
      return
    }
    var separators = ['_WHERE', '_AND', '_OR'];
    currentQuery = querySplitted[1]
      .replaceAll('WHERE', '_WHERE WHERE')
      .replaceAll('AND', '_AND AND')
      .replaceAll('OR', '_OR OR')
    const splitted = currentQuery.split(
      new RegExp(separators.join('|'), 'g')
    ).filter((split, splitIdx) => {
      return splitIdx !== idx
    });
    if (splitted[0]) {
      splitted[0] = splitted[0].replaceAll('AND', '').replaceAll('OR', '')
    }
    if (splitted.length === 0) {
      saveQuery(querySplitted[0])
    } else {
      saveQuery([querySplitted[0]].concat(' WHERE ').concat(splitted).join(''));
    }
  }

  /** Render Filters selector */
  const renderFilters = () => {
    const wheres = getWhere(ast.value.where)
    return wheres.map((where, idx) => {
      const operatorWhere = where[3];
      const field = where[0];
      const operator = where[1];
      const valueField = where[2];
      return <div key={idx} className='section'>
        <div className='section__wrapper'>
          <div className='section__divider section__delete'>
            <CloseIcon
              onClick={() => {
                deleteWhere(idx)
              }}/>
          </div>
          <div className='content'>
            {
              operatorWhere ? (
                <SelectPlaceholder
                  placeholder='Pick an operation'
                  list={
                    [
                      { id: 'AND', name: 'AND' },
                      { id: 'OR', name: 'OR' }
                    ]
                  }
                  initValue={operatorWhere[0]}
                  onChangeFn={(value) => {
                    changeWhere(value, operatorWhere[1])
                  }}/>
              ) : ''
            }
            <SelectPlaceholder
              placeholder='Pick the field'
              list={indicatorFields}
              initValue={field[0]}
              onChangeFn={(value) => {
                change(value, field[1])
              }}/>
            <SelectPlaceholder
              placeholder='Pick an operation'
              list={
                [
                  { id: '=', name: '=' },
                  { id: '>', name: '>' },
                  { id: '>=', name: '>=' },
                  { id: '<', name: '<' },
                  { id: '<=', name: '<=' },
                  { id: '<>', name: '<>' },
                ]
              }
              initValue={operator[0]}
              onChangeFn={(value) => {
                changeWhereOperator(value, operator[1])
              }}/>
            <Input
              type="text"
              placeholder="Enter value"
              value={valueField[0]}
              onChange={(value) => {
                change(value.target.value, valueField[1])
              }}/>
          </div>
        </div>
      </div>
    })
  };
  return <Fragment>
    {
      renderFrom()
    }

    <div className='section'>
      <b className='light section__add'>WHERE <AddBoxIcon onClick={addWhere}/></b>
    </div>
    {
      renderFilters()
    }
    <Button variant="primary" className='save__button'>Save</Button>
  </Fragment>
}