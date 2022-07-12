import React from 'react';
import { useSelector } from "react-redux";
import Actions from "../../../../../redux/actions/dashboard";
import ListForm from '../ListForm'

/**
 * Widget dashboard
 */
export default function WidgetForm() {
  const { widgets } = useSelector(state => state.dashboard.data);
  console.log(widgets)
  return <ListForm
    pageName={'Widgets'}
    data={widgets}
    addLayerAction={Actions.Widget.add}
    removeLayerAction={Actions.Widget.remove}
    changeLayerAction={Actions.Widget.update}
    addLayerInGroup={(groupName) => {
      console.log(groupName)
    }}
  />
}