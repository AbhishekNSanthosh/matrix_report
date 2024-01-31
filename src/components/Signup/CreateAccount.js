import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled
} from '@mui/material';
import React, { memo, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { projectConfigs } from '@/utils/projectConfigs';
import Google from '@/assets/svg/Google';
import Microsoft from '@/assets/svg/Microsoft';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Link from 'next/link';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be atleast 8 character')
    .required('Invalid password'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password does not match')
    .required('Invalid password'),
  terms: yup.bool().oneOf([true], 'Please accept the terms & condition')
});

const defaultValues = {
  password: '',
  email: '',
  terms: false,
  confirm_password: ''
};

function CreateAccount({ swiper }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,

    setValue,
    watch,
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
            Create your {projectConfigs.name} account
          </Typography>
          <Typography color="primary.main" sx={styles.subLabel}>
            It’s quick and easy
          </Typography>
          <FormControl fullWidth>
            <TextField
              {...register('email')}
              error={Boolean(errors.email)}
              fullWidth
              label="Email"
              variant="outlined"
            />
            {errors?.email && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.email?.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2.5 }}>
            <TextField
              fullWidth
              type={showPassword ? 'password' : 'text'}
              label="Password"
              error={Boolean(errors.password)}
              {...register('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              variant="outlined"
            />

            {errors?.password && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.password?.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ my: 2.5 }}>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'password' : 'text'}
              label="Confirm Password"
              error={Boolean(errors.confirm_password)}
              {...register('confirm_password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}>
                      {showConfirmPassword ? (
                        <VisibilityOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              variant="outlined"
            />

            {errors?.confirm_password && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors?.confirm_password?.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControlLabel
            sx={{ mb: 2 }}
            control={
              <Checkbox
                value={watch('terms')}
                onChange={(e) => setValue('terms', e.target.value)}
              />
            }
            label={
              <Typography color="primary.main" variant="caption">
                I’ve read and I agree on Terms of Service and Privacy Policy
              </Typography>
            }
          />
          <LoadingButton
            loading={isSubmitting}
            //    type="submit"
            onClick={() => swiper?.slideNext()}
            fullWidth
            variant="contained">
            Create Account
          </LoadingButton>
          <Box sx={styles.orContainer}>
            <Box sx={{ height: 1.5, bgcolor: 'black', flex: 1, opacity: 0.2 }} />
            <Typography variant="subtitle1" color="primary.dark" sx={{ mx: 2 }}>
              or
            </Typography>
            <Box sx={{ height: 1.5, bgcolor: 'black', opacity: 0.2, flex: 1 }} />
          </Box>
          <Box sx={{ ...styles.orContainer, flexDirection: ['column', 'row'] }}>
            <Button fullWidth color="primary" variant="outlined">
              <Google />
              <Typography sx={{ ml: 1 }} variant="subtitle1" color="text.main" fontWeight="600">
                Continue with Google
              </Typography>
            </Button>
            <Box sx={{ mx: 1, my: [1, 0] }} />
            <Button fullWidth color="primary" variant="outlined">
              <Microsoft />
              <Typography variant="subtitle1" color="text.main" fontWeight="600">
                Continue with Microsoft
              </Typography>
            </Button>
          </Box>

          <Typography sx={{ mt: 6 }} textAlign="center">
            Already have an account?{' '}
            <Link href="/login">
              <Typography component={'span'} color="primary.dark">
                Login
              </Typography>{' '}
            </Link>
          </Typography>
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

export default memo(CreateAccount);
