import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { Delete } from 'mdi-material-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { DELETE_CURRENCY, GET_ONE_CURRENCY, UPDATE_CURRENCY } from '@/graphql/currency';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  code: yup.string().required('Please enter a currency code'),
  prefix: yup.string().required('Please enter a currency symbol')
});

const UpdateCurreny = ({ languages = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { code: '', prefix: '', translations: {} },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchCurrencies = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_CURRENCY,
        variables: { currency: { id: router.query?.id }, language: 'en' }
      });

      if (data?.currency) {
        setValue('code', data?.currency?.code);
        setValue('prefix', data?.currency?.prefix);

        languages.map((lang) => {
          let foundOne = data?.currency?.translations?.find(
            (trans) => trans?.language_id === lang?.id
          );

          if (foundOne) {
            setValue(`translations[${lang?.id}]`, foundOne?.name);
          }
        });
      } else {
        setNoData(true);
      }

      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

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
        mutation: UPDATE_CURRENCY,
        variables: {
          currency: {
            id: router.query?.id,
            code: params?.code,
            prefix: params?.prefix,
            suffix: params?.code
          },
          translations: translations || []
        }
      });

      if (data?.updateCurrency) {
        toast.success('Currency Updated!');
        router.push('/currency');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      } else if (errorData?.deleted) {
        setError('status', { message: errorData.deleted });
      }
    }
  };
  const onDelete = async (params) => {
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
        mutation: DELETE_CURRENCY,
        variables: {
          id: router.query?.id,
          code: params?.code,
          prefix: params?.prefix,
          translations: translations || [],
          deleted: true
        }
      });

      if (data?.deleteCurrency) {
        toast.success('Currency Deleted!');
        router.push('/currency');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      } else if (errorData?.deleted) {
        setError('status', { message: errorData.deleted });
      }
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  if (noData) {
    return <NoDataFound />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={getValues('code')}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                size="small"
                aria-label="collapse"
                sx={{ color: 'red' }}
                onClick={handleSubmit(onDelete)}>
                <Delete fontSize="small" />
              </IconButton>
            }
          />
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
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
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
                            label={language?.code}
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
                    Update
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
  let [languageRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_LANGUAGES
    })
  ]);

  return {
    props: {
      languages: languageRes?.data?.languages || []
    }
  };
}

UpdateCurreny.acl = {
  action: 'manage',
  subject: 'update-currency'
};

export default UpdateCurreny;
