import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  styled
} from '@mui/material';
import React, { useState } from 'react';
import { EyeOffOutline, EyeOutline } from 'mdi-material-ui';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { validateGraphQlError } from '@/utils/ValidateError';
import { LOGIN_ADMIN } from '@/graphql/Auth';
import { generalApoloClient } from '@/config/apolloClient';
import { useAuth } from '@/hooks/useAuth';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be atleast 8 character')
    .required('Invalid password')
});

const defaultValues = {
  password: '',
  email: ''
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);

  const auth = useAuth();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    const { email, password } = params;

    let deviceData = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
      .then((response) => response.text())
      .then((traceData) => {
        // eslint-disable-next-line no-useless-escape
        let infoData = traceData.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
        infoData = '{"' + infoData.slice(0, infoData.lastIndexOf('","')) + '"}';
        return JSON.parse(infoData);
      });
    const ip = deviceData.ip;
    const location = deviceData.loc;
    const deviceInfo = deviceData.uag;
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: LOGIN_ADMIN,
        variables: {
          email: email,
          password: password,
          deviceInfo,
          ip,
          location,
          captcha_token: 'captcha_token'
        }
      });
      if (data?.loginAdminUser) {
        auth.login(data?.loginAdminUser, (error) => {
          setError('email', { message: error });
        });
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key]) {
          setError(key, { message: errorData[key] });
        }
      });
    }

    // try {
    //   let res = await signIn('credentials', {
    //     email,
    //     password,
    //     redirect: false
    //   });

    //   if (res.error) {
    //     toast.error(res.error);
    //   }
    // } catch (error) {
    //   toast.error(error);
    //   let errorData = validateGraphQlError(error);
    //   Object.keys(defaultValues).map((key) => {
    //     if (errorData?.[key]) {
    //       setError(key, { message: errorData[key] });
    //     }
    //   });
    // }
  };
  return (
    <Grid container sx={styles.container}>
      <LoginContainerGrid xs={12} sm={10} md={5}>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Typography color="text.main" sx={styles.welcomeHeader}>
            Tax Live
          </Typography>
          <Typography color="text.main" sx={styles.welcomeHeader}>
            Hi,Welcome Back !
          </Typography>
          <FormControl fullWidth>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  error={Boolean(errors.email)}
                  placeholder="Email id"
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ my: 2.5 }}>
            <InputLabel htmlFor="auth-login-v2-password" error={Boolean(errors.password)}>
              Password
            </InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <OutlinedInput
                  value={value}
                  onBlur={onBlur}
                  label="Password"
                  onChange={onChange}
                  id="auth-login-v2-password"
                  error={Boolean(errors.password)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.password && (
              <FormHelperText sx={{ color: 'error.main' }} id="">
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>

          <LoadingButton
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}>
            SIGN IN
          </LoadingButton>

          {/* <Typography sx={{ mb: 2.5, mt: 5 }} textAlign="center">
            Forgot Password?
          </Typography>
          <Typography textAlign="center">
            Doesn’t have an account?{' '}
            <Link href="/signup">
              <Typography component={'span'} color="primary.dark">
                Create Account
              </Typography>{' '}
            </Link>
          </Typography> */}
        </form>
      </LoginContainerGrid>
    </Grid>
  );
};

const LoginContainerGrid = styled(Grid)(({ theme }) => ({
  backgroundImage: 'url("/bg.png")',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
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
    marginBottom: 3
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
  button: { backgroundColor: '#60B566', color: '#FFF', fontWeight: 'bold' }
};

Login.getLayout = (page) => page;
Login.guestGuard = true;

export default Login;
