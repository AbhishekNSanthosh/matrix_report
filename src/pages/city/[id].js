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
  InputLabel,
  MenuItem,
  Select,
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
import { DELETE_CITY, GET_CITY, UPDATE_CITY } from '@/graphql/city';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';
import { GET_ALL_COUNTRY } from '@/graphql/country';

const schema = yup.object().shape({
  name: yup.string().required('Please enter city name'),
  code: yup.string().required('Please enter city code'),
  country_id: yup.string().required('Please select a country'),
  latitude: yup.number().required('Please add latitude of your city'),
  longitude: yup.number().required('Please add longitude of your city')
});

const defaultValues = {
  name: '',
  code: '',
  translations: {},
  country_id: '',
  latitude: '',
  longitude: ''
};

const CityDetail = ({ languages = [], countries = [] }) => {
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const router = useRouter();

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

  const fetchCity = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_CITY,
        variables: { id: router.query?.id }
      });
      if (data?.city) {
        setValue('name', data?.city?.name);
        setValue('code', data?.city?.code);
        setValue('country_id', data?.city?.country_id);
        setValue('latitude', data?.city?.location?.coordinates?.[1]);
        setValue('longitude', data?.city?.location?.coordinates?.[0]);
        languages.map((lang) => {
          let foundOne = data?.city?.translations?.find((trans) => trans?.language_id === lang?.id);
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
    fetchCity();
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
        country_id: params?.country_id,
        location: [+params?.longitude, +params?.latitude],
        translations: translations || []
      };
      let { data } = await generalApoloClient.mutate({
        mutation: UPDATE_CITY,
        variables
      });
      if (data?.updateCity) {
        toast.success('City Updated!');
        router.push('/city');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key] === 'location') {
          setError('latitude', { message: errorData[key] });
          setError('longitude', { message: errorData[key] });
        }
        if (errorData?.[key]) {
          setError(key, { message: errorData[key] });
        }
      });
    }
  };

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_CITY,
        variables: { id: router.query?.id }
      });
      if (data?.deleteCity) {
        toast.success('City Deleted!');
        router.push('/city');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key] === 'location') {
          setError('latitude', { message: errorData[key] });
          setError('longitude', { message: errorData[key] });
        }
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
                    1. City Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="country_id">Country</InputLabel>
                    <Controller
                      name="country_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Country"
                          error={Boolean(errors.country_id)}
                          labelId="country_id">
                          {countries?.map((country) => (
                            <MenuItem key={country?.id} value={country?.id}>
                              {country?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.country_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.country_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="City Name"
                          onChange={onChange}
                          placeholder="Abu Dhabi"
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
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="City Code"
                          onChange={onChange}
                          placeholder=""
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

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="latitude"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Latitude"
                          onChange={onChange}
                          placeholder="11.1111"
                          error={Boolean(errors?.latitude)}
                        />
                      )}
                    />
                    {errors?.latitude && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.latitude?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="longitude"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Longitude"
                          onChange={onChange}
                          placeholder="71.1282"
                          error={Boolean(errors?.longitude)}
                        />
                      )}
                    />
                    {errors?.longitude && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.longitude?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ mt: 3 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. City Translations
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
              <Grid item xs={12} sx={{ mt: 4 }}>
                <LoadingButton
                  loading={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{ mr: 3 }}>
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
  let [languageRes, countryRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_LANGUAGES
    }),
    generalApoloClient.query({
      query: GET_ALL_COUNTRY
    })
  ]);

  return {
    props: {
      languages: languageRes?.data?.languages || [],
      countries: countryRes?.data?.countries?.data || []
    }
  };
}

CityDetail.acl = {
  action: 'manage',
  subject: 'city-detail'
};

export default CityDetail;
