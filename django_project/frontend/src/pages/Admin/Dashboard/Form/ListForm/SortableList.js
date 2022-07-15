import React, { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  arrayMove,
  insertAtIndex,
  removeAtIndex
} from "../../../../../utils/Array";

import SortableContainer from "./SortableContainer";

/**
 * List that can be sortable
 * @param {dict} groups Groups data.
 * @param {string} pageName Page name.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} addLayer Function of add layer.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export default function SortableList(
  {
    groups,
    pageName,
    removeGroup,
    changeGroupName,
    addLayer,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup,
  }
) {
  const [data, setData] = useState({});
  const [items, setItems] = useState({});

  // Groups changed
  useEffect(() => {
    const itemData = {}
    let orderedData = {}
    for (const [groupName, group] of Object.entries(groups)) {
      itemData[groupName ? groupName : '_noGroup'] = group.layers.map(layer => {
        orderedData[layer.id] = layer
        return layer.id
      })
    }
    setItems(itemData)
    setData(orderedData)
  }, [groups])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    let activeContainer = active.data.current.sortable.containerId;
    if (!items[activeContainer]) {
      activeContainer = ""
    }
    let overContainer = over.data.current?.sortable.containerId;
    if (!items[overContainer]) {
      overContainer = ""
    }


    if (!overContainer) {
      return;
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

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      let activeContainer = active.data.current.sortable.containerId;
      let overContainer = over.data.current?.sortable.containerId || over.id;
      if (!items[activeContainer]) {
        activeContainer = ""
      }
      if (!items[overContainer]) {
        overContainer = ""
      }
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

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
    }
  };

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
      onDragOver={handleDragOver}
    >
      <div className={'DragDropTable'}>
        {Object.keys(items).map((groupName) => (
          <SortableContainer
            key={groupName ? groupName : "No Name"}
            id={groupName}
            data={data}
            items={items[groupName]}
            groupName={groupName}
            pageName={pageName}
            removeGroup={removeGroup}
            changeGroupName={changeGroupName}
            addLayer={addLayer}
            removeLayer={removeLayer}
            changeLayer={changeLayer}
            addLayerInGroup={addLayerInGroup}
            editLayerInGroup={editLayerInGroup}
          />
        ))}
      </div>
    </DndContext>
  );
}
