import React, { Fragment, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";
import { IconTextField } from "../../../../../components/Elements/Input";
import SortableItem from "./SortableItem";
import { Checkbox } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

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
      <tbody>
      <tr className='DragDropItem GroupRow'>
        <td colSpan={3}>
          {name !== '_noGroup' ?
            <div className='GroupRowTitle'>
              {
                editName ? (
                    <Fragment>
                      <span>Group:</span>
                      <IconTextField
                        iconEnd={
                          <DoneIcon className='MuiButtonLike' onClick={() => {
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
              <div className='AddButton MuiButtonLike' onClick={() => {
                addLayerInGroup(groupName)
              }}>
                <AddCircleIcon/>{"Add"}
              </div>
            </div> : ""
          }
        </td>
        <td className='VisibilityAction'><VisibilityIcon/></td>
        {
          editLayerInGroup ?
            <td className='RemoveAction'><EditIcon/></td> : ''
        }
        <td className='RemoveAction'>
          {name ?
            <RemoveCircleIcon className='MuiButtonLike' onClick={() => {
              removeGroup(name)
            }}/> : ""
          }
        </td>
      </tr>
      <SortableContext
        id={groupName} items={items} strategy={rectSortingStrategy}>
        {
          items.map(item => {
            const layer = data[item];
            return (
              <SortableItem key={item} id={item}>
                <td title={layer.name}>
                  <div className='DragDropItem-Name'>{layer.name}</div>
                </td>
                <td title={layer.description}>
                  <div className='DragDropItem-Description'>
                    {layer.description}
                  </div>
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
                    <td className='RemoveAction'>
                      <EditIcon className='MuiButtonLike' onClick={() => {
                        editLayerInGroup(layer)
                      }}/>
                    </td> : ''
                }

                <td className='RemoveAction'>
                  <RemoveCircleIcon className='MuiButtonLike' onClick={() => {
                    removeLayer(layer)
                  }}/>
                </td>

              </SortableItem>
            )
          })
        }
      </SortableContext>
      </tbody>
    </Fragment>
  );
};

