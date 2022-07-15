import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from "@mui/icons-material/Edit";
import DragHandleIcon from '@mui/icons-material/DragHandle';


export default function SortableItem(
  {
    layer,
    pageName,
    removeLayer,
    changeLayer,
    editLayerInGroup,
    ...props
  }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div className='DragDropItem' style={style}
         ref={setNodeRef}>
      <div className='DragDropItem-Drag'>
        <DragHandleIcon {...attributes} {...listeners}/>
      </div>
      <div className='DragDropItem-Name' title={layer.name}>{layer.name}</div>
      <div className='DragDropItem-Description' title={layer.description}>
        {layer.description}
      </div>
      <div className='VisibilityAction'>
        <Checkbox
          checked={
            layer.visible_by_default === undefined ? false : layer.visible_by_default
          }
          onChange={(evt) => {
            layer.visible_by_default = evt.target.checked;
            changeLayer(layer);
          }}/>
      </div>
      {
        editLayerInGroup ?
          <div className='MuiButtonLike RemoveAction'>
            <EditIcon onClick={() => {
              editLayerInGroup(layer)
            }}/>
          </div> : ''
      }

      <div className='MuiButtonLike RemoveAction'>
        <RemoveCircleIcon onClick={() => {
          removeLayer(layer)
        }}/>
      </div>
    </div>
  );
}
