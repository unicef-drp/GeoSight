import React, { useEffect, useState } from 'react';
import T from 'prop-types';

import { Modal as BaseModal } from '@mui/material'
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

function Modal({ open, onClosed, className, children }) {
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

Modal.propTypes = {
  open: T.bool,
  onClosed: T.func,
  className: T.string
};

export default Modal;