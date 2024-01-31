import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { ADD_CURRENCY } from '@/graphql/currency';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  code: yup.string().required('Please enter a currency code'),
  prefix: yup.string().required('Please enter a currency symbol')
});

const AddCurrency = ({ languages = [] }) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { code: '', prefix: '', translations: {} },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    let translations = [];

    if (params?.translations) {
      Object.keys(params?.translations).map((key) => {
        if (params?.translations[key]) {
          translations.push({ id: key, value: params?.translations[key] });
        }
      });
    }

    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_CURRENCY,
        variables: {
          currency: { code: params?.code, prefix: params?.prefix, suffix: params?.code },
          translations: translations || []
        }
      });
      if (data?.createCurrency) {
        toast.success('New Currency Created!');
        router.push('/currency');
      }
      return true;
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.code) {
        setError('code', { message: errorData.code });
      }
      return false;
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create Currency" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. Currency
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Currency Code"
                          onChange={onChange}
                          placeholder="Currency Code"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.code && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.code?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="prefix"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Currency Symbol"
                          onChange={onChange}
                          placeholder="Currency Symbol"
                          error={Boolean(errors?.prefix)}
                        />
                      )}
                    />
                    {errors?.prefix && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.prefix?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mt: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    2. Currency Translations
                  </Typography>
                </Grid>
                {languages?.map((language) => (
                  <Grid key={language?.id} item xs={12} sm={4} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`translations[${language?.id}]`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={language?.name}
                            InputLabelProps={{ style: { textTransform: 'capitalize' } }}
                            id="outlined-start-adornment"
                            onChange={onChange}
                            placeholder="Currency Code"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  style={{ textTransform: 'uppercase' }}
                                  position="start">
                                  {language?.code}
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                ))}

                <Grid item xs={12} sx={{ mt: 3 }}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mr: 3 }}>
                    Submit
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export async function getServerSideProps() {
  try {
    const [languageRes] = await Promise.all([
      generalApoloClient.query({
        query: GET_ALL_LANGUAGES
      })
    ]);

    return {
      props: {
        languages: languageRes?.data?.languages || []
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        languages: []
      }
      // You can also redirect to an error page if needed
      // redirect: {
      //   destination: '/error',
      //   permanent: false,
      // }
    };
  }
}

export default AddCurrency;
