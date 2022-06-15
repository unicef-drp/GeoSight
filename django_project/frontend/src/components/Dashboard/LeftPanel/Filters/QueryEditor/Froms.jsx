/* ==========================================================================
   EDITOR FOR FILTERS
   ========================================================================== */
import React, { Fragment } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { SelectPlaceholder } from "../../../../Input";
import AddBoxIcon from "@mui/icons-material/AddBox";
import parser from "js-sql-parser";


/**
 * Change a value
 * @param {str} value New Value.
 * @param {dict} obj Object query.
 * @param {function} updateAst Save query.
 * */
const change = (value, obj, updateAst) => {
  obj.value = value;
  updateAst();
}

/**
 * Add new Join
 * @param {dict} ast Query data.
 * @param {function} saveQuery Save query.
 */
const addJoin = (ast, saveQuery) => {
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

/**
 * Delete join from the query for specific idx
 *@param {dict} ast Query data.
 *@param {int} idx Index target.
 *@param {function} saveQuery Save query.
 */
const deleteJoin = (ast, idx, saveQuery) => {
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

/** Change join type
 * @param {str} value New Value.
 * @param {dict} obj Object query.
 * @param {function} updateAst Save query.
 * */
const changeJoin = (value, obj, updateAst) => {
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
  updateAst()
}


/**
 * Render Froms selector
 * @param {dict} ast Query data.
 * @param {array} froms List of from.
 * @param {function} saveQuery Save query.
 * @param {function} updateAst Update Ast.
 * @param {array} indicatorList Indicator list
 * @param {array} indicatorFields Array of field name.
 * */
export default function Froms(
  { ast, froms, saveQuery, updateAst, indicatorList, indicatorFields }
) {
  return froms.map((from, idx) => {
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
                change(value, from[2].value, updateAst)
              }}/>
          </div>
        </div>
        <div className='section'>
          <b className='light section__add'>JOIN <AddBoxIcon
            onClick={() => {
              addJoin(ast, saveQuery)
            }}/></b>
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
                deleteJoin(ast, idx, saveQuery)
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
                changeJoin(value, join, updateAst)
              }}/>
            <SelectPlaceholder
              placeholder='Pick an indicator'
              list={indicatorList}
              initValue={from[0]}
              onChangeFn={(value) => {
                change(value, from[2].value, updateAst)
              }}/>
          </div>
          <div className='section__divider'><b>ON</b></div>
          <div className='content'>
            <SelectPlaceholder
              placeholder='Pick the field'
              list={indicatorFields}
              initValue={comparison.left.value}
              onChangeFn={(value) => {
                change(value, comparison.left, updateAst)
              }}/>
            <div className='section__divider'><b>{comparison.operator}</b>
            </div>
            <SelectPlaceholder
              placeholder='Pick the field'
              list={indicatorFields}
              initValue={comparison.right.value}
              onChangeFn={(value) => {
                change(value, comparison.right, updateAst)
              }}/>
          </div>
        </div>
      </div>
    }
  })
};