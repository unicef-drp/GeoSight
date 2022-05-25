/* ==========================================================================
   SUMMARY WIDGET EDITOR
   ========================================================================== */

import React, { Fragment } from 'react';
import EditSection from "../edit"

/**
 * Edit section for widget.
 * @param {int} idx Index of widget
 * @param {object} data Widget Data.
 */
export default function SummaryGroupWidgetEditSection({idx, data}) {
  return (
    <Fragment>
      <EditSection idx={idx} data={data}></EditSection>
    </Fragment>
  )
}
