/* ==========================================================================
   QUERY EDITOR
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import parser from 'js-sql-parser';
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import { SelectPlaceholder } from '../../../Input'
import {
  IDENTIFIER,
  indicatorsToById,
  queryIndicator
} from '../../../../utils/queryExtraction'

function getFrom(from, upperForm) {
  let fromQuery = []
  switch (from.type) {
    case "TableFactor":
      fromQuery = fromQuery.concat([[from.value.value, upperForm, from]])
      break
    default:
      fromQuery = fromQuery.concat(getFrom(from.left, null)).concat(getFrom(from.right, from));
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

  // get indicator list
  const indicatorList = indicators.map(indicator => {
    return {
      'id': `${IDENTIFIER}${indicator.id}`,
      'name': indicator.name
    }
  })

  // Create query
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
      setAst(parser.parse(query.replaceAll(' ?', '')));
    }
  }, [query]);

  const [ast, setAst] = useState(parser.parse(query.replaceAll(' ?', '')));
  const indicatorById = indicatorsToById(indicators);

  const saveQuery = (query) => {
    onQueryChangeFn(
      query.replaceAll(
        'FROM indicator_', 'FROM ? indicator_'
      ).replaceAll('JOIN indicator_', 'JOIN ? indicator_')
    );
  }
  /**
   * Set new Ast for query
   */
  const setNewAst = (newAst) => {
    setAst(newAst);
    saveQuery(parser.stringify(newAst));
  }

  /**
   * Change a value
   */
  const change = (value, objForm) => {
    objForm.value = value;
    setNewAst({ ...ast })
  }

  /**
   * Change join type
   */
  const changeJoin = (value, objForm) => {
    switch (value) {
      case "LEFT JOIN":
        objForm.leftRight = "LEFT";
        objForm.type = "LeftRightJoinTable";
        break
      case "RIGHT JOIN":
        objForm.leftRight = "RIGHT";
        objForm.type = "LeftRightJoinTable";
        break;
      case "INNER JOIN":
        objForm.innerCrossOpt = "INNER";
        objForm.type = "InnerCrossJoinTable";
        break;
    }
    setNewAst({ ...ast })
  }
  /**
   * Delete join from the query
   */
  const deleteJoin = (idx) => {
    let currentQuery = parser.stringify(ast);
    var separators = ['INNER_JOIN', 'LEFT_JOIN', 'RIGHT_JOIN', '_WHERE'];
    currentQuery = currentQuery
      .replaceAll('INNER JOIN', 'INNER_JOIN INNER JOIN')
      .replaceAll('LEFT JOIN', 'LEFT_JOIN LEFT JOIN')
      .replaceAll('RIGHT JOIN', 'RIGHT_JOIN RIGHT JOIN')
      .replaceAll('WHERE', '_WHERE WHERE')
    const splitted = currentQuery.split(new RegExp(separators.join('|'), 'g')).filter((split, splitIdx) => {
      return splitIdx != idx
    });
    saveQuery(splitted.join(''));

  }
  // get indicators fields
  const froms = getFrom(ast.value.from.value[0].value);
  let indicatorFields = []
  let indicatorFieldsIds = []

  /**
   * Render Join
   * @returns {unknown[]}
   */
  const renderFrom = () => {
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

      if (idx === 0) {
        return <div key={idx} className='section'>
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
          <b className='light'>Join</b>
          <div className='section__wrapper'>
            <CloseIcon
              className='section__delete'
              onClick={() => {
                deleteJoin(idx)
              }}/>
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
  };

  const addJoin = () => {
    let query = parser.stringify(ast);
    if (query.includes('WHERE')) {
      query = query.replaceAll('WHERE', 'INNER JOIN ? table ON field=field WHERE')
    } else {
      query += ' INNER JOIN ? table ON field=field'
    }
    saveQuery(query);
  }
  return <Fragment>
    {
      renderFrom()
    }
    <Button className='filter__button' onClick={addJoin}>Add Join</Button>
    <Button variant="primary" className='save__button'>Save</Button>
  </Fragment>
}