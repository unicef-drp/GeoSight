/* ==========================================================================
   WIDGET SELECTION MEMBER
   ========================================================================== */

import React from 'react';
import WidgetSelectionMember from "../WidgetSelectionMember"

/**
 * Widget Selection Member for Summary Group.
 * @param {function} onClick When element clicked
 */
export default function SummaryGroupMember({ onClick }) {
  return <WidgetSelectionMember
    title="Summary Group Widget"
    description="Summarize all values grouping the results by unique values in another column."
    onClick={onClick}
    defaultData={{
      "type": "SummaryGroupWidget",
    }}
  >
  </WidgetSelectionMember>
}