import React, { useState } from 'react';

import { render } from '../../../../app';
import { store } from '../../../../store/admin/Indicator';
import { SaveButton } from "../../../../components/Elements/Button";
import Admin, { pageNames } from '../../index';
import AdminForm from '../../Form'

import './style.scss';


/**
 * Indicator Form App
 */
export default function BasemapForm() {
  const [submitted, setSubmitted] = useState(false);

  /** Render **/
  const submit = () => {
    setSubmitted(true)
  }

  return (
    <Admin
      className='Indicator'
      pageName={pageNames.Basemaps}
      rightHeader={
        <SaveButton
          variant="secondary"
          text="Submit"
          onClick={submit}
          disabled={submitted ? true : false}
        />
      }>

      <AdminForm isSubmitted={submitted}/>
    </Admin>
  );
}

render(BasemapForm, store)