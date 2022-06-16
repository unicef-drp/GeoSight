/* ==========================================================================
   Filters CONTROL
   ========================================================================== */

import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import AddCircleIcon from '@mui/icons-material/AddCircle'
import Tooltip from '@mui/material/Tooltip'
import {
  Checkbox,
  Input,
  ListItemText,
  OutlinedInput,
  Select
} from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import Actions from '../../../../redux/actions'

import {
  IDENTIFIER,
  INIT_DATA,
  OPERATOR,
  queryIndicator,
  returnDataToExpression,
  returnSqlToDict,
  TYPE,
  WHERE_OPERATOR
} from "../../../../utils/queryExtraction"

import FilterEditorModal from './Modal'
import Switch from '@mui/material/Switch';

import './style.scss'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
    setFilters({ ...filters })
    dispatcher(Actions.Filters.update(filters));
    dispatcher(Actions.Indicators.filter());
  }

  /** --------------------------------------------------
   ** Render filter group.
   ** -------------------------------------------------- **/
  const FilterGroup = ({ where, upperWhere }) => {

    const addFolder = () => {
      where.queries.push(INIT_DATA.GROUP())
      updateFilter()
    }
    const addWhere = () => {
      where.queries.push(INIT_DATA.WHERE())
      updateFilter()
    }
    const switchWhere = (operator) => {
      where.operator = operator;
      updateFilter()
    }

    return <div className='FilterGroup'>
      <div className='FilterGroupOption'>
        <div className='FilterOperatorToggler' onClick={
          () => {
            switchWhere(where.operator === WHERE_OPERATOR.AND ? WHERE_OPERATOR.OR : WHERE_OPERATOR.AND)
          }
        }>{where.operator}</div>
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
  const FilterInput = ({ where, upperWhere }) => {
    const [expanded, setExpanded] = useState(where.expanded)
    const [active, setActive] = useState(where.active)
    const [open, setOpen] = useState(false)

    const updateExpanded = () => {
      where.expanded = !expanded
      updateFilter()
    }
    const updateActive = () => {
      where.active = !active
      updateFilter()
    }
    const update = (newWhere) => {
      where.name = newWhere.name
      where.query = newWhere.query
      updateFilter()
    }
    /**
     * Return filter input
     */
    const FilterInputElement = () => {
      const sqlValue = returnSqlToDict(where.query)
      const field = sqlValue.field
      const operator = sqlValue.operator
      const value = sqlValue.value

      const indicator = indicatorFields.filter((indicatorField) => {
        return indicatorField.id === field
      })[0]
      const fieldName = indicator?.name
      const [currentValue, setCurrentValue] = useState(value)
      return <div
        className={value !== currentValue ? 'FilterInputWrapperChanged' : ''}>
        {fieldName ? fieldName : field} {OPERATOR[operator]}
        <div className='FilterInputWrapper'>
          {
            operator === 'IN' ?
              <Select
                className='FilterInput'
                multiple
                value={currentValue}
                onChange={(event) => {
                  setCurrentValue(event.target.value)
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
                        setCurrentValue(event.target.value)
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
                    className='FilterInput'
                    type="text"
                    placeholder="Value"
                    value={currentValue}
                    onChange={(event) => {
                      setCurrentValue(event.target.value)
                    }}/>)

          }
          <CheckCircleIcon className='MuiButtonLike' onClick={() => {
            where.query = returnDataToExpression(field, operator, currentValue)
            where.active = true;
            updateFilter();
          }}/>
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
          checked={where.active}
          onClick={(event) => {
            event.stopPropagation()
          }}
          onChange={() => {
            updateActive(event.target.checked)
          }}
        />
        {where.name ? where.name : 'Filter'}
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
        {
          !where.query ? 'Filter not defined' :
            <FilterInputElement/>
        }
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
  const { filters, indicators } = useSelector(state => state.dashboard.data)

  // get indicator fields
  let indicatorFields = []
  let indicatorFieldsIds = []
  indicators.map((indicator, idx) => {
    const data = indicator.rawData;
    if (data) {
      const indicatorData = queryIndicator(data)[0]
      for (const [key, value] of Object.entries(indicatorData)) {
        const id = `${IDENTIFIER}${indicator.id}.${key}`
        if (!indicatorFieldsIds.includes(id)) {
          indicatorFields.push({
            'id': id,
            'name': `${indicator.name}.${key}`,
            'group': indicator.name,
            'data': [
              ...new Set(
                data.map(data => {
                  return data[key]
                }))
            ]
          })
          indicatorFieldsIds.push(id)
        }
      }
    }
    indicatorFields = [...new Set(indicatorFields)]
  })
  return <div className='FilterControl'>
    <FilterControl
      filtersData={Object.keys(filters).length ? filters : INIT_DATA.GROUP()}
      indicatorFields={indicatorFields}/>
  </div>
}