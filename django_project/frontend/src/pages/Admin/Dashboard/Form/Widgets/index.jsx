import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../../redux/actions/dashboard";
import ListForm from '../ListForm'
import WidgetSelectionSection
  from "../../../../../components/Widget/WidgetSelection";

/**
 * Widget dashboard
 */
export default function WidgetForm() {
  const dispatch = useDispatch();
  const { widgets } = useSelector(state => state.dashboard.data);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

  const onCreated = (newData) => {
    if (newData) {
      if (!newData.id) {
        const newID = Math.max(...widgets.map(widget => {
          return widget.id;
        }))
        const newOrder = Math.max(...widgets.map(widget => {
          return widget.order;
        }))
        newData.visible_by_default = true;
        newData.id = newID + 1;
        newData.group = groupName;
        newData.order = newOrder + 1;
        dispatch(Actions.Widget.add(newData))
      } else {
        dispatch(Actions.Widget.update(newData))
      }
    }
    setSelectedWidget(null)
  }

  const setOpenModal = (opened) => {
    if (!opened) {
      setSelectedWidget(null)
    }
    setOpen(opened)
  }

  return <Fragment>
    <WidgetSelectionSection
      initData={selectedWidget}
      open={open} setOpen={setOpenModal}
      onCreated={onCreated}/>
    <ListForm
      pageName={'Widgets'}
      data={widgets}
      addLayerAction={Actions.Widget.add}
      removeLayerAction={Actions.Widget.remove}
      changeLayerAction={Actions.Widget.update}
      addLayerInGroupAction={(groupName) => {
        setSelectedWidget(null)
        setGroupName(groupName)
        setOpen(true)
      }}
      editLayerInGroupAction={(data) => {
        setSelectedWidget(data)
      }}
    />
  </Fragment>
}