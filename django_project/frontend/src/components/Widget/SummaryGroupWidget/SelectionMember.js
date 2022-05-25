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
    description="Summarize all data with specific property by grouping to another specific property."
    onClick={onClick}
    defaultData={{
      "type": "SummaryGroupWidget",
    }}
  >
  </WidgetSelectionMember>
}