import React, { Fragment, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";

import { AddButton } from "../../../../../components/Elements/Button";
import { IconTextField } from "../../../../../components/Elements/Input";
import SortableItem from "./SortableItem";

/**
 * Group container
 * @param {dict} data Actual layer data.
 * @param {list} layers Layers data.
 * @param {string} groupName Group name.
 * @param {string} pageName Page name.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} addLayer Function of add layer.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export default function SortableContainer(
  {
    data,
    items,
    groupName,
    pageName,
    removeGroup,
    changeGroupName,
    addLayer,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup
  }) {
  const { setNodeRef } = useDroppable({ groupName });
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(groupName);

  return (
    <Fragment>
      <div className='DragDropItem GroupRow'>
        <div className='GroupRowTitle'>
          {name !== '_noGroup' ?
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
        </div>
        <div className='VisibilityAction'><VisibilityIcon/></div>
        <div className='MuiButtonLike RemoveAction'>
          {name ?
            <RemoveCircleIcon onClick={() => {
              removeGroup(name)
            }}/> : ""
          }
        </div>
      </div>
      <SortableContext
        id={groupName} items={items} strategy={rectSortingStrategy}>
        <div ref={setNodeRef}>
          {items.map(item => (
            <SortableItem
              key={item} id={item} layer={data[item]}
              removeLayer={removeLayer}
              changeLayer={changeLayer}
              editLayerInGroup={editLayerInGroup}/>
          ))}
        </div>
      </SortableContext>
    </Fragment>
  );
};

