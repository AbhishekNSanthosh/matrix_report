import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Close from 'mdi-material-ui/Close';
import { generalApoloClient } from 'src/config/apolloClient';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { Divider, InputLabel, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  ADD_WORKOUT_PROGRAMS_EXERCISE,
  GET_ALL_EXERCISE
} from '@/graphql/Workout/Programmes/program-exercise';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const defaultValues = {
  exercise_ids: []
};

const schema = yup.object().shape({
  exercise_ids: yup.array().min(1).required('Please select exercises under the day')
});

const AddWorkProgExercise = (props) => {
  const { open, onClose } = props;

  const [exercises, setExercises] = useState([]);

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchAllExercises = async () => {
    setLoading(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_EXERCISE
      });

      if (data?.exerciseLibraries) {
        setExercises(data?.exerciseLibraries?.data);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExercises();
  }, [open]);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_WORKOUT_PROGRAMS_EXERCISE,
        variables: {
          program_id: router?.query?.id,
          day_id: router?.query?.day_id,
          exercise_ids: params?.exercise_ids
        }
      });

      if (data?.createWorkoutProgramExercise) {
        toast.success('Added exercises');
        handleClose();
        const url = {
          pathname: router.pathname,
          query: router.query
        };
        router.replace(url, undefined, { shallow: true, scroll: true });
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

  const handleClose = () => {
    onClose(false);
    reset(defaultValues);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}>
      <Header>
        <Typography variant="h6">Add Day Exercises</Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="exercise_ids">Exercises</InputLabel>
            <Controller
              name="exercise_ids"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  multiple
                  disabled={loading}
                  onChange={onChange}
                  value={value || []}
                  label="Exercises"
                  error={Boolean(errors?.exercise_ids)}
                  labelId="exercise_ids">
                  {exercises?.map((exercise) => (
                    <MenuItem key={exercise?.id} value={exercise?.id}>
                      {exercise?.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors?.exercise_ids && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors?.exercise_ids?.message}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton
              loading={isSubmitting}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}>
              Submit
            </LoadingButton>
            <Button size="large" variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddWorkProgExercise;
