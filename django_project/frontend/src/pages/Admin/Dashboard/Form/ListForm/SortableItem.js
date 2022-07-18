import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from "@mui/icons-material/Edit";
import DragHandleIcon from '@mui/icons-material/DragHandle';


export default function SortableItem(
  {
    id,
    children,
    ...props
  }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <tr className='DragDropItem' style={style}
        ref={setNodeRef}>
      <td className='DragDropItem-Drag'>
        <DragHandleIcon
          className='MuiButtonLike' {...attributes} {...listeners}/>
      </td>
      {children}
    </tr>
  );
}
