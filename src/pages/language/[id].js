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
import { DELETE_LANGUAGE, GET_ONE_LANGUAGE, UPDATE_LANGUAGE } from '@/graphql/languages';

const schema = yup.object().shape({
  code: yup.string().required('Please enter a language code'),
  name: yup.string().required('Please enter a language name')
});

const Updatelanguage = () => {
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

  const fetchLanguages = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_LANGUAGE,
        variables: { id: router.query?.id }
      });

      if (data?.language) {
        setValue('code', data?.language?.code);
        setValue('name', data?.language?.name);
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
    fetchLanguages();
  }, []);

  const onSubmit = async (params) => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: UPDATE_LANGUAGE,
        variables: {
          id: router.query?.id,
          code: params?.code,
          name: params?.name
        }
      });

      if (data?.updateLanguage) {
        toast.success('Language Updated!');
        router.push('/language');
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

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_LANGUAGE,
        variables: {
          id: router.query?.id
        }
      });

      if (data?.deleteLanguage) {
        toast.success('Language Deleted!');
        router.push('/language');
      }
    } catch (error) {
      validateGraphQlError(error);
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
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. Currency
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
                          label="Language Name"
                          onChange={onChange}
                          placeholder="Language Name"
                          error={Boolean(errors?.name)}
                        />
                      )}
                    />
                    {errors?.code && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.name?.message}
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
                          label="Language Code"
                          onChange={onChange}
                          placeholder="Language Code"
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

                <Grid item xs={12}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large">
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

export default Updatelanguage;
