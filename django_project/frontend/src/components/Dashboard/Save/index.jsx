/* ==========================================================================
   RIGHT SIDE CONTAINER
   ========================================================================== */

import React, { useState } from 'react';
import $ from 'jquery';
import { useSelector } from "react-redux";
import { Button, FormControl, Input, InputLabel } from '@mui/material'
import Modal, { ModalContent, ModalHeader } from "../../Modal";

import { postData } from "../../../Requests"

import './style.scss';

export default function SaveDashboard() {
  const csrftoken = csrfmiddlewaretoken; // eslint-disable-line no-undef
  const {
    name,
    description,
    referenceLayer,
    indicators,
    basemapsLayers,
    contextLayers,
    widgets,
    extent,
    defaultBasemapLayer
  } = useSelector(state => state.dashboard.data);
  const filtersData = useSelector(state => state.filtersData);

  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [nameData, setNameData] = useState(name);
  const [descriptionData, setDescriptionData] = useState(description);

  // Open modal
  const onOpen = () => {
    setOpen(true);
  };

  // Close modal
  const onClosed = () => {
    setOpen(false);
  };

  const submit = () => {

    const error = [];
    if (Object.keys(referenceLayer).length === 0) {
      error.push('Need to select Reference Dataset.')
    }
    if (indicators.length === 0) {
      error.push('Indicators is empty, please select one or more indicator.')
    }
    if (basemapsLayers.length === 0) {
      error.push('Basemap is empty, please select one or more basemap.')
    }
    if ($('.widget__error').length > 0) {
      error.push('There is widget that error, please fix it.')
    }
    setError(error.join('<br>'));

    // Submit dashboard
    if (error.length === 0) {
      const data = {
        'referenceLayer': referenceLayer.identifier,
        'indicators': indicators.map(function (indicator) {
          return indicator.id;
        }),
        'basemapsLayers': basemapsLayers.map(function (basemapsLayer) {
          return basemapsLayer.id;
        }),
        'contextLayers': contextLayers.map(function (contextLayer) {
          return contextLayer.id;
        }),
        'defaultBasemapLayer': defaultBasemapLayer,
        'extent': extent,
        'widgets': widgets,
        'filters': filtersData
      }
      setData(JSON.stringify(data));
      onOpen();
    }
  }
  const submitForm = (event) => {
    event.preventDefault();
    var data = new FormData()
    data.append('icon', event.target.icon.files[0])
    data.append('name', event.target.name.value)
    data.append('description', event.target.description.value)
    data.append('data', event.target.data.value)

    postData(
      document.location.href,
      data,
      function (response, error) {
        onClosed()
        if (error) {
          setError(error)
        } else {
          window.location = response.url;
        }
      }
    )
  }
  return (
    <div id='dashboard_save'>
      <Button
        variant="primary" type="submit"
        className="dashboard_save__submit"
        onClick={submit}
        disabled={submitting}
      >
        SUBMIT
      </Button>
      <div id='dashboard_save__error'
           className={error ? 'show' : 'hide'}
           onClick={() => {
             setError('');
           }}>
        <div dangerouslySetInnerHTML={{ __html: error }}/>
      </div>

      <Modal
        open={open}
        onClosed={onClosed}
        className='dashboard__submit__modal'
      >
        <ModalHeader onClosed={onClosed}>
          Dashboard Detail
        </ModalHeader>
        <ModalContent>
          <form method='POST' onSubmit={submitForm}>
            <FormControl>
              <InputLabel>Title</InputLabel>
              <Input type="text" name="name" placeholder="Dashboard title"
                     value={nameData}
                     onChange={(event) => {
                       setNameData(event.target.value)
                     }}
                     required={true}/>
            </FormControl>
            <FormControl>
              <InputLabel>Description</InputLabel>
              <Input type="text" name="description"
                     value={descriptionData}
                     onChange={(event) => {
                       setDescriptionData(event.target.value)
                     }}
                     placeholder="Dashboard description"/>
            </FormControl>
            <FormControl>
              <input type="file" name="icon"
                     accept="image/png, image/jpeg"/>
            </FormControl>
            <br/>
            <Button variant="primary" type="submit"
                    className="dashboard__submit__button"
                    disabled={submitting}
            >
              Submit
            </Button>
            <FormControl className='MuiFormControl-hidden'>
              <Input type="hidden" name="data" value={data}/>
            </FormControl>
            <FormControl className='MuiFormControl-hidden'>
              <Input
                type="hidden" name="csrfmiddlewaretoken"
                value={csrftoken}/>
            </FormControl>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
