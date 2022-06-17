/* ==========================================================================
   Filters CONTROL
   ========================================================================== */

import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import parser from "js-sql-parser";
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Tooltip from '@mui/material/Tooltip'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import {
  Checkbox,
  Input,
  ListItemText,
  OutlinedInput,
  Select
} from "@mui/material"
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Switch from '@mui/material/Switch';

import {
  IDENTIFIER,
  INIT_DATA,
  OPERATOR,
  queryIndicator,
  returnWhereToDict,
  TYPE,
  WHERE_OPERATOR
} from "../../../../utils/queryExtraction"

import Actions from '../../../../redux/actions'
import { capitalize } from "../../../../utils/main";
import FilterEditorModal from './Modal'

import './style.scss'

/**
 * Control All Filter.
 * @param {dict} filtersData Filters of dashboard.
 * @param {list} indicatorFields Indicator fields.
 */
export function FilterControl({ filtersData, indicatorFields }) {
  const dispatcher = useDispatch();
  const [filters, setFilters] = useState(
    filtersData ? filtersData : INIT_DATA.GROUP()
  )

  /**
   * Update Filter
   */
  const updateFilter = (force) => {
    dispatcher(
      Actions.IndicatorsData.filter(filters)
    );
    dispatcher(
      Actions.FiltersQuery.update(filters)
    );
    if (force) {
      setFilters({ ...filters });
    }
  }

  /** --------------------------------------------------
   ** Render filter group.
   ** -------------------------------------------------- **/
  const FilterGroup = ({ where, upperWhere }) => {
    const [operator, setOperator] = useState(where.operator)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(INIT_DATA.WHERE())
    const [addType, setAddType] = useState(null)

    const switchWhere = (operator) => {
      setOperator(operator);
      where.operator = operator;
      updateFilter()
    }
    const add = (newData) => {
      switch (addType) {
        case TYPE.EXPRESSION: {
          where.queries.push(newData);
          break
        }
        case TYPE.GROUP:
          where.queries.push({
            ...INIT_DATA.GROUP(),
            queries: [newData]
          });
          break
      }
      updateFilter(true)
    }

    return <div className='FilterGroup'>
      <div className='FilterGroupOption'>
        <div className='FilterOperatorToggler' onClick={
          () => {
            switchWhere(operator === WHERE_OPERATOR.AND ? WHERE_OPERATOR.OR : WHERE_OPERATOR.AND)
          }
        }>{operator}</div>
        <div className='FilterGroupName'>
        </div>
        <Tooltip title="Add New Filter">
          <AddCircleIcon
            className='FilterGroupAddExpression MuiButtonLike'
            onClick={
              () => {
                setOpen(true)
                setAddType(TYPE.EXPRESSION)
              }}/>
        </Tooltip>
        <Tooltip title="Add New Group">
          <CreateNewFolderIcon
            className='FilterGroupAdd MuiButtonLike' onClick={
            () => {
              setOpen(true)
              setAddType(TYPE.GROUP)
            }
          }/>
        </Tooltip>
        <FilterEditorModal
          open={open}
          setOpen={(opened) => {
            setOpen(opened)
            setData(INIT_DATA.WHERE());
          }}
          data={data}
          fields={indicatorFields}
          update={add}/>
        {
          upperWhere ? (
            <Tooltip title="Delete Group">
              <DoDisturbOnIcon
                className='FilterGroupDelete MuiButtonLike' onClick={
                () => {
                  let isExecuted = confirm("Are you want to delete this group?");
                  if (isExecuted) {
                    upperWhere.queries = [...upperWhere.queries.filter(query => {
                      return query !== where
                    })]
                    updateFilter(true)
                  }
                }
              }/>
            </Tooltip>
          ) : ''}
        <div className='FilterGroupEnd'>
        </div>
      </div>
      {
        where.queries.length > 0 ?
          where.queries.map(
            (query, idx) => (
              <FilterRender key={idx} where={query} upperWhere={where}
                            updateFilter={updateFilter}/>
            )
          )
          :
          <div className='FilterNote'>No filter</div>
      }
    </div>
  }
  /** --------------------------------------------------
   ** Render input of filter.
   ** -------------------------------------------------- **/
  const FilterInput = ({ where, upperWhere }) => {
    const [expanded, setExpanded] = useState(
      where.expanded ? where.expanded : false
    )
    const [active, setActive] = useState(
      where.active ? where.active : false
    )
    const [open, setOpen] = useState(false)

    const updateExpanded = () => {
      where.expanded = !expanded
      setExpanded(!expanded)
    }
    const updateActive = () => {
      where.active = !active
      setActive(!active)
      updateFilter()
    }
    const update = (newWhere) => {
      where.field = newWhere.field
      where.operator = newWhere.operator
      where.value = newWhere.value
      updateFilter(true)
    }
    const field = where.field
    const operator = where.operator
    const value = where.value
    const indicator = indicatorFields.filter((indicatorField) => {
      return indicatorField.id === field
    })[0]
    const fieldName = indicator?.name

    /**
     * Return filter input
     */
    const FilterInputElement = () => {
      const [currentValue, setCurrentValue] = useState(value)
      const updateValue = (value) => {
        const cleanValue = !isNaN(value) ? (!Array.isArray(value) ? Number(value) : value) : value;
        setCurrentValue(cleanValue)
        where.value = cleanValue
        updateFilter()
      }
      return <div>
        {fieldName ? fieldName : field} {OPERATOR[operator]}
        <div className='FilterInputWrapper'>
          {
            operator === 'IN' ?
              <Select
                className='FilterInput'
                multiple
                value={currentValue}
                onChange={(event) => {
                  updateValue(event.target.value);
                }
                }
                input={<OutlinedInput label="Tag"/>}
                renderValue={(selected) => selected.length + ' selected'}
              >
                {indicator ? indicator.data.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={currentValue.indexOf(name) > -1}/>
                    <ListItemText primary={name}/>
                  </MenuItem>
                )) : ''}
              </Select> :
              (
                operator === '=' && indicator && isNaN(indicator.data[0]) ?
                  <Select
                    className='FilterInput'
                    value={currentValue}
                    onChange={
                      (event) => {
                        updateValue(event.target.value);
                      }
                    }
                  >
                    {indicator ? indicator.data.map((name) => (
                      <MenuItem key={name} value={name}>
                        <ListItemText primary={name}/>
                      </MenuItem>
                    )) : ''}
                  </Select> :
                  <Input
                    key="input1"
                    className='FilterInput'
                    type="text"
                    placeholder="Value"
                    value={currentValue}
                    onChange={(event) => {
                      updateValue(event.target.value);
                    }}/>
              )

          }
        </div>
      </div>
    }

    return <Accordion
      className='FilterExpression'
      expanded={expanded}
      onChange={updateExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
      >
        <Switch
          size="small"
          checked={active}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onChange={() => {
            updateActive(event.target.checked)
          }}
        />
        {fieldName ?
          <div
            className='FilterExpressionName'>{capitalize(fieldName.split('.')[1])}</div> :
          <div className='FilterExpressionName'>Loading</div>}
        <ModeEditIcon
          className='FilterEdit'
          onClick={(event) => {
            event.stopPropagation()
            setOpen(true)
          }}/>
        {
          upperWhere ? (
            <Tooltip title="Delete Filter">
              <DoDisturbOnIcon
                className='FilterDelete MuiButtonLike' onClick={
                () => {
                  let isExecuted = confirm("Are you want to delete this group?");
                  if (isExecuted) {
                    upperWhere.queries = [...upperWhere.queries.filter(query => {
                      return query !== where
                    })]
                    updateFilter(true)
                  }
                }
              }/>
            </Tooltip>
          ) : ''}

        <FilterEditorModal
          open={open} setOpen={setOpen} data={where}
          fields={indicatorFields} update={update}/>
      </AccordionSummary>
      <AccordionDetails>
        <FilterInputElement/>
      </AccordionDetails>
    </Accordion>
  }

  /** --------------------------------------------------
   ** Render input of filter.
   ** -------------------------------------------------- **/
  const FilterRender = ({ where, upperWhere }) => {
    switch (where.type) {
      case TYPE.GROUP:
        return <FilterGroup where={where} upperWhere={upperWhere}/>
      case TYPE.EXPRESSION:
        return <FilterInput where={where} upperWhere={upperWhere}/>
      default:
        return ''
    }
  }

  return <Fragment>
    <FilterRender
      where={filters}
      upperWhere={null}/>
  </Fragment>
}

/**
 * Filter section.
 */
export default function FilterSection() {
  const { filters, indicators } = useSelector(state => state.dashboard.data);

  let filtersData = null;
  if (filters) {
    const sql = parser.parse(filters)
    let sqlDict = returnWhereToDict(sql.value.where)
    if (Array.isArray(sqlDict)) {
      filtersData = {
        ...INIT_DATA.GROUP(),
        queries: sqlDict
      }
    } else {
      filtersData = sqlDict
    }

    // check default operator
    const defaultOperator = filtersData.queries.filter(query => {
      return query.type === TYPE.EXPRESSION
    })[0]?.whereOperator;
    filtersData.operator = defaultOperator ? defaultOperator : WHERE_OPERATOR.AND
  }


  // get indicator fields
  let indicatorFields = []
  indicators.map((indicator, idx) => {
    if (indicator.rawData) {
      const indicatorData = queryIndicator(indicator.rawData)[0]
      Object.keys(indicatorData).forEach(key => {
        const id = `${IDENTIFIER}${indicator.id}.${key}`
        indicatorFields.push({
          'id': id,
          'name': `${indicator.name}.${key}`,
          'group': indicator.name,
          'data': [...new Set(
            indicator.rawData.map(data => {
              return data[key]
            }))
          ]
        })
      })
    }
    indicatorFields = [...new Set(indicatorFields)]
  })

  return <div className='FilterControl'>
    <FilterControl
      filtersData={filtersData ? filtersData : INIT_DATA.GROUP()}
      indicatorFields={indicatorFields}/>
  </div>
}