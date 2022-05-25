/* ==========================================================================
   WIDGET SELECTION MEMBER
   ========================================================================== */

import React from 'react';
import WidgetSelectionMember from "../WidgetSelectionMember"

/**
 * Widget Selection Member for Summary.
 * @param {function} onClick When element clicked
 */
export default function SummaryMember({ onClick }) {
  return <WidgetSelectionMember
    title="Summary Widget"
    description="Summarize all data with specific property."
    onClick={onClick}
    defaultData={{
      "type": "SummaryWidget",
    }}
  />
}