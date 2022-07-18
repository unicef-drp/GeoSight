import React, { useEffect, useState } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";

import List, { COLUMNS } from '../../../Components/List'
import { SaveButton } from "../../../../../components/Elements/Button";
import Modal, { ModalHeader } from "../../../../../components/Modal";

/**
 * Form Group
 * @param {string} pageName Page Name.
 * @param {string} groupName Group Name.
 * @param {Array} selectedIds Selected id.
 * @param {Array} listData List of data.
 * @param {Array} selectedData Selected data.
 * @param {boolean} open Is Model Open.
 * @param {Function} setOpen Set modal open.
 * @param {Function} applyData Apply data that contains added and removed.
 */
export default function DataSelectionModal(
  {
    pageName, groupName,
    listData, selectedData,
    open, setOpen,
    applyData
  }) {
  const [groupSelectedDataIds, setGroupSelectedDataIds] = useState([]);
  const [groupSelectedData, setGroupSelectedData] = useState([]);
  const [nonGroupSelectedDataIds, setNonGroupSelectedDataIds] = useState([]);
  const [nonGroupSelectedData, setNonGroupSelectedData] = useState([]);

  // ----------------------------------------------
  // Check data in list that is in this group
  // Remove the data from other group to table
  useEffect(() => {

    // ----------------------------------------------
    // Check data in list that is in this group
    // Remove the data from other group to table
    // Remove data from other group
    const groupSelectedDataIds = []
    const groupSelectedData = selectedData.filter(function (row) {
      const condition = row.group === groupName;
      if (condition) {
        groupSelectedDataIds.push(row.id)
      }
      return condition
    })
    setGroupSelectedDataIds([...groupSelectedDataIds])
    setGroupSelectedData([...groupSelectedData])

    const nonGroupSelectedDataIds = []
    const nonGroupSelectedData = selectedData.filter(function (row) {
      const condition = row.group !== groupName;
      if (condition) {
        nonGroupSelectedDataIds.push(row.id)
      }
      return condition
    })
    setNonGroupSelectedDataIds([...nonGroupSelectedDataIds])
    setNonGroupSelectedData([...nonGroupSelectedData])
  }, [open])

  const cleanListData = listData ? listData.filter(row => {
    return !nonGroupSelectedDataIds.includes(row.id)
  }) : null

  // ----------------------------------------------
  // Restructure columns
  const columns = [].concat(COLUMNS(pageName));
  columns.pop();
  columns.unshift({
    field: 'actions',
    type: 'actions',
    width: 80,
    getActions: (params) => {
      return [
        <GridActionsCellItem
          icon={
            <Checkbox
              checked={groupSelectedDataIds.includes(params.id)}
              onChange={(evt) => {
                if (evt.target.checked) {
                  groupSelectedDataIds.push(params.id)
                } else {
                  const index = groupSelectedDataIds.indexOf(params.id);
                  if (index !== -1) {
                    groupSelectedDataIds.splice(index, 1);
                  }
                }
                setGroupSelectedDataIds([...groupSelectedDataIds])
              }}
            />
          }
          label="Edit"
        />
      ]
    },
  })
  // columns.push(
  //   { field: 'group', headerName: 'Group', flex: 1 }
  // )

  /**
   * Apply save data
   */
  const apply = () => {
    const currentSelectedIds = groupSelectedData.map(function (row) {
      return row.id
    })
    const addedIds = groupSelectedDataIds.filter(id => {
      return !currentSelectedIds.includes(id)
    })
    const removedIds = currentSelectedIds.filter(id => {
      return !groupSelectedDataIds.includes(id)
    })
    const addedData = listData.filter(row => {
      return addedIds.includes(row.id)
    }).map(row => {
      row.group = groupName
      return row
    })
    const removedData = listData.filter(row => {
      return removedIds.includes(row.id)
    }).map(row => {
      row.group = ''
      row.visible_by_default = false
      return row
    })
    applyData(addedData, removedData)
  }
  return <Modal
    className='AdminSelectDataForm'
    open={open}
    onClosed={() => {
      setOpen(false)
    }}
  >
    <ModalHeader onClosed={() => {
      setOpen(false)
    }}>
      Select {pageName} {groupName ? "For " + groupName : ""}
    </ModalHeader>
    <div className='AdminContent'>
      {
        cleanListData ?
          <List
            columns={columns}
            pageName={pageName}
            initData={cleanListData}/> : ''
      }
      <div className='Save-Button'>
        <SaveButton
          variant="secondary"
          text={"Apply Selections : Selected (" + groupSelectedDataIds.length + ")"}
          onClick={apply}/>
      </div>
    </div>
  </Modal>
}