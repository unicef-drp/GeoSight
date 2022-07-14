import React, { useState } from 'react';
import { store } from '../../store/admin';
import App, { render } from '../../app';
import AdminForm from "../Admin/Components/Form";
import { ThemeButton } from "../../components/Elements/Button";


import './style.scss';

/**
 * Home Page App
 */
export default function Login() {
  const [submitted, setSubmitted] = useState(false);

  /** Render **/
  const login = () => {
    setSubmitted(true)
  }

  /** Render **/
  return (
    <App className='Login'>
      <div className='Background'></div>
      <div className='Login'>
        <div className='LoginHeader'>Welcome to {preferences.site_title}</div>
        <AdminForm isSubmitted={submitted} submit={() => {
          setSubmitted(true)
        }}/>

        <ThemeButton
          variant="secondary"
          onClick={login}
          disabled={submitted ? true : false}
        >
          LOG IN
        </ThemeButton>
      </div>
    </App>
  )
}

render(Login, store)