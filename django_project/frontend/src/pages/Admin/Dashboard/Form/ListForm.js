import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Checkbox } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";

import List, { COLUMNS } from '../../Components/List'
import { AddButton } from "../../../../components/Elements/Button";
import Modal, { ModalHeader } from "../../../../components/Modal";
import { layerInGroup } from '../../../../utils/layers'
import { IconTextField } from "../../../../components/Elements/Input";
import { fetchingData } from "../../../../Requests";


/**
 * Form Group
 * @param {string} pageName Page Name.
 * @param {string} groupName Group Name.
 * @param {string} listUrl API for list data.
 * @param {Array} layers Layers of the group.
 * @param {Array} selectedIds Ids that are selected.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} addLayer Function of add layer.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export function FormGroup(
  {
    pageName,
    groupName,
    listData,
    layers,
    selectedIds,
    removeGroup,
    changeGroupName,
    addLayer,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup
  }) {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(groupName);
  const [open, setOpen] = useState(false);

  // Group name Submitted
  useEffect(() => {
    setName(groupName)
  }, [layers])

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
              checked={selectedIds.includes(params.id)}
              onChange={(evt) => {
                if (evt.target.checked) {
                  addLayer(params.row, groupName);
                } else {
                  removeLayer(params.row);
                }
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
  return (
    <tbody>
    <tr className='GroupRow'>
      <th colSpan="2">
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
              if (!addLayerInGroup) {
                setOpen(true)
              } else {
                addLayerInGroup(groupName)
              }
            }}
          />
        </div>
      </th>
      <th className='VisibilityAction'><VisibilityIcon/></th>
      {
        editLayerInGroup ?
          <th className='VisibilityAction'/> : ''
      }

      <th className='MuiButtonLike RemoveAction'>
        <RemoveCircleIcon onClick={() => {
          removeGroup(name)
        }}/>
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


    {/* for modal to select the data */}
    <Modal
      className='AdminSelectDataForm'
      open={open}
      onClosed={() => {
        setOpen(false)
      }}
    >
      <ModalHeader onClosed={() => {
        setOpen(false)
      }}>
        Select {pageName} For {name ? name : <i>No Name</i>}
      </ModalHeader>
      <div className='AdminContent'>
        {
          listData ?
            <List
              columns={columns} pageName={pageName}
              initData={listData}/> : ''
        }

      </div>
    </Modal>
    </tbody>
  )
}

/**
 * Basemaps dashboard
 * @param {string} pageName Page Name.
 * @param {Array} data Current data.
 * @param {string} listUrl API for list data.
 * @param {Function} addLayerAction Action of Layer Added.
 * @param {Function} removeLayerAction Action of Layer Removed.
 * @param {Function} changeLayerAction Action of Layer Changed.
 * @param {Function} addLayerInGroup When Add Layer In Group.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export default function ListForm(
  {
    pageName,
    data,
    listUrl,
    addLayerAction,
    removeLayerAction,
    changeLayerAction,
    addLayerInGroup,
    editLayerInGroup
  }
) {
  // GLOBAL DATA
  const dispatch = useDispatch();
  const selectedIds = data.map(function (row) {
    return row.id
  })
  const maxOrder = data.length > 0 ? Math.max(...data.map(function (row) {
    return row.order
  })) : 0

  // Generate group of layers
  const [groups, setGroups] = useState({});
  const [listData, setListData] = useState(null);

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

  return (
    <div className={'TableForm ' + pageName}>
      <div className='TableForm-Header'>
        <div className='TableForm-Header-Left'></div>
        <div className='TableForm-Header-Right'>
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
              listData={listData}
              layers={groups[groupName].layers}
              selectedIds={selectedIds}
              removeGroup={removeGroup}
              changeGroupName={changeGroupName}
              addLayer={addLayer}
              removeLayer={removeLayer}
              changeLayer={changeLayer}
              addLayerInGroup={addLayerInGroup}
              editLayerInGroup={editLayerInGroup}/>
          })
        }
      </table>
    </div>
  )
}