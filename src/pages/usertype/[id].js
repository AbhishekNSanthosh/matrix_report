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
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { Delete } from 'mdi-material-ui';
import { generalApoloClient } from '@/config/apolloClient';
import { DELETE_USER_TYPE, GET_USER_TYPE, UPDATE_USER_TYPE } from '@/graphql/usertype';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  name: yup.string().required('Please enter a user type')
});

const UpdateUserType = ({ languages = [] }) => {
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
    defaultValues: { name: '', translations: {} },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchUserType = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_USER_TYPE,
        variables: { id: router.query?.id }
      });

      if (data?.userType) {
        setValue('name', data?.userType?.name);
        languages.map((lang) => {
          let foundOne = data?.userType?.translations?.find(
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
    fetchUserType();
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
        mutation: UPDATE_USER_TYPE,
        variables: {
          id: router.query?.id,
          name: params?.name,
          translations: translations || []
        }
      });

      if (data?.updateUserType) {
        toast.success('User Type Updated!');
        router.push('/usertype');
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
      let variables = {
        id: router.query?.id
      };
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_USER_TYPE,
        variables
      });
      if (data?.deleteUserType) {
        toast.success('User Type Deleted!');
        router.push('/usertype');
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
            title={getValues('name')}
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
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    1. User Type Details
                  </Typography>
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
                          label="User Type"
                          onChange={onChange}
                          placeholder="User Type"
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
                <Grid item xs={12}>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. User Type Translations
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
                            placeholder="User Type"
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

UpdateUserType.acl = {
  action: 'manage',
  subject: 'update-usertype'
};

export default UpdateUserType;
