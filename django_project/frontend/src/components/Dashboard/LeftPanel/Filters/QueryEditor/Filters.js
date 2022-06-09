/* ==========================================================================
   EDITOR FOR FILTERS
   ========================================================================== */
import React from 'react';
import CloseIcon from "@mui/icons-material/Close";
import { SelectPlaceholder } from "../../../../Input";
import { Input } from "@mui/material";
import parser from "js-sql-parser";

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
 * Delete where from the query for specific idx
 * @param {dict} ast Query data.
 * @param {int} idx Index target.
 * @param {function} saveQuery Save query.
 * */
const deleteWhere = (ast, idx, saveQuery) => {
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
 * Change a value
 * @param {str} value New Value.
 * @param {dict} obj Object query.
 * @param {function} updateAst Save query.
 * */
const changeWhereValue = (value, obj, updateAst) => {
  obj.value = value ? value : '""';
  if (isNaN(value)) {
    obj.value = `"${obj.value}"`
  }
  updateAst();
}

/** Change where type
 * @param {str} value New Value.
 * @param {dict} obj Object query.
 * @param {function} updateAst Save query.
 * */
const changeWhere = (value, obj, updateAst) => {
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
  updateAst();
}
/** Change where operator
 * @param {str} value New Value.
 * @param {dict} obj Object query.
 * @param {function} updateAst Save query.
 * */
const changeWhereOperator = (value, obj, updateAst) => {
  obj.operator = value;
  updateAst();
}

/**
 * Render Filters selector
 * @param {dict} ast Query data.
 * @param {function} saveQuery Save query.
 * @param {function} updateAst Update Ast.
 * @param {array} indicatorFields Array of field name.
 * */
export default function Filters(
  { ast, saveQuery, updateAst, indicatorFields }
) {
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
              deleteWhere(ast, idx, saveQuery)
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
                  changeWhere(value, operatorWhere[1], updateAst)
                }}/>
            ) : ''
          }
          <SelectPlaceholder
            placeholder='Pick the field'
            list={indicatorFields}
            initValue={field[0]}
            onChangeFn={(value) => {
              change(value, field[1], updateAst)
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
              changeWhereOperator(value, operator[1], updateAst)
            }}/>
          <Input
            type="text"
            placeholder="Enter value"
            value={valueField[0].replaceAll('"', '')}
            onChange={(value) => {
              changeWhereValue(value.target.value, valueField[1], updateAst)
            }}/>
        </div>
      </div>
    </div>
  })
};