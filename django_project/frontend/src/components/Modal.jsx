/* ==========================================================================
   BASE MODAL CONTAINER
   ========================================================================== */

import React, { useEffect, useState } from 'react';

import { Modal as BaseModal } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

/**
 * Base modal component
 * @param {bool} open Initial state if modal is open or not
 * @param {function} onClosed Function when modal closed
 * @param {string} className Class name for modal
 * @param {React.Component} children React component to be rendered
 */
export default function Modal(
  { open, onClosed, className, children }
) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open])

  const onClosedFn = () => {
    setIsOpen(false);
    onClosed();
  };

  return (
    <BaseModal
      open={isOpen}
      onClose={onClosedFn}
      className={className}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
    >
      <Fade in={isOpen}>
        <Box className='modal--box'>
          <div>
            {children}
          </div>
        </Box>
      </Fade>
    </BaseModal>
  )
}

export function ModalHeader({ children }) {
  return (
    <div className='modal--header'>
      {children}
    </div>
  )
}

export function ModalContent({ children }) {
  return (
    <div className='modal--content'>
      {children}
    </div>
  )
}
