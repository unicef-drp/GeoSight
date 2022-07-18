import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandleIcon from '@mui/icons-material/DragHandle';


export default function SortableItem(
  {
    id,
    isDropArea,
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
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <tr className='DragDropItem' style={style}
        ref={setNodeRef}>
      {
        isDropArea ? '' :
          <td className='DragDropItem-Drag'>
            <DragHandleIcon
              className='MuiButtonLike' {...attributes} {...listeners}/>
          </td>
      }
      {children}
    </tr>
  );
}
