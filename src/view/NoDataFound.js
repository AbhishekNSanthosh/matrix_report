import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const NoDataFound = () => {
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
      <Typography variant="body2">Oops! No information found</Typography>
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        Please try again later
      </Typography>
    </Box>
  );
};

export default NoDataFound;
