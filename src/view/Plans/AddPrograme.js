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
import { GET_ALL_WORKOUT_PROGRAMS } from '@/graphql/Workout/Programmes';
import { ADD_PLAN_PROGRAM } from '@/graphql/workout-plan';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const defaultValues = {
  program_id: ''
};

const schema = yup.object().shape({
  program_id: yup.string().min(1).required('Please select a programe')
});

const AddPrograme = (props) => {
  const { open, onClose, planId } = props;

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchAllExercises = async () => {
    setLoading(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_WORKOUT_PROGRAMS
      });

      if (data?.workoutPrograms) {
        setPrograms(data?.workoutPrograms);
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
        mutation: ADD_PLAN_PROGRAM,
        variables: {
          program_id: params?.program_id,

          workout_plan_option_id: planId
        }
      });

      if (data?.addWPOPrograms) {
        toast.success('Added program');
        handleClose();
        router.push(`/workout-plan/${planId}`);
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.day_no) {
        setError('day_no', { message: errorData.day_no });
      }
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
        <Typography variant="h6">Add Programme</Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="p_id">Programe</InputLabel>
            <Controller
              name="program_id"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={loading}
                  onChange={onChange}
                  value={value}
                  label="Programes"
                  error={Boolean(errors?.program_id)}
                  labelId="p_id">
                  {programs?.map((program) => (
                    <MenuItem key={program?.id} value={program?.id}>
                      {program?.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors?.program_id && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors?.program_id?.message}
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

export default AddPrograme;
