/* ==========================================================================
   WIDGET SELECTION
   ========================================================================== */

import React, { Fragment, useEffect, useState } from 'react';

import Modal, { ModalContent, ModalHeader } from "../Modal";
import SummaryMember from "./SummaryWidget/SelectionMember";
import SummaryGroupMember from "./SummaryGroupWidget/SelectionMember";
import SummaryWidgetEditSection from "./SummaryWidget/edit";
import SummaryGroupWidgetEditSection from "./SummaryGroupWidget/edit";
import { DEFINITION } from "./index";
import EditSection from "./edit";

/**
 * Edit section for widget panel.
 * @param {dict} initData InitData.
 * @param {bool} open Is open or close.
 * @param {Function} setOpen Set Parent Open.
 * @param {Function} onCreated On created data.
 */
export default function WidgetSelectionSection(
  { initData, open, setOpen, onCreated }) {
  const [data, setData] = useState(initData);
  const [formOpen, setFormOpen] = useState(null);

  // onSubmitted
  useEffect(() => {
    setData(initData)
    if (initData) {
      setFormOpen(true);
    }
  }, [initData])

  /**
   * Render edit by type
   * **/
  function renderEditByType() {
    switch (data.type) {
      case DEFINITION.WidgetType.SUMMARY_WIDGET:
        return <SummaryWidgetEditSection/>;
      case DEFINITION.WidgetType.SUMMARY_GROUP_WIDGET:
        return <SummaryGroupWidgetEditSection/>;
      default:
        return ''
    }
  }

  const onClosed = () => {
    setOpen(false);
  };
  const onSelected = (newData) => {
    setOpen(false)
    setData(newData)
    setFormOpen(true)
  };

  const onCreatedData = (newData) => {
    setFormOpen(false)
    onCreated(newData)
  };

  return (
    <Fragment>
      <Modal
        open={open}
        onClosed={onClosed}
        className="modal__widget__selection"
      >
        <ModalHeader onClosed={onClosed}>
          Add new widget
        </ModalHeader>
        <ModalContent>
          <SummaryMember onClick={onSelected}/>
          <SummaryGroupMember onClick={onSelected}/>
        </ModalContent>
      </Modal>
      {
        data ? (
          <EditSection open={formOpen} onCreated={onCreatedData} data={data}>
            {renderEditByType()}
          </EditSection>
        ) : ''
      }

    </Fragment>
  )
}
