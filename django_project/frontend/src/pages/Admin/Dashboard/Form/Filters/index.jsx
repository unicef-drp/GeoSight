import React from 'react';
import FilterSection
  from "../../../../../components/Dashboard/LeftPanel/Filters/Control";

import './style.scss';

/**
 * Widget dashboard
 */
export default function FiltersForm() {
  return <div className={'Filters'}>
    <FilterSection/>
  </div>
}