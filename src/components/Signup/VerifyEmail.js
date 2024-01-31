import { Box, Button, FormControl, FormHelperText, Grid, Typography, styled } from '@mui/material';
import React, { memo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import dynamic from 'next/dynamic';

const MuiOtpInput = dynamic(
  () => import('mui-one-time-password-input').then((module) => module.MuiOtpInput),
  {
    ssr: false
  }
);

function VerifyEmail({ swiper }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {};

  return (
    <Grid container sx={styles.container}>
      <LoginContainerGrid xs={12} sm={10} md={5}>
        <Typography color="text.main" sx={styles.welcomeHeader}>
          Verify your Email
        </Typography>
        <Typography color="primary.main" sx={styles.subLabel}>
          Verification code has been sent to your email mehthab@test.com
        </Typography>
        <FormControl fullWidth>
          <MuiOtpInput length={4} fontSize={32} value={otp} onChange={setOtp} />

          {error && (
            <FormHelperText sx={{ color: 'error.main' }} id="">
              {error}
            </FormHelperText>
          )}
        </FormControl>

        <Box sx={{ mt: 4, mb: 10 }}>
          <Typography color="primary.main" sx={styles.didRecieve}>
            Don’t receive code?
          </Typography>
          <Button sx={{ ml: -1 }} color="primary" variant="text">
            Resend Email
          </Button>
        </Box>

        <LoadingButton
          //    type="submit"
          onClick={() => swiper?.slideNext()}
          fullWidth
          variant="contained">
          Verify
        </LoadingButton>
      </LoginContainerGrid>
    </Grid>
  );
}

const LoginContainerGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: theme.spacing(1.5),
  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3)
  }
}));

const styles = {
  welcomeHeader: {
    fontSize: 24,
    fontWeight: 700,
    mb: 1
  },
  subLabel: {
    fontSize: 15,
    fontWeight: 400,
    mb: 5
  },
  appLogo: {
    borderRadius: 0,
    width: 130,
    objectFit: 'contain',
    backgroundColor: 'transparent',
    height: 25,
    marginBottom: 4
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#FAFAFA'
  },
  orContainer: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    my: 3
  },
  didRecieve: {
    fontSize: 14,
    fontWeight: 400,
    mb: 0.5
  }
};

export default memo(VerifyEmail);
