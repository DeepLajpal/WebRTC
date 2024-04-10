import * as React from 'react';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import { keyframes } from '@mui/system';

const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

export default function GetSnackbar({ open, handleClose, message }) {
  const animationDuration = 600;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
      autoHideDuration={4000}
      animationDuration={animationDuration}
      sx={{
        ...(open && {
          animation: `${inAnimation} ${animationDuration}ms forwards`,
        }),
        ...(!open && {
          animation: `${outAnimation} ${animationDuration}ms forwards`,
        }),
      }}
    >
      {message}
    </Snackbar>
  );
}
