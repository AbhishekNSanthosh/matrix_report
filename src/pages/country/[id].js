import { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  CardHeader,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { LoadingButton } from '@mui/lab';
import { Delete } from 'mdi-material-ui';
import { DELETE_COUNTRY, GET_ONE_COUNTRY, UPDATE_COUNTRY } from '@/graphql/country';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  name: yup.string().required('Please enter a country name'),
  code: yup.string().required('Please enter country code')
});

const defaultValues = { name: '', code: '', translations: {} };

const CountryDetail = ({ languages = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchCountry = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_COUNTRY,
        variables: { id: router.query?.id }
      });

      if (data?.country) {
        setValue('name', data?.country?.name);
        setValue('code', data?.country?.code);
        languages.map((lang) => {
          let foundOne = data?.country?.translations?.find(
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
    fetchCountry();
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
      let variables = {
        id: router.query?.id,
        name: params?.name,
        code: params?.code,
        translations: translations || []
      };
      let { data } = await generalApoloClient.mutate({
        mutation: UPDATE_COUNTRY,
        variables
      });
      if (data?.updateCountry) {
        toast.success('Country Updated!');
        router.push('/country');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key]) {
          setError(key, { message: errorData[key] });
        }
      });
    }
  };

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_COUNTRY,
        variables: { id: router.query?.id }
      });
      if (data?.deleteCountry) {
        toast.success('Country Deleted!');
        router.push('/country');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key]) {
          setError(key, { message: errorData[key] });
        }
      });
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
          {/* <CardHeader title={getValues('name')} titleTypographyProps={{ variant: 'h6' }} /> */}
          <CardHeader
            title={getValues('name')}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                size="small"
                aria-label="collapse"
                sx={{ color: 'red' }}
                onClick={onDelete}>
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
                    1. Country Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Country Name"
                          onChange={onChange}
                          placeholder="United arab emirates"
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.name.message}
                      </FormHelperText>
                    )}
                  </FormControl>
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
                          label="Country Code"
                          onChange={onChange}
                          placeholder="UAE"
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors.code && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.code.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mt: 3 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    2. Country Translations
                  </Typography>
                </Grid>
                {languages?.map((language) => (
                  <Grid key={language?.id} item xs={12} sm={6} md={4}>
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
                            placeholder="Country Name"
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
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  loading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  size="large"
                  type="submit"
                  variant="contained">
                  Update
                </LoadingButton>
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
    let { data } = await generalApoloClient.query({
      query: GET_ALL_LANGUAGES
    });
    return {
      props: {
        languages: data?.languages || []
      }
    };
  } catch (error) {
    return {
      props: {
        languages: []
      }
    };
  }
}

CountryDetail.acl = {
  action: 'manage',
  subject: 'country-detail'
};

export default CountryDetail;
