/* ==========================================================================
   WIDGET SELECTION
   ========================================================================== */

import React, { Fragment, useState } from 'react';
import { Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

import Modal, { ModalContent, ModalHeader } from "../Modal";
import SummaryMember from "./SummaryWidget/SelectionMember";
import SummaryGroupMember from "./SummaryGroupWidget/SelectionMember";

/**
 * Edit section for widget panel.
 */
export default function WidgetSelectionSection() {
  const [open, setOpen] = useState(false);

  // Open modal
  const onOpen = () => {
    setOpen(true);
  };

  // Close modal
  const onClosed = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <div className='setting__button' onClick={(event) => {
        event.stopPropagation();
      }}>
        <Tooltip title="Add new widget">
          <Button variant="secondary"
                  className="widget__add__button"
                  onClick={() => {
                    onOpen()
                  }}
          >
            <AddIcon/> Add New Widget
          </Button>
        </Tooltip>

        <Modal
          open={open}
          onClosed={onClosed}
          className="modal__widget__selection"
        >
          <ModalHeader>
            Add new widget
          </ModalHeader>
          <ModalContent>
            <SummaryMember onClick={onClosed}/>
            <SummaryGroupMember onClick={onClosed}/>
          </ModalContent>
        </Modal>
      </div>
    </Fragment>
  )
}
