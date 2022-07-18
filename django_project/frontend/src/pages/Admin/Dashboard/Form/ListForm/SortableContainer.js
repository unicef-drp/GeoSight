import React, { Fragment, useState } from "react";
import {
  rectSortingStrategy,
  SortableContext,
  useSortable
} from "@dnd-kit/sortable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconTextField } from "../../../../../components/Elements/Input";
import SortableItem from "./SortableItem";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from "@mui/icons-material/DragHandle";

/**
 * Group container
 * @param {int} groupIdx Index of group.
 * @param {dict} data Actual layer data.
 * @param {list} layers Layers data.
 * @param {string} groupName Group name.
 * @param {Function} removeGroup Function of remove group.
 * @param {Function} changeGroupName Function of change group name.
 * @param {Function} removeLayer Function of remove layer.
 * @param {Function} changeLayer Function of change layer.
 * @param {Function} addLayerInGroup Function of addLayerInGroup.
 * @param {Function} editLayerInGroup When edit layer in group
 */
export default function SortableContainer(
  {
    data,
    groupIdx,
    items,
    groupName,
    removeGroup,
    changeGroupName,
    removeLayer,
    changeLayer,
    addLayerInGroup,
    editLayerInGroup
  }) {
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(groupName);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: groupName });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };
  return (
    <Fragment>
      <tbody key={groupName} id={groupName} style={style} ref={setNodeRef}>
      <tr className='DragDropItem GroupRow'>
        <td className='DragDropItem-Drag'>
          {
            name !== '' ?
              <DragHandleIcon
                className='MuiButtonLike' {...attributes} {...listeners}/> : ''
          }
        </td>
        <td colSpan={2}>
          {name !== '' ?
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
          Object.keys(items).length !== 0 ? items.map(item => {
            const layer = data[item];
            if (!layer) {
              return ''
            }
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
                  <RemoveCircleIcon className='MuiButtonLike'
                                    onClick={() => {
                                      removeLayer(layer)
                                    }}/>
                </td>

              </SortableItem>
            )
          }) : <SortableItem key={-1 * groupIdx} id={-1 * groupIdx}
                             isDropArea={true}>
            <td colSpan={6} className='DropArea'>Drop Here</td>
          </SortableItem>
        }
      </SortableContext>
      </tbody>
    </Fragment>
  );
};

