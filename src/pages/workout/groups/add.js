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
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';
import { ADD_WORKOUT_GROUPS } from '@/graphql/Workout/Groups';

const schema = yup.object().shape({
  name: yup.string().required('Please enter a group name')
});

const defaultValues = { name: '', translations: {} };

const AddGroups = ({ languages = [] }) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: defaultValues,
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
    console.log({
      name: params?.name,
      translations: translations || []
    });
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_WORKOUT_GROUPS,
        variables: {
          work_group_details: {
            name: params?.name
          }
        },
        translations: translations || []
      });
      if (data?.createWorkoutGroup) {
        toast.success('New workout group Created!');
        router.push('/workout/groups');
      }
      return true;
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      }
      return false;
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create Workout Groups" titleTypographyProps={{ variant: 'h6' }} />
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

export default AddGroups;
