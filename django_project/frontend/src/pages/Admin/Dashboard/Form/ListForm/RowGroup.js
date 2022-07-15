import React, { Fragment, useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Checkbox } from "@mui/material";

import { AddButton } from "../../../../../components/Elements/Button";
import { IconTextField } from "../../../../../components/Elements/Input";

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
export default function RowGroup(
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