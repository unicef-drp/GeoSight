import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import {
  arrayMove,
  insertAtIndex,
  removeAtIndex
} from "../../../../../utils/Array";

import SortableContainer from "./SortableContainer";

/**
 * List that can be sortable
 * @param {dict} groups Groups data.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 * @param {Function} rearrangeLayers Rearrange layers
 */
export default function SortableList(
  {
    groups,
    removeGroup,
    changeGroupName,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup,
    rearrangeLayers
  }
) {
  const prevState = useRef();
  const tableName = '_Table'

  // parsing data from groups
  const getData = (groups) => {

    const itemData = {}
    let dictData = {}
    if (groups) {
      for (const [groupName, group] of Object.entries(groups)) {
        itemData[groupName] = group.filter(layer => {
          return layer.id
        }).map(layer => {
          dictData[layer.id] = layer
          return layer.id
        })
      }
    }
    return {
      itemData: itemData,
      dictData: dictData
    }
  }
  const { itemData, dictData } = getData(groups)
  // prevState.items = itemData

  const [dragMode, setDragMode] = useState(false)
  const [dragged, setDragged] = useState(false)
  const [groupData, setGroupData] = useState(groups);
  const [items, setItems] = useState(itemData);
  const [data, setData] = useState(dictData);

  /** Groups changed **/
  useEffect(() => {
    setGroupData(groups)
  }, [groups])

  /** Groups changed **/
  useEffect(() => {
    const { itemData, dictData } = getData(groupData)
    setItems(itemData)
    setData(dictData)
  }, [groupData])

  /** Items changed **/
  useEffect(() => {
    if (!dragged && dragMode) {
      // We save it
      if (JSON.stringify(prevState.items) !== JSON.stringify(items)) {
        rearrangeLayers(items)
        prevState.items = items
      }
      setDragMode(false)
    }
  }, [items])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  /** When drag event is running **/
  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    let activeContainer = active.data.current.sortable.containerId;
    if (activeContainer === tableName) {
      return;
    }
    if (activeContainer)
      if (!items[activeContainer]) {
        activeContainer = ""
      }
    let overContainer = over.data.current?.sortable.containerId;
    if (!items[overContainer]) {
      overContainer = ""
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;

        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  /** When drag event ended **/
  const handleDragEnd = ({ active, over }) => {
    setDragged(false)
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      let activeContainer = active.data.current.sortable.containerId;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      if (activeContainer !== tableName) {
        let overContainer = over.data.current?.sortable.containerId || over.id;
        if (!items[activeContainer]) {
          activeContainer = ""
        }
        if (!items[overContainer]) {
          overContainer = ""
        }

        setItems((items) => {
          let newItems;
          if (activeContainer === overContainer) {
            newItems = {
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex
              )
            };
          } else {
            newItems = moveBetweenContainers(
              items,
              activeContainer,
              activeIndex,
              overContainer,
              overIndex,
              active.id
            );
          }

          return newItems;
        });
      } else {
        const groupList = Object.keys(groupData)
        let newGroupList = arrayMove(
          groupList,
          activeIndex,
          overIndex
        )
        const noGroupIdx = newGroupList.indexOf("");
        if (noGroupIdx !== -1 && noGroupIdx !== 0) {
          newGroupList = arrayMove(
            newGroupList,
            noGroupIdx,
            0
          )
        }
        const newGroups = {}
        newGroupList.map(groupName => {
          newGroups[groupName] = groups[groupName]
        })
        setGroupData(newGroups)
      }
    }
  };

  /** Chen when the data move between container **/
  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
    };
  };
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={() => {
        setDragged(true)
        setDragMode(true)
      }}
      onDragOver={handleDragOver}
    >
      <table className={'DragDropTable'}>
        <SortableContext
          id={tableName} items={Object.keys(items)}
          strategy={rectSortingStrategy}>
          {Object.keys(items).map((groupName, idx) => (
            <SortableContainer
              key={groupName ? groupName : "No Name"}
              id={groupName}
              groupIdx={idx}
              data={data}
              items={items[groupName]}
              groupName={groupName}
              removeGroup={removeGroup}
              changeGroupName={changeGroupName}
              removeLayer={removeLayer}
              changeLayer={changeLayer}
              addLayerInGroup={addLayerInGroup}
              editLayerInGroup={editLayerInGroup}
            />
          ))}
        </SortableContext>
      </table>
    </DndContext>
  );
}
