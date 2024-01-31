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
import { Divider, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { ADD_WORKOUT_PROGRAMS_EXERCISE_SET } from '@/graphql/Workout/Programmes/program-exercise-set';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const defaultValues = {
  reps: '',
  rest_time: '',
  tempo: '',
  weight: ''
};

const schema = yup.object().shape({
  reps: yup.string().required('Please enter Reps'),
  rest_time: yup.string().required('Please enter rest time'),
  tempo: yup.string().required('Please enter temp'),
  weight: yup.string().required('Please enter temp')
});

const AddWorkProgExerciseSet = (props) => {
  const { open, onClose, exerciseId } = props;

  const router = useRouter();
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
        mutation: ADD_WORKOUT_PROGRAMS_EXERCISE_SET,
        variables: {
          workout_program_exercise_set_details: {
            program_id: router?.query?.id,
            program_exercise_id: exerciseId,
            reps: params?.reps,
            rest_time: params?.rest_time,
            tempo: params?.tempo,
            weight: params?.weight
          }
        }
      });

      if (data?.createWorkoutProgramExerciseSet) {
        toast.success('Added exercise set');
        handleClose();

        const url = {
          pathname: router.pathname,
          query: router.query
        };
        router.replace(url, undefined, { shallow: true });
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
        <Typography variant="h6">Add Programme Exercises Set </Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="weight"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label={'Enter Weight'}
                  onChange={onChange}
                  placeholder={'10 Kg'}
                  error={Boolean(errors.weight)}
                />
              )}
            />
            {errors.weight && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors?.weight?.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="reps"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Enter REPS"
                  onChange={onChange}
                  placeholder="No Of REPS"
                  error={Boolean(errors.reps)}
                />
              )}
            />
            {errors.reps && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.reps.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="tempo"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Enter Tempo"
                  onChange={onChange}
                  placeholder="Enter Tempo"
                  error={Boolean(errors.tempo)}
                />
              )}
            />
            {errors.tempo && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tempo.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="rest_time"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Enter Rest Of Time"
                  onChange={onChange}
                  placeholder="Rest Of Time"
                  error={Boolean(errors.rest_time)}
                />
              )}
            />
            {errors.rest_time && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.rest_time.message}
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

export default AddWorkProgExerciseSet;
