import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';

import { useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import {
  ADD_WORKOUT_PROGRAMS_DAY,
  DELETE_WORKOUT_PROGRAMS_DAY,
  GET_ONE_WORKOUT_PROGRAMS_DAY
} from '@/graphql/Workout/ProgrammesDay';
import { GET_ALL_WORKOUT_PROGRAMS } from '@/graphql/Workout/Programmes';
import { Delete } from 'mdi-material-ui';

const schema = yup.object().shape({
  day_no: yup.number().required('please enter days'),
  program_id: yup.string().required('please select programme')
});

const ProgrammeDayUpdate = ({ programmes = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      day_no: '',
      program_id: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchProgramesDay = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_PROGRAMS_DAY,
        variables: { work_program_day_details: { id: router.query?.id } }
      });

      if (data.workoutProgramsDay) {
        setValue('day_no', data?.workoutProgramsDay?.day_no);
        setValue('program_id', data?.workoutProgramsDay?.program_id);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramesDay();
  }, []);

  const onSubmit = async (params) => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_WORKOUT_PROGRAMS_DAY,
        variables: {
          id: router.query?.id,
          day_no: params?.day_no,
          program_id: params?.program_id
        }
      });

      if (data?.createWorkoutProgramDay) {
        toast.success('No of Days More Added!');
        router.replace('/workout/programmes-day');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      }
    }
  };

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_WORKOUT_PROGRAMS_DAY,
        variables: { id: router.query?.id }
      });
      if (data?.deleteWorkoutProgramDay) {
        toast.success('ProgrammeDays Deleted!');
        router.push('/workout/programmes-day');
      }
    } catch (error) {
      validateGraphQlError(error);
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={getValues('title')}
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
                    Workout Programmes Day Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="program_id">Programmes</InputLabel>
                    <Controller
                      name="program_id"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Programmes"
                          error={Boolean(errors.program_id)}
                          labelId="program_id">
                          {Array.isArray(programmes) &&
                            programmes.map((programme) => (
                              <MenuItem key={programme?.id} value={programme?.id}>
                                {programme?.title}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    />
                    {errors.program_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.program_id.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="day_no"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="No Of Days"
                          onChange={onChange}
                          placeholder="Number Of Days"
                          error={Boolean(errors.title)}
                        />
                      )}
                    />
                    {errors.day_no && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.day_no.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

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
  let [programmesRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_WORKOUT_PROGRAMS
    })
  ]);

  return {
    props: {
      programmes: programmesRes?.data?.workoutPrograms || []
    }
  };
}

export default ProgrammeDayUpdate;
