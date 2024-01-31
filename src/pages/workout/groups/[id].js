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
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { GET_ALL_LANGUAGES } from '@/graphql/Auth';
import {
  DELETE_WORKOUT_GROUPS,
  GET_ONE_WORKOUT_GROUPS,
  UPDATE_WORKOUT_GROUPS
} from '@/graphql/Workout/Groups';

const schema = yup.object().shape({
  name: yup.string().required('Please enter a group name')
});

const defaultValues = { name: '', translations: {} };

const UpdateGroup = ({ languages = [] }) => {
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

  const fetchGroup = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_GROUPS,

        variables: {
          work_group_details: {
            id: router.query?.id
          }
        }
      });

      if (data?.workoutGroup) {
        setValue('name', data?.workoutGroup?.name);
        languages.map((lang) => {
          let foundOne = data?.workoutGroup?.translations?.find(
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
    fetchGroup();
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
        mutation: UPDATE_WORKOUT_GROUPS,
        variables: {
          work_group_details: {
            id: router.query?.id,
            name: params?.name
          }
        },
        translations: translations || []
      });

      if (data?.updateWorkoutGroup) {
        toast.success('Workout Group Updated!');
        router.push('/workout/groups');
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
        mutation: DELETE_WORKOUT_GROUPS,
        variables: { id: router.query?.id }
      });
      if (data?.deleteWorkoutGroup) {
        toast.success('workout group Deleted!');
        router.push('/workout/groups');
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
                    1. Workout Group Details
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
                          label="Group Name"
                          onChange={onChange}
                          placeholder="Group Name"
                          error={Boolean(errors.title)}
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
                  <Divider sx={{ mt: 5 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 3 }}>
                    2. Workout Group Translations
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
                            placeholder="Group Name"
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

                <Grid item xs={12}>
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

export default UpdateGroup;
