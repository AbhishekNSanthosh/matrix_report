import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled
} from '@mui/material';
import React, { memo } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

const schema = yup.object().shape({
  business_name: yup.string().required('Name is required'),
  industry: yup.string().required('Industry is required'),
  business_type: yup.string().required('Business type is required'),
  country: yup.string().required('Country is required')
});

const defaultValues = {
  business_name: '',
  business_type: '',
  country: '',
  industry: ''
};

function PersonaliseAccount({ swiper }) {
  const {
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = () => {};

  return (
    <Grid container sx={styles.container}>
      <LoginContainerGrid xs={12} sm={10} md={5}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Typography color="text.main" sx={styles.welcomeHeader}>
            Personalize your account
          </Typography>
          <Typography color="primary.main" sx={styles.subLabel}>
            Still quick and easy
          </Typography>
          <FormControl fullWidth>
            <TextField
              {...register('business_name')}
              error={Boolean(errors.business_name)}
              fullWidth
              label="Business Name"
              variant="outlined"
            />
            {errors?.business_name && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.business_name?.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2.5 }}>
            <InputLabel id="industry">Industry</InputLabel>
            <Select {...register('industry')} labelId="industry" label="Industry">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {errors?.industry && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.industry?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ my: 2.5 }}>
            <InputLabel id="business_type">Business Type</InputLabel>
            <Select {...register('business_type')} labelId="business_type" label="Business Type">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {errors?.business_type && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.business_type?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2.5 }}>
            <InputLabel id="country">Country</InputLabel>
            <Select {...register('country')} labelId="country" label="Country">
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {errors?.country && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.country?.message}
              </FormHelperText>
            )}
          </FormControl>

          <LoadingButton
            loading={isSubmitting} //    type="submit"
            onClick={() => swiper?.slideNext()}
            fullWidth
            variant="contained">
            Continue
          </LoadingButton>
        </form>
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
  }
};

export default memo(PersonaliseAccount);
