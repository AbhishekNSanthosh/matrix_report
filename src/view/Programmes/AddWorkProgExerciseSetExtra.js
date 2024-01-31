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
import { ADD_WORKOUT_PROGRAMS_EXERCISE_SET_EXTRA } from '@/graphql/Workout/Programmes/program-exercise-set';
//import { useEffect } from 'react';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const defaultValues = {
  name: '',
  set_id: '',
  value: ''
};
const schema = yup.object().shape({
  name: yup.string().required('Please enter Name')
});

const AddWorkProgExerciseSetExtra = (props) => {
  const { open, onClose, set_id } = props;

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
        mutation: ADD_WORKOUT_PROGRAMS_EXERCISE_SET_EXTRA,
        variables: {
          workout_program_exercise_set_extra_details: {
            set_id: set_id,
            name: params?.name,
            value: params?.value
          }
        }
      });

      if (data?.createWorkoutProgramExerciseSetExtra) {
        toast.success('Added exercise set Extra ');
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
        <Typography variant="h6">Add Exercise Set Extra Data</Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="enter name"
                  onChange={onChange}
                  placeholder="enter name"
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="value"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="enter value"
                  onChange={onChange}
                  placeholder="enter value"
                  error={Boolean(errors.value)}
                />
              )}
            />
            {errors.value && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.value.message}</FormHelperText>
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

export default AddWorkProgExerciseSetExtra;
