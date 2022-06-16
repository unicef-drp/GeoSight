/* ==========================================================================
   Filters CONTROL
   ========================================================================== */

import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import parser from "js-sql-parser";
import { isArray } from "leaflet/src/core/Util";
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Tooltip from '@mui/material/Tooltip'
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
  const updateFilter = () => {
    dispatcher(
      Actions.IndicatorsData.filter(filters)
    );
  }

  /** --------------------------------------------------
   ** Render filter group.
   ** -------------------------------------------------- **/
  const FilterGroup = ({ where, upperWhere }) => {
    const [operator, setOperator] = useState(where.operator)

    const addFolder = () => {
      where.queries.push(INIT_DATA.GROUP())
      updateFilter()
    }
    const addWhere = () => {
      where.queries.push(INIT_DATA.WHERE())
      updateFilter()
    }
    const switchWhere = (operator) => {
      setOperator(operator);
      where.operator = operator;
      updateFilter()
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
            onClick={addWhere}/>
        </Tooltip>
        <Tooltip title="Add New Group">
          <CreateNewFolderIcon
            className='FilterGroupAdd MuiButtonLike' onClick={addFolder}/>
        </Tooltip>
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
  const FilterInput = ({ where }) => {
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
      where.query = newWhere.query
      updateFilter()
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
        const cleanValue = !isNaN(value) ? Number(value) : value;
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
          <span>{capitalize(fieldName.split('.')[1])}</span> : 'Loading'}
        <ModeEditIcon
          className='FilterEdit'
          onClick={(event) => {
            event.stopPropagation()
            setOpen(true)
          }}/>

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
  const { indicators } = useSelector(state => state.dashboard.data);
  const query = 'SELECT * FROM indicator_49 INNER JOIN indicator_37 ON indicator_49.geometry_code=indicator_37.geometry_code WHERE indicator_49.needs__water>0 AND (indicator_49.geometry_code IN (\'\') AND indicator_49.needs__water>0)';
  const sql = parser.parse(query);

  let filters = returnWhereToDict(sql.value.where)
  if (isArray(filters)) {
    filters = {
      ...INIT_DATA.GROUP(),
      queries: filters,
      operator: filters.filter(query => {
        return query.type === TYPE.EXPRESSION;
      })[0]?.whereOperator
    }
  }

  // get indicator fields
  let indicatorFields = []
  let indicatorFieldsIds = []
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
      filtersData={Object.keys(filters).length ? filters : INIT_DATA.GROUP()}
      indicatorFields={indicatorFields}/>
  </div>
}