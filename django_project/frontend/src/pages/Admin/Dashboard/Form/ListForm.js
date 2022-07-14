import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";

import List, { COLUMNS } from '../../Components/List'
import { AddButton, SaveButton } from "../../../../components/Elements/Button";
import { layerInGroup } from '../../../../utils/layers'
import { IconTextField } from "../../../../components/Elements/Input";
import { fetchingData } from "../../../../Requests";
import Modal, { ModalHeader } from "../../../../components/Modal";


/**
 * Form Group
 * @param {string} groupName Group Name.
 * @param {Array} layers Layers of the group.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export function FormGroup(
  {
    groupName,
    layers,
    removeGroup,
    changeGroupName,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup
  }) {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(groupName);

  // Group name Submitted
  useEffect(() => {
    setName(groupName)
  }, [layers])

  return (
    <tbody>
    <tr className='GroupRow'>
      <th colSpan="2">
        {name ?
          <div className='GroupRowTitle'>
            {
              editName ? (
                  <Fragment>
                    <span>Group:</span>
                    <IconTextField
                      iconEnd={
                        <DoneIcon onClick={() => {
                          if (changeGroupName(groupName, name)) {
                            setEditName(false)
                          }
                        }}/>
                      }
                      value={name}
                      onChange={(evt) => {
                        setName(evt.target.value)
                      }}
                    />
                  </Fragment>
                ) :
                (
                  <Fragment>
                    <span>Group: {name ? name : <i>No Name</i>}</span>
                    <EditIcon
                      className='MuiButtonLike GroupEditName'
                      onClick={() => {
                        setEditName(true)
                      }}/>
                  </Fragment>
                )
            }
            <div className='Separator'/>
            <AddButton
              variant="secondary" text={"Add"}
              onClick={() => {
                addLayerInGroup(groupName)
              }}
            />
          </div> : ""
        }
      </th>
      <th className='VisibilityAction'><VisibilityIcon/></th>
      {
        editLayerInGroup ?
          <th className='VisibilityAction'/> : ''
      }

      <th className='MuiButtonLike RemoveAction'>
        {name ?
          <RemoveCircleIcon onClick={() => {
            removeGroup(name)
          }}/> : ""
        }
      </th>
    </tr>
    {
      layers.map(layer => {
        return (
          <tr key={layer.id}>
            <td>{layer.name}</td>
            <td>
              <div
                className='CellDescription'
                title={layer.description}>{layer.description}</div>
            </td>
            <td className='VisibilityAction'>
              <Checkbox
                checked={
                  layer.visible_by_default === undefined ? false : layer.visible_by_default
                }
                onChange={(evt) => {
                  layer.visible_by_default = evt.target.checked;
                  changeLayer(layer);
                }}/>
            </td>
            {
              editLayerInGroup ?
                <td className='MuiButtonLike RemoveAction'>
                  <EditIcon onClick={() => {
                    editLayerInGroup(layer)
                  }}/>
                </td> : ''
            }

            <td className='MuiButtonLike RemoveAction'>
              <RemoveCircleIcon onClick={() => {
                removeLayer(layer)
              }}/>
            </td>
          </tr>
        )
      })
    }
    </tbody>
  )
}

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
export function DataSelection(
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

/**
 * Basemaps dashboard
 * @param {string} pageName Page Name.
 * @param {Array} data Current data.
 * @param {string} listUrl API for list data.
 * @param {Function} addLayerAction Action of Layer Added.
 * @param {Function} removeLayerAction Action of Layer Removed.
 * @param {Function} changeLayerAction Action of Layer Changed.
 * @param {Function} addLayerInGroupAction When Add Layer In Group.
 * @param {Function} editLayerInGroupAction When edit layer in group
 */
export default function ListForm(
  {
    pageName,
    data,
    listUrl,
    addLayerAction,
    removeLayerAction,
    changeLayerAction,
    addLayerInGroupAction,
    editLayerInGroupAction
  }
) {
  // GLOBAL DATA
  const dispatch = useDispatch();
  const singularPageName = pageName.substring(0, pageName.length - 1);
  const maxOrder = data.length > 0 ? Math.max(...data.map(function (row) {
    return row.order
  })) : 0

  // Generate group of layers
  const [groups, setGroups] = useState({});
  const [listData, setListData] = useState(null);
  const [currentGroupName, setCurrentGroupName] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchingData(listUrl, {}, {}, (data) => {
      setListData(data)
    })
  }, [])

  // Onload, check the default one
  useEffect(() => {
    const groupLayers = layerInGroup(data);
    const newGroups = groupLayers.groups;

    // Check if current group is not in new group, merge it
    const currentGroupNames = Object.keys(groups);
    const newGroupNames = Object.keys(groupLayers.groups);
    currentGroupNames.map(groupName => {
      if (groupName && !newGroupNames.includes(groupName) && groups[groupName].layers.length === 0) {
        groups[groupName].layers = []
        newGroups[groupName] = groups[groupName]
      }
    })
    setGroups(newGroups)

  }, [data])

  /** Add group */
  const addGroup = () => {
    let created = false;
    let idx = Object.keys(groups).length + 1;
    while (!created) {
      const name = 'Group ' + idx;
      if (!groups[name]) {
        groups[name] = {
          'layers': []
        }
        created = true;
      }
      idx += 1;
    }
    setGroups({ ...groups })
  }

  /** Remove group */
  const removeGroup = (groupName) => {
    const layers = [...groups[groupName].layers]
    delete groups[groupName]
    setGroups({ ...groups })
    layers.map(layer => {
      removeLayer(layer)
    })
  }

  /** Add Layer */
  const addLayer = (layer, groupName) => {
    layer.order = maxOrder + 1;
    layer.group = groupName;
    dispatch(addLayerAction(layer))
  }
  /** Remove Layer */
  const removeLayer = (layer) => {
    dispatch(removeLayerAction(layer))
  }
  /** Change Layer */
  const changeLayer = (layer) => {
    dispatch(changeLayerAction(layer))
  }
  /** Change group name */
  const changeGroupName = (groupName, newName) => {
    const names = Object.keys(groups).filter(name => {
      return name !== groupName;
    });
    if (names.includes(newName)) {
      return false;
    } else {
      groups[groupName].layers.map(layer => {
        layer.group = newName;
        changeLayer(layer);
      })
      return true;
    }
  }

  const addLayerInGroup = (groupName) => {
    if (addLayerInGroupAction) {
      addLayerInGroupAction(groupName)
    } else {
      setCurrentGroupName(groupName)
      setOpen(true)
    }
  }
  const applyData = (addedData, removeData) => {
    addedData.map(data => {
      dispatch(addLayerAction(data))
    })
    removeData.map(data => {
      dispatch(removeLayerAction(data))
    })
    setOpen(false)
  }

  return (
    <div className={'TableForm ' + pageName}>
      <div className='TableForm-Header'>
        <div className='TableForm-Header-Left'></div>
        <div className='TableForm-Header-Right'>
          <AddButton
            variant="secondary" text={"Add " + singularPageName}
            onClick={() => addLayerInGroup("")}/>
          <AddButton
            variant="secondary" text={"Add Group"} onClick={addGroup}/>
        </div>
      </div>

      {/* for the table */}
      <table className="DragDropTable">
        {
          Object.keys(groups).map(groupName => {
            return <FormGroup
              key={groupName ? groupName : "No Name"}
              pageName={pageName}
              groupName={groupName}
              layers={groups[groupName].layers}
              removeGroup={removeGroup}
              changeGroupName={changeGroupName}
              addLayer={addLayer}
              removeLayer={removeLayer}
              changeLayer={changeLayer}
              addLayerInGroup={addLayerInGroup}
              editLayerInGroup={editLayerInGroupAction}/>
          })
        }
      </table>

      <DataSelection
        listData={listData}
        selectedData={data}
        open={open} setOpen={setOpen}
        pageName={pageName}
        groupName={currentGroupName}
        applyData={applyData}/>
    </div>
  )
}