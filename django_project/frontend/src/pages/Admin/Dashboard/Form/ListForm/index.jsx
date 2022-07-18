import React, { Fragment, useEffect, useState } from 'react';

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
 * @param {Function} rearrangeLayersAction When rearrange layers
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
    editLayerInGroupAction,
    rearrangeLayersAction
  }
) {
  // GLOBAL DATA
  const singularPageName = pageName.substring(0, pageName.length - 1);

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
    const newGroups = groupLayers;

    // Check if current group is not in new group, merge it
    const currentGroupNames = Object.keys(groups);
    const newGroupNames = Object.keys(groupLayers);
    currentGroupNames.map(groupName => {
      if (groupName && !newGroupNames.includes(groupName)) {
        newGroups[groupName] = [-999]
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
        groups[name] = []
        created = true;
      }
      idx += 1;
    }
    setGroups({ ...groups })
  }

  /** Remove group */
  const removeGroup = (groupName) => {
    const layers = [...(groups[groupName] ? groups[groupName] : groups[''])]
    delete groups[groupName]
    setGroups({ ...groups })
    layers.map(layer => {
      removeLayer(layer)
    })
  }

  /** Remove Layer */
  const removeLayer = (layer) => {
    removeLayerAction(layer)
  }
  /** Change Layer */
  const changeLayer = (layer) => {
    changeLayerAction(layer)
  }
  /** Change group name */
  const changeGroupName = (groupName, newName) => {
    const names = Object.keys(groups).filter(name => {
      return name !== groupName;
    });
    if (
      !newName || names.includes(newName) || ['_Table', ''].includes(newName)
    ) {
      return false;
    } else {
      groups[groupName].map(layer => {
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
      addLayerAction(data)
    })
    removeData.map(data => {
      removeLayerAction(data)
    })
    setOpen(false)
  }

  return <Fragment>
    {
      Object.keys(groups).length === 0 ? <div>Loading</div> :
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
            removeGroup={removeGroup}
            changeGroupName={changeGroupName}
            removeLayer={removeLayer}
            changeLayer={changeLayer}
            addLayerInGroup={addLayerInGroup}
            editLayerInGroup={editLayerInGroupAction}
            rearrangeLayers={rearrangeLayersAction}
          />

          <DataSelectionModal
            listData={listData}
            selectedData={data}
            open={open} setOpen={setOpen}
            pageName={pageName}
            groupName={currentGroupName}
            applyData={applyData}/>
        </div>
    }
  </Fragment>
}