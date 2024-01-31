import { Box, CircularProgress } from '@mui/material';
import React from 'react';

function Spinner() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <CircularProgress />
    </Box>
  );
}

export default Spinner;
