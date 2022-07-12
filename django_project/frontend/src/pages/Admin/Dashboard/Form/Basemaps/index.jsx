import React, { useState } from 'react';
import { useSelector } from "react-redux";
import VisibilityIcon from '@mui/icons-material/Visibility';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { AddButton } from "../../../../../components/Elements/Button";

/**
 * Basemaps dashboard
 */
export default function BasemapsForm() {
  const pageName = 'Basemaps';

  const {} = useSelector(state => state.dashboard.data);
  const [groups, setGroups] = useState({});

  /** Add group */
  const addGroup = () => {
    let created = false;
    let idx = Object.keys(groups).length + 1;
    while (!created) {
      const name = 'Group ' + idx;
      if (!groups[name]) {
        groups[name] = []
        created = true;
      }
      idx += 1;
    }
    setGroups({ ...groups })
  }

  const removeGroup = (groupName) => {
    delete groups[groupName]
    setGroups({ ...groups })
  }

  return (
    <div className={'TableForm ' + pageName}>
      <div className='TableForm-Header'>
        <div className='TableForm-Header-Left'></div>
        <div className='TableForm-Header-Right'>
          <AddButton
            variant="secondary" text={"Add Group"} onClick={addGroup}/>
          <AddButton
            variant="secondary" text={"Add " + pageName}/>
        </div>
      </div>
      <table className="DragDropTable">
        {
          Object.keys(groups).map(groupName => {
            return (
              <tbody key={groupName}>
              <tr className='GroupRow'>
                <th>Group: {groupName}</th>
                <th className='VisibilityAction'><VisibilityIcon/></th>
                <th className='MuiButtonLike RemoveAction'>
                  <RemoveCircleIcon onClick={() => {
                    removeGroup(groupName)
                  }}/>
                </th>
              </tr>
              </tbody>
            )
          })
        }
      </table>
    </div>
  )
}