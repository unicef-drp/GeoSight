import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 32,
  height: 24,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(0)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(10px)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 20,
    height: 20,
    '&:before': {
      content: "'OR'",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function SwitchOrAnd() {
  return <FormControlLabel
    control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked/>}
    label="switch"
  />
}