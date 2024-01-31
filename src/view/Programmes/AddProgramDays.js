import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
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
import { ADD_WORKOUT_PROGRAMS_DAY } from '@/graphql/Workout/ProgrammesDay';
import toast from 'react-hot-toast';
import { Divider } from '@mui/material';
import { useRouter } from 'next/router';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const schema = yup.object().shape({
  day_no: yup.number().required('Please enter no of days under thsi program')
});

const defaultValues = {
  day_no: ''
};

const AddProgramDays = (props) => {
  const { open, onClose } = props;

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
        mutation: ADD_WORKOUT_PROGRAMS_DAY,
        variables: {
          program_id: router?.query?.id,
          day_no: params?.day_no
        }
      });

      if (data?.createWorkoutProgramDay) {
        toast.success('No Of Days  Added!');
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
        <Typography variant="h6">Add Programme Days</Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Controller
              name="day_no"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="No Of Days"
                  onChange={onChange}
                  placeholder="No Of Days"
                  error={Boolean(errors.day_no)}
                />
              )}
            />
            {errors.day_no && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.day_no.message}</FormHelperText>
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

export default AddProgramDays;
