import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CircularLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%'
      }}>
      <CircularProgress sx={{ color: (theme) => theme.palette.secondary.main }} />
    </Box>
  );
};

export default CircularLoader;
