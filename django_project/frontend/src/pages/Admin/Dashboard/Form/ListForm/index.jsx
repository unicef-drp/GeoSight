import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

import { AddButton } from "../../../../../components/Elements/Button";
import { layerInGroup } from '../../../../../utils/layers'
import { fetchingData } from "../../../../../Requests";

import DataSelectionModal from './DataSelectionModal'
import SortableList from './SortableList'

import './style.scss';

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
    if (!newName || names.includes(newName)) {
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
      <SortableList
        groups={groups}
        pageName={pageName}
        removeGroup={removeGroup}
        changeGroupName={changeGroupName}
        addLayer={addLayer}
        removeLayer={removeLayer}
        changeLayer={changeLayer}
        addLayerInGroup={addLayerInGroup}
        editLayerInGroup={editLayerInGroupAction}
      />

      <DataSelectionModal
        listData={listData}
        selectedData={data}
        open={open} setOpen={setOpen}
        pageName={pageName}
        groupName={currentGroupName}
        applyData={applyData}/>
    </div>
  )
}