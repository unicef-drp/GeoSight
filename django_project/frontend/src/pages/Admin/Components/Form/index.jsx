import React, { useEffect } from 'react';
import $ from 'jquery';
import Select from 'react-select'
import Creatable from 'react-select/creatable';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { IconTextField } from '../../../../components/Elements/Input'

import './style.scss';

/**
 * Indicator List App
 * @param {Boolean} isSubmitted If submitted.
 * @param {Function} submit Submit.
 * @param {React.Component} children React component to be rendered.
 */
export default function AdminForm({ isSubmitted, submit, children }) {

  // onSubmitted
  useEffect(() => {
    if (isSubmitted) {
      $('.BasicForm').submit()
    }
  }, [isSubmitted])

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (submit) {
        submit();
      }
    }
  }

  /** Render Input per row
   * @param p
   * @param idx
   */
  const renderInputRow = (p, idx) => {
    const label = $(p).find('.form-label')[0]?.outerHTML;
    const error = $(p).find('.form-error')[0]?.outerHTML;
    const helptext = $(p).find('.form-helptext')[0]?.outerHTML;

    let input = <div dangerouslySetInnerHTML={{
      __html: $(p).find('.form-input')[0]?.outerHTML
    }}></div>

    // If Select, change the widget
    const $select = $(p).find('.form-input select');
    if ($select.length > 0) {
      let initValue = null
      const options = []
      $select.find('option').each(function () {
        const option = { value: $(this).attr('value'), label: $(this).html() }
        options.push(option);
        if ($(this).attr('selected')) {
          initValue = option
        }
      })

      if ($select.data('autocreated')) {
        input = <Creatable options={options} defaultValue={initValue}
                           name={$select.attr('name')}/>
      } else {
        input = <Select options={options} defaultValue={initValue}
                        name={$select.attr('name')}/>
      }
    } else {
      const $input = $(p).find('.form-input input');
      const name = $input.attr('name')
      if (name === 'username') {
        input = <IconTextField
          type={$input.attr('type')} name={$input.attr('name')}
          iconStart={<PersonIcon/>}
          onKeyDown={onKeyDown}
        />
      } else if (name === 'password') {
        input = <IconTextField
          type={$input.attr('type')} name={$input.attr('name')}
          iconStart={<LockIcon/>}
          onKeyDown={onKeyDown}
        />
      }
    }

    // Render
    return <div className='BasicFormSection' key={idx}>
      <div dangerouslySetInnerHTML={{ __html: label }}></div>
      {input}
      {error ? <div dangerouslySetInnerHTML={{ __html: error }}></div> : ''}
      {helptext ?
        <div dangerouslySetInnerHTML={{ __html: helptext }}></div> : ''}
    </div>
  }

  /** Render **/
  return (
    <div className='AdminForm'>
      <form className="BasicForm" method="post" encType="multipart/form-data">
        {$('#FormTemplate').find('.errorlist').map(function (idx) {
          return <ul className='Errorlist' dangerouslySetInnerHTML={{
            __html: $(this).html()
          }}></ul>
        })}
        {$('#FormTemplate').find('p').map(function (idx) {
          return renderInputRow(this, idx)
        })}
        {children ? children : ''}
      </form>
    </div>
  );
}