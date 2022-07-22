/* ==========================================================================
   Filters CONTROL
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import Tooltip from '@mui/material/Tooltip'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Switch from '@mui/material/Switch';
import {
  IDENTIFIER,
  INIT_DATA,
  OPERATOR,
  queryIndicator,
  TYPE,
  WHERE_OPERATOR
} from "../../../../utils/queryExtraction"

import { Actions } from '../../../../store/dashboard'
import { capitalize } from "../../../../utils/main";
import { filteredGeoms } from "../../../../utils/indicators";
import FilterEditorModal from './Modal'
import FilterValueInput from './ValueInput'

import './style.scss'

/**
 * Control All Filter.
 * @param {dict} filtersData Filters of dashboard.
 * @param {list} indicatorFields Indicator fields.
 * @param {Function} filter Filter function.
 */
export function FilterControl({ filtersData, indicatorFields, filter }) {
  const dispatcher = useDispatch();
  const [filters, setFilters] = useState(filtersData)

  // Apply the filters query
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(filtersData)) {
      setFilters(filtersData)
    }
  }, [filtersData]);

  /**
   * Update Filter
   */
  const updateFilter = (force) => {
    filter(filters)
    if (force) {
      dispatcher(
        Actions.Filters.update({ ...filters })
      )
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
      updateFilter(true)
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
      where.name = newWhere.name
      where.description = newWhere.description
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
          <FilterValueInput
            value={currentValue} operator={operator}
            indicator={indicator} onChange={updateValue}
            disabled={!where.active}/>
        </div>
        {where.description ?
          <div
            className='FilterExpressionDescription'>{where.description}</div> : ''
        }
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
        {
          where.name ?
            <div className='FilterExpressionName'>{where.name}</div> :
            fieldName ?
              <div
                className='FilterExpressionName'>{capitalize(fieldName.split('.')[1])}</div> :
              <div className='FilterExpressionName'>Loading</div>
        }
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
          ) : ''
        }

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
  const {
    filters,
    indicators,
    referenceLayer
  } = useSelector(state => state.dashboard.data);
  const referenceLayerData = useSelector(state => state.referenceLayerData)
  const indicatorsData = useSelector(state => state.indicatorsData)
  const dispatcher = useDispatch();

  const filter = (currentFilter) => {
    let indicatorsList = [];
    let allHasData = true;
    for (const [key, indicator] of Object.entries(indicatorsData)) {
      if (indicator.fetching) {
        allHasData = false
      }
      indicatorsList.push(indicator)
    }
    const filteredGeometries = filteredGeoms(
      indicatorsList, allHasData ? currentFilter : null
    )
    if (filteredGeometries) {
      dispatcher(
        Actions.FilteredGeometries.update(filteredGeometries)
      )
    }
    dispatcher(
      Actions.FiltersData.update(currentFilter)
    );
  }

  // Apply the filters query
  useEffect(() => {
    if (referenceLayerData[referenceLayer.identifier]?.data &&
      referenceLayerData[referenceLayer.identifier].data.levels) {
      filter(filters)
    }
  }, [filters, indicatorsData]);

  // get indicator fields
  let indicatorFields = []
  indicators.map(indicator => {
    if (indicatorsData[indicator.id]?.fetched) {
      const data = indicatorsData[indicator.id]?.data
      if (data) {
        const indicatorData = queryIndicator(data)[0]
        if (indicatorData) {
          Object.keys(indicatorData).forEach(key => {
            const id = `${IDENTIFIER}${indicator.id}.${key}`
            indicatorFields.push({
              'id': id,
              'name': `${indicator.name}.${key}`,
              'group': indicator.name,
              'data': [...new Set(
                data.map(data => {
                  return data[key]
                }))
              ]
            })
          })
        }
      }
      indicatorFields = [...new Set(indicatorFields)]
    }
  })

  return <Fragment>
    <div className='FilterControl'>
      <FilterControl
        filtersData={
          (filters && Object.keys(filters).length > 0) ? filters : INIT_DATA.GROUP()
        }
        indicatorFields={indicatorFields}
        filter={filter}
      />
    </div>
  </Fragment>
}