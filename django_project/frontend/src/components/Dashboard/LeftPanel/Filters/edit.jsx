/* ==========================================================================
   INDICATORS editor
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import QueryEditor from './QueryEditor';
import Modal, { ModalContent, ModalFooter, ModalHeader } from "../../../Modal";
import { queryIndicators } from '../../../../utils/queryExtraction'

/**
 * Filter Editor Section Handler
 * @param {object} filterId ID of filter.
 * @param {object} filterData Filter data.
 */
export default function FilterEditSection({ filterId, filterData }) {
  const { indicators } = useSelector(state => state.dashboard.data);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(filterData ? filterData.name : '');
  const [group, setGroup] = useState(filterData ? filterData.group : '');
  const [query, setQuery] = useState(filterData ? filterData.query : '');
  const [queryResult, setQueryResult] = useState('');

  /** When opened, set all data to default **/
  const onOpen = () => {
    setOpen(true);
    setQuery(filterData ? filterData.query : '')
    setName(filterData ? filterData.name : '')
  };

  useEffect(() => {
    try {
      const resultQuery = queryIndicators(indicators, query)
      resultQuery.forEach((result, idx) => {
        result.id = idx;
      })
      setQueryResult(resultQuery)
    } catch (err) {
      setQueryResult(err.toString())
    }
  }, [indicators, query]);

  /**
   * Return preview table
   */
  const returnPreviewTable = () => {
    if (!Array.isArray(queryResult)) {
      return <div className='content error'>{queryResult}</div>
    }
    if (!queryResult[0]) {
      return <div className='content'>No data Found</div>
    }

    const columns = [];
    Object.keys(queryResult[0]).map((key) => {
      columns.push({ field: key, headerName: key, hide: key === 'id' })
    })
    return <div className='content table__preview'>
      <DataGrid
        rows={queryResult}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  }

  return <Fragment>
    <div className='setting__button' onClick={(event) => {
      event.stopPropagation();
    }}>
      {
        filterData ?
          <SettingsIcon onClick={onOpen}/> : <AddBoxIcon onClick={onOpen}/>
      }

      <Modal
        open={open}
        onClosed={() => {
          setOpen(false)
        }}
        className="modal__filter__setting"
      >
        <ModalHeader>
          Filter Setting
          <div className='setting__helper'>
            {filterId ? "Edit filter" : "Create new filter"}
          </div>
        </ModalHeader>
        <ModalContent>
          <div>
            <FormControl>
              <InputLabel>Filter Name</InputLabel>
              <Input
                type="text" placeholder="Filter name" value={name}
                onChange={(event) => {
                  setName(event.target.value)
                }}/>
            </FormControl>
            <FormControl>
              <InputLabel>Group</InputLabel>
              <Input
                type="text" placeholder="Filter group" value={group}
                onChange={(event) => {
                  setGroup(event.target.value)
                }}/>
              <FormHelperText>
                Grouping filter under a group.
                All filters in same group are OR operation.
              </FormHelperText>
            </FormControl>
          </div>
        </ModalContent>
        <ModalFooter>
          <QueryEditor
            queryInit={query}
            onQueryChangeFn={setQuery}/>
        </ModalFooter>
        <ModalFooter>
          <div className='section preview'>
            <b className='light'>Preview</b>
            <div className='content'>
              {query ? query : "Query is empty"}
            </div>
            {returnPreviewTable()}
          </div>
        </ModalFooter>
      </Modal>
    </div>
  </Fragment>
}