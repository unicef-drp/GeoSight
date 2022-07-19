import React, { Fragment, useEffect, useState } from 'react';
import $ from 'jquery';
import ErrorIcon from '@mui/icons-material/Error';

import { render } from '../../../../app';
import { store } from '../../../../store/admin';
import Admin, { pageNames } from "../../index";
import Modal, { ModalHeader } from "../../../../components/Modal";
import { EditButton } from "../../../../components/Elements/Button";

import './style.scss';


/**
 * MetaIngestor App
 */
export default function Detail() {
  const period = 1000;
  const [open, setOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(currentLogData);

  /** When current log is changed */
  useEffect(() => {
    if (currentLog.status === 'Running') {
      setTimeout(function () {
        $.ajax({
          url: currentLog.api,
          dataType: 'json',
          success: function (json, textStatus, request) {
            setCurrentLog({ ...json })
          },
          error: function () {
            setCurrentLog({ ...currentLog })
          }
        });
      }, period);
    }
  }, [currentLog]);

  return (
    <Admin
      pageName={pageNames.Indicators}
      rightHeader={
        <a href={editUrl}>
          <EditButton
            variant="secondary"
            text="Edit"
          />
        </a>
      }
    >
      <div className='PageContent'>
        <b className='light'>Harvester Class</b> : {harvester.name}
        <div className='PageSection'>
          <div className='PageSectionTitle'>Last Run
            : {currentLog.start_time}</div>
          <div
            className={
              'HarvesterStatus ' + currentLog.status
            }>
            <span>{currentLog.status} </span>
            <span> {currentLog.note ? '- ' + currentLog.note : ''}</span>
            <span
              className='HarvesterStatusDetail MuiButtonLike'>
              {
                currentLog.html_detail ? (
                  <Fragment>
                    <ErrorIcon onClick={() => {
                      setOpen(true)
                    }}/>

                    <Modal
                      className='HarvesterStatusDetailModal'
                      open={open}
                      onClosed={() => {
                        setOpen(false)
                      }}
                    >
                      <ModalHeader onClosed={() => {
                        setOpen(false)
                      }}>
                        Harvester Status
                      </ModalHeader>
                      <div className='HarvesterStatusDetailTable'
                           dangerouslySetInnerHTML={{ __html: currentLog.html_detail }}>
                      </div>
                    </Modal>
                  </Fragment>
                ) : ''
              }
            </span>
          </div>
        </div>
        <div className='PageSection'>
          <div className='PageSectionTitle'>Attributes</div>
          <table className='PageSectionTable'>
            <tbody>
            {
              harvester.user ?
                <tr>
                  <td>User who run</td>
                  <td>
                    {harvester.user.full_name}
                  </td>
                </tr>
                : ""
            }
            {
              attributesData.map(attr => {
                return (
                  <tr key={attr.name}>
                    <td>{attr.name}</td>
                    <td>{attr.value}</td>
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </Admin>
  );
}


render(Detail, store)