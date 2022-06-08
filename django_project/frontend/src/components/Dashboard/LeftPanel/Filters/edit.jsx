/* ==========================================================================
   INDICATORS editor
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import { useSelector } from "react-redux";
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";

import Modal, { ModalContent, ModalFooter, ModalHeader } from "../../../Modal";
import QueryEditor from './QueryEditor'

// import {queryIndicators} from '../../../../utils/queryExtraction'

/**
 * Filter Editor Section Handler
 * @param {object} groupId ID of filter belong to.
 * @param {object} filterId ID of filter.
 * @param {object} filterData Filter data.
 */
export default function FilterEditSection(
  { groupId, filterId, filterData }
) {
  const { indicators } = useSelector(state => state.dashboard.data);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(filterData ? filterData.name : '');
  const [query, setQuery] = useState(filterData ? 'SELECT * FROM ? indicator_49 INNER JOIN ? indicator_37 ON indicator_49.geometry_code = indicator_49.geometry_code INNER JOIN ? indicator_37 ON indicator_49.geometry_code = indicator_49.geometry_code' : '');

  return <Fragment>
    <div className='setting__button' onClick={(event) => {
      event.stopPropagation();
    }}>
      {filterData ?
        (
          <SettingsIcon onClick={() => {
            setOpen(true);
          }}/>
        ) :
        (
          <AddBoxIcon onClick={() => {
            setOpen(true);
          }}/>
        )
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
            {
              filterData ? "Edit filter" : "Create new filter"
            }
          </div>
        </ModalHeader>
        <ModalContent>
          <div>
            <FormControl>
              <InputLabel>Filter Name</InputLabel>
              <Input type="text" placeholder="Filter name"
                     value={name}/>
            </FormControl>
            <FormControl>
              <InputLabel>Group</InputLabel>
              <Input type="text" placeholder="Filter group"/>
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
          </div>
        </ModalFooter>
      </Modal>
    </div>
  </Fragment>
}